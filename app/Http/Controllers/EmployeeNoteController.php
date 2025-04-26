<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeNote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class EmployeeNoteController extends Controller
{
    public function index()
    {
        $employees = Employee::select('id', 'nom_famille', 'prenom', 'numero_cin', 'numero_embauche', 'grade', 'rang')
            ->orderBy('nom_famille')
            ->get();
            
        return Inertia::render('EmployeeNotes/Index', [
            'employees' => $employees
        ]);
    }
    
    public function show(Employee $employee)
    {
        $notes = $employee->notes()
            ->orderBy('year', 'desc')
            ->get();
            
        return Inertia::render('EmployeeNotes/Show', [
            'employee' => $employee,
            'notes' => $notes
        ]);
    }
    
    public function create(Employee $employee)
    {
        $currentYear = date('Y');
        $years = range(2006, $currentYear);
        $usedYears = $employee->notes()->pluck('year')->toArray();
        $availableYears = array_diff($years, $usedYears);
        Log::info('Available years: '. implode(', ', $availableYears));
        return Inertia::render('EmployeeNotes/Create', [
            'employee' => $employee,
            'availableYears' => $availableYears
        ]);
    }
    
    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2006|max:' . date('Y'),
            'productivity' => 'required|numeric|min:0|max:5',
            'organization' => 'required|numeric|min:0|max:3',
            'professional_conduct' => 'required|numeric|min:0|max:4',
            'innovation' => 'required|numeric|min:0|max:3',
            'job_performance' => 'required|numeric|min:0|max:5',
            'notes' => 'nullable|string',
            'productivity_comment' => 'nullable|string',
            'organization_comment' => 'nullable|string',
            'professional_conduct_comment' => 'nullable|string',
            'innovation_comment' => 'nullable|string',
            'job_performance_comment' => 'nullable|string',
        ]);
        
        // التحقق من عدم وجود تنقيط للسنة المحددة
        if ($employee->notes()->where('year', $validated['year'])->exists()) {
            return back()->withErrors(['year' => 'يوجد بالفعل تنقيط لهذه السنة']);
        }
        
        $note = new EmployeeNote($validated);
        $note->employee_id = $employee->id;
        
        // حساب المجموع والميزة ونسق الترقية
        $note->total_score = $note->calculateTotal();
        $note->grade = $note->calculateGrade();
        $note->promotion_pace = $note->calculatePromotionPace();
        
        $note->save();
        
        return redirect()->route('employee-notes.show', $employee->id)
            ->with('success', 'تم إضافة بطاقة التنقيط بنجاح');
    }
    
    public function edit(Employee $employee, EmployeeNote $note)
    {
        return Inertia::render('EmployeeNotes/Edit', [
            'employee' => $employee,
            'note' => $note
        ]);
    }
    
    public function update(Request $request, Employee $employee, EmployeeNote $note)
    {
        $validated = $request->validate([
            'productivity' => 'required|numeric|min:0|max:5',
            'organization' => 'required|numeric|min:0|max:3',
            'professional_conduct' => 'required|numeric|min:0|max:4',
            'innovation' => 'required|numeric|min:0|max:3',
            'job_performance' => 'required|numeric|min:0|max:5',
            'notes' => 'nullable|string',
            'productivity_comment' => 'nullable|string',
            'organization_comment' => 'nullable|string',
            'professional_conduct_comment' => 'nullable|string',
            'innovation_comment' => 'nullable|string',
            'job_performance_comment' => 'nullable|string',
        ]);
        
        $note->update($validated);
        
        // إعادة حساب المجموع والميزة ونسق الترقية
        $note->total_score = $note->calculateTotal();
        $note->grade = $note->calculateGrade();
        $note->promotion_pace = $note->calculatePromotionPace();
        $note->save();
        
        return redirect()->route('employee-notes.show', $employee->id)
            ->with('success', 'تم تحديث بطاقة التنقيط بنجاح');
    }
    
    public function destroy(Employee $employee, EmployeeNote $note)
    {
        $note->delete();
        
        return redirect()->route('employee-notes.show', $employee->id)
            ->with('success', 'تم حذف بطاقة التنقيط بنجاح');
    }


    


public function generatePDF(Employee $employee, EmployeeNote $employeeNote) 
{
    // Get year from employee note
    $year = $employeeNote->year;

    // Calculate total score from employee note fields
    $totalScore = $employeeNote->productivity + 
                 $employeeNote->organization + 
                 $employeeNote->professional_conduct + 
                 $employeeNote->innovation + 
                 $employeeNote->job_performance;

    // Create new TCPDF instance
    $pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

    // Set document info
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('EST');
    $pdf->SetTitle('بطاقة التنقيط الفردية'."".$year);

    // Set margins
    $pdf->SetMargins(4, 4, 4);

    // Add page
    $pdf->AddPage();

    // Configure dimensions
    $margin = 4;
    $pageWidth = $pdf->getPageWidth() - 2 * $margin;
    
    // Column widths
    $frColWidth = $pageWidth * 0.50;
    $logoColWidth = $pageWidth * 0.15; 
    $arColWidth = $pageWidth * 0.35;
    
    $startY = 2;
    $headerHeight = 33;

    // Border settings
    $pdf->SetDrawColor(0, 0, 0);
    $pdf->SetLineWidth(0.2);

    // Left column (French)
    $pdf->Rect($margin, $startY , $frColWidth, $headerHeight - 7);
    
    $frLines = [
        "Ministère de l'Education Nationale, de l'Enseignement Supérieur,",
        "de la Formation des Cadres et de la Recherche Scientifique",
        "Département de l'Enseignement Supérieur de la Formation ",
        "des Cadres et de la Recherche Scientifique", 
        "Université Cadi Ayyad",
        "La Présidence"
    ];
    
    $pdf->SetFont('Times', 'B', 9);
    $lineHeight = 4;
    $startYText = ($startY - 4) + ($headerHeight - (count($frLines) * $lineHeight)) / 2;
    
    foreach ($frLines as $line) {
        $pdf->SetXY($margin, $startYText);
        $pdf->Cell($frColWidth, $lineHeight, $line, 0, 2, 'C');
        $startYText += $lineHeight;
    }

    // Center column (Logo)
    $pdf->Rect($margin + $frColWidth, $startY, $logoColWidth, $headerHeight - 7);
    
    $logoWidth = 25;
    $logoX = $margin + $frColWidth + ($logoColWidth - $logoWidth) / 2;
    $logoY = ($startY - 4) + ($headerHeight - $logoWidth) / 2;
    $pdf->Image(public_path('images/fst1.png'), $logoX, $logoY, $logoWidth);

    // Right column (Arabic)
    $pdf->Rect($margin + $frColWidth + $logoColWidth, $startY, $arColWidth, $headerHeight -7);
    
    // Arabic settings
    $pdf->SetFont('aealarabiya', '', 12);
    $pdf->SetRTL(true);
    
    $arText = "وزارة التربية الوطنية والتعليم العالي\n"
            . "و تكوين الأطر و البحث العلمي\n"
            . "قطاع التعليم العالي و تكوين الأطر\n"
            . "و البحث العلمي\n"
            . "جامعة القاضي عياض - الرئاسة";
    
    $pdf->SetXY($margin + 2, ($startY - 3) + 2);
    $pdf->MultiCell($arColWidth - 4, 5, $arText, 0, 'R');

    // Disable RTL
    $pdf->SetRTL(false);

    // Main content
    $pdf->SetY(($startY) + $headerHeight + 0.5);
    $pdf->SetFont('dejavusans', '', 12);
    $pdf->Cell(0, 10, "   بطــاقـــــــــــة التنقيـــــــط الفرديـــــــــــة برسم سنـــــــــة " . $year, 0, 1, 'C');

    // Employee identity section
    $sectionY = $pdf->GetY() + 2; // Reduced from 5 to 3
    $pdf->SetFont('aealarabiya', 'B', 12); // Already reduced from 14 to 12
    $pdf->Cell(0, 10, "1- هوية الموظف", 0, 1, 'R'); // Already reduced from 14 to 10

    // Draw rectangle - reduced height
    $pdf->Rect($margin, $sectionY, $pageWidth, 69); // Reduced from 75 to 70

    // Add separator line - adjusted position
    $pdf->Line($margin, $sectionY + 8, $margin + $pageWidth, $sectionY + 8); // Reduced from 9 to 8

    // Employee info content
    $pdf->SetFont('aealarabiya', '', 10);
    $pdf->SetXY($margin + 4, $sectionY + 10);

    // Employee data arrays
    $employeeData2 = [
        ['الاسم العائلي:', $employee->nom_famille],
        ['الاسم الشخصي:', $employee->prenom],
        ['تاريخ الازدياد:', $employee->date_naissance instanceof \DateTime ? $employee->date_naissance->format('Y-m-d') : $employee->date_naissance],
        ['الحالة العائلية:', $employee->situation_familiale],
        ['الإطار ومقر التعيين:', $employee->cadre."".$employee->lieu_affectation],
        ['تاريخ التعيين في الدرجة:', $employee->date_grade ? date('Y-m-d', strtotime($employee->date_grade)) : ''],
        ['الرتبة:', $employee->rang],
        ['تاريخ ولوج الوظيفة العمومية:', $employee->date_entree_fonction_publique ? date('Y-m-d', strtotime($employee->date_entree_fonction_publique)) : ''],
        ['الوظيفة المزاولة حاليا:', $employee->fonction_actuelle],
        ['   منذ  :', $employee->date_fonction_actuelle ? date('Y-m-d', strtotime($employee->date_fonction_actuelle)) : ''],
    ];

    $employeeData = [
        
        ['رقم ب.ت.و:', $employee->numero_cin],
        ['رقم التأجير:', $employee->numero_embauche],
        ['مكان الازدياد:', $employee->lieu_naissance],
        ['عدد الأطفال:', $employee->nombre_enfants],
        ['تاريخ المفعول:', $employee->date_effet ? date('Y-m-d', strtotime($employee->date_effet)) : ''],
     

       

    ];

    $lineHeight = 4.5; // Reduced line height
    $labelWidth = 50;
    $sideMargin = 5; // Added side margin 
    $valueWidth = ($pageWidth / 2) - $labelWidth - $sideMargin - 15;
    $currentY = $sectionY + 10; // Reduced top margin
    $maxLines = max(count($employeeData), count($employeeData2));
    for ($i = 0; $i < $maxLines; $i++) {
        // Left column
        if (isset($employeeData[$i])) {
            $pdf->SetXY($margin + ($pageWidth / 2) - $labelWidth - $sideMargin, $currentY);
            $pdf->Cell($labelWidth, $lineHeight, $employeeData[$i][0], 0, 0, 'R');
            
            $pdf->SetXY($margin + 10 + $sideMargin, $currentY);
            $pdf->Cell($valueWidth, $lineHeight, $employeeData[$i][1], 0, 0, 'R');
        }
        // Right column  
        if (isset($employeeData2[$i])) {
            $pdf->SetXY($margin + $pageWidth - $labelWidth - $sideMargin, $currentY);
            $pdf->Cell($labelWidth, $lineHeight, $employeeData2[$i][0], 0, 0, 'R');
            
            $pdf->SetXY($margin + ($pageWidth / 2) + 10 + $sideMargin, $currentY);
            $pdf->Cell($valueWidth, $lineHeight, $employeeData2[$i][1], 0, 0, 'R');
        }

        $currentY += $lineHeight;
    }
    // Evaluation criteria section
    $evaluationY = $sectionY + 59;
    $pdf->SetY($evaluationY);
    $pdf->SetFont('aealarabiya', 'B', 12); // تصغير حجم الخط من 14 إلى 12
    $pdf->Cell(0, 10, "2- النقطة الممنوحة  ", 0, 1, 'R'); // تقليل ارتفاع الخلية من 14 إلى 10

    // Draw evaluation section rectangle
    $pdf->Rect($margin, $evaluationY, $pageWidth, 63); // تقليل الارتفاع من 100 إلى 90

    // Add side margins to table
    $tableMargin = 5;
    $tableWidth = $pageWidth - (2 * $tableMargin);

    // Column widths with margins
    $colWidth1 = $tableWidth * 0.05;
    $colWidth2 = $tableWidth * 0.35;
    $colWidth3 = $tableWidth * 0.20;
    $colWidth4 = $tableWidth * 0.20;
    $colWidth5 = $tableWidth * 0.20;

    // Table headers
    $pdf->SetY($evaluationY + 12); // تقليل المسافة من 15 إلى 12
    $pdf->SetX($margin + $tableMargin);
    $pdf->SetFont('', '', 10); // تصغير حجم الخط من 12 إلى 10
    
    $pdf->Cell($colWidth5, 7, 'ملاحظـــــــــات', 1, 0, 'C'); // تقليل ارتفاع الخلية من 8 إلى 7
    $pdf->Cell($colWidth4, 7, 'النقطة الممنوحة', 1, 0, 'C');
    $pdf->Cell($colWidth3, 7, 'سلم التنقيط', 1, 0, 'C');
    $pdf->Cell($colWidth2, 7, 'عناصر التنقيط', 1, 0, 'R');
    $pdf->Cell($colWidth1, 7, 'الرقم', 1, 1, 'L');

    // Evaluation criteria
    $evaluationCriteria = [
        ['num' => '1', 'critere' => 'إنجاز المهام المرتبطة بالوظيفة', 'echelle' => 'من 0 إلى 5', 'note' => $employeeNote->job_performance, 'comment' => $employeeNote->job_performance_comment, 'max_note' => 5],
        ['num' => '2', 'critere' => 'المردودية', 'echelle' => 'من 0 إلى 5', 'note' => $employeeNote->productivity, 'comment' => $employeeNote->productivity_comment, 'max_note' => 5],
        ['num' => '3', 'critere' => 'القدرة على التنظيم', 'echelle' => 'من 0 إلى 3', 'note' => $employeeNote->organization, 'comment' => $employeeNote->organization_comment, 'max_note' => 3],
        ['num' => '4', 'critere' => 'السلوك المهني', 'echelle' => 'من 0 إلى 4', 'note' => $employeeNote->professional_conduct, 'comment' => $employeeNote->professional_conduct_comment, 'max_note' => 4],
        ['num' => '5', 'critere' => 'البحث والابتكار', 'echelle' => 'من 0 إلى 3', 'note' => $employeeNote->innovation, 'comment' => $employeeNote->innovation_comment, 'max_note' => 3]
    ];

    foreach ($evaluationCriteria as $criteria) {
        $pdf->SetX($margin + $tableMargin);
        $pdf->SetFont('aealarabiya', '', 8); // تصغير حجم الخط من 9 إلى 8 للملاحظات
        $pdf->Cell($colWidth5, 7, $criteria['comment'], 1, 0, 'C'); // تقليل ارتفاع الخلية من 8 إلى 7
        $pdf->SetFont('aealarabiya', '', 10); // تصغير حجم الخط من 12 إلى 10
        $pdf->Cell($colWidth4, 7, $criteria['note'] . '/' . $criteria['max_note'], 1, 0, 'C');
        $pdf->Cell($colWidth3, 7, $criteria['echelle'], 1, 0, 'C');
        $pdf->Cell($colWidth2, 7, $criteria['critere'], 1, 0, 'R');
        $pdf->Cell($colWidth1, 7, $criteria['num'], 1, 1, 'L');
    }

    // Total row
    $pdf->SetX($margin + $tableMargin);
    $pdf->SetFont('aealarabiya', '', 10);
    
    $pdf->Cell($colWidth5 + $colWidth4 + $colWidth3, 7, $totalScore . '/20', 1, 0, 'C'); // تقليل ارتفاع الخلية من 8 إلى 7
    $pdf->Cell($colWidth2 + $colWidth1, 7, 'مجموع النقط الجزئية (من 0 إلى 20 )', 1, 1, 'R');
    
    // Section 3: الميـــــــزة الممنوحــــــة (Grade)
    $pdf->SetY($pdf->GetY() + 4); // Further reduced from 3 to 2
    $pdf->SetFont('aealarabiya', 'B', 12); // Smaller font
    $pdf->Cell(0, 6, "3- الميــــــزة الممنوحــــــة", 0, 1, 'R');
    
    // Draw rectangle for grade section
    $gradeY = $pdf->GetY();
    $pdf->Rect($margin, $gradeY + 1, $pageWidth, 20); // Reduced height
    
    // Grade checkboxes
    $pdf->SetY($gradeY + 4); // Reduced spacing
    $pdf->SetFont('aealarabiya', '', 10); // Smaller font
    
    // Define grades and their score ranges
    $grades = [
        'ممتاز' => [18, 20],
        'جيد جدا' => [16, 18],
        'جيد' => [14, 16],
        'متوسط' => [10, 14],
        'ضعيف' => [0, 10]
    ];
    
    // Calculate checkbox positions - SMALLER CHECKBOXES
    $checkboxWidth = 6; // Reduced from 10
    $checkboxMargin = 3; // Reduced from 5
    $labelWidth = 25; // Reduced from 30
    $totalWidth = ($checkboxWidth + $labelWidth + $checkboxMargin) * count($grades);
    $startX = $margin + ($pageWidth - $totalWidth) / 2;
    
    // Draw checkboxes and labels
    foreach ($grades as $grade => $range) {
        $pdf->SetX($startX);
        $pdf->Rect($startX, $pdf->GetY(), $checkboxWidth, $checkboxWidth);
        
        // Check the box if this is the current grade
        if (($totalScore >= $range[0] && $totalScore < $range[1]) || 
            ($grade == 'ممتاز' && $totalScore == 20)) {
            $pdf->SetFillColor(0, 0, 0);
            $pdf->Rect($startX + ($checkboxWidth/4), $pdf->GetY() + ($checkboxWidth/4), $checkboxWidth/2, $checkboxWidth/2, 'F');
        }
        
        $pdf->SetX($startX + $checkboxWidth + 1);
        $pdf->Cell($labelWidth, $checkboxWidth, $grade, 0, 0, 'R');
        $startX += $checkboxWidth + $labelWidth + $checkboxMargin;
    }
    
    // Score ranges - smaller font and spacing
    $pdf->SetY($pdf->GetY() + $checkboxWidth + 2); // Reduced spacing
    $pdf->SetFont('aealarabiya', '', 8); // Smaller font
    $startX = $margin + ($pageWidth - $totalWidth) / 2;
    
    foreach ($grades as $grade => $range) {
        $rangeText = '';
        if ($grade == 'ممتاز') {
            $rangeText = $range[0] . ' ≤ نقطة < ' . $range[1];
        } else if ($grade == 'ضعيف') {
            $rangeText = 'نقطة < ' . $range[1];
        } else {
            $rangeText = $range[0] . ' ≤ نقطة < ' . $range[1];
        }
        
        $pdf->SetX($startX);
        $pdf->Cell($checkboxWidth + $labelWidth + $checkboxMargin, 4, $rangeText, 0, 0, 'C');
        $startX += $checkboxWidth + $labelWidth + $checkboxMargin;
    }
    
    // Section 4: معدل النقط المحصل عليها (Average score)
    $pdf->SetY($pdf->GetY() + 10); // Further reduced from 5 to 3
    $pdf->SetFont('aealarabiya', 'B', 12); // Smaller font
    $pdf->Cell(0, 6, "4- معدل النقط المحصل عليها", 0, 1, 'R');
    
    // Draw rectangle for average score section
    $avgY = $pdf->GetY();
    $pdf->Rect($margin, $avgY, $pageWidth, 30); // Reduced height
    
    // Get previous scores (last 5 years)
    $previousNotes = $employee->notes()
        ->where('id', '!=', $employeeNote->id)
        ->orderBy('year', 'desc')
        ->limit(5)
        ->get();
    
    $pdf->SetY($avgY + 3); // Reduced spacing
    $pdf->SetFont('aealarabiya', '', 10); // Smaller font
    $pdf->Cell($pageWidth - 10, 6, 'تذكر بمعدل النقط المحصل عليها خلال السنوات المطلوبة للترقية في الرتبة :', 0, 1, 'R');
    
    // Display previous years' scores - more compact
    $totalPreviousScores = $totalScore; // Include current score
    $scoreCount = 1; // Start with 1 for current score
    
    $pdf->SetX($margin + 20);
    $pdf->Cell($pageWidth - 30, 5, "- نقطة السنة الأولى : " . $totalScore, 0, 1, 'R');
    
    $yearCount = 2;
    foreach ($previousNotes as $prevNote) {
        $pdf->SetX($margin + 20);
        $pdf->Cell($pageWidth - 30, 5, "- نقطة السنة " . $this->getArabicOrdinal($yearCount) . " : " . $prevNote->total_score, 0, 1, 'R');
        $totalPreviousScores += $prevNote->total_score;
        $scoreCount++;
        $yearCount++;
    }
    
    // Calculate average
    $average = $scoreCount > 0 ? round($totalPreviousScores / $scoreCount, 2) : $totalScore;
    
    $pdf->SetX($margin + 20);
    $pdf->Cell($pageWidth - 30, 5, "معدل النقط المحصل عليها : " . $average, 0, 1, 'R');
    
    // Section 5: نسق الترقية في الرتبة (Promotion pace)
    $pdf->SetY($pdf->GetY() + 8); // Further reduced from 3 to 2
    $pdf->SetFont('aealarabiya', 'B', 12); // Smaller font
    $pdf->Cell(0, 6, "5- نسق الترقية في الرتبة", 0, 1, 'R');
    
    // Draw rectangle for promotion pace section
    $paceY = $pdf->GetY();
    $pdf->Rect($margin, $paceY, $pageWidth, 20); // Reduced height
    
    // Promotion pace checkboxes
    $pdf->SetY($paceY + 3); // Reduced spacing
    $pdf->SetFont('aealarabiya', '', 10); // Smaller font
    
    // Define promotion paces and their score ranges
    $paces = [
        'سريع' => [16, 20],
        'متوسط' => [10, 16],
        'بطيء' => [0, 10]
    ];
    
    // Calculate checkbox positions for promotion pace - SMALLER CHECKBOXES
    $totalPaceWidth = ($checkboxWidth + $labelWidth + $checkboxMargin) * count($paces);
    $startX = $margin + ($pageWidth - $totalPaceWidth) / 2;
    
    // Draw checkboxes and labels for promotion pace
    foreach ($paces as $pace => $range) {
        $pdf->SetX($startX);
        $pdf->Rect($startX, $pdf->GetY(), $checkboxWidth, $checkboxWidth);
        
        // Check the box if this is the current promotion pace
        if (($totalScore >= $range[0] && $totalScore < $range[1]) || 
            ($pace == 'سريع' && $totalScore == 20)) {
                $pdf->SetFillColor(0, 0, 0);
                $pdf->Rect($startX + ($checkboxWidth/4), $pdf->GetY() + ($checkboxWidth/4), $checkboxWidth/2, $checkboxWidth/2, 'F');
        }
        
        $pdf->SetX($startX + $checkboxWidth + 1);
        $pdf->Cell($labelWidth, $checkboxWidth, $pace, 0, 0, 'R');
        $startX += $checkboxWidth + $labelWidth + $checkboxMargin;
    }
    
    // Score ranges for promotion pace - smaller font
    $pdf->SetY($pdf->GetY() + $checkboxWidth + 2); // Reduced spacing
    $pdf->SetFont('aealarabiya', '', 8); // Smaller font
    $startX = $margin + ($pageWidth - $totalPaceWidth) / 2;
    
    foreach ($paces as $pace => $range) {
        $rangeText = '';
        if ($pace == 'سريع') {
            $rangeText = $range[0] . ' ≤ نقطة';
        } else if ($pace == 'بطيء') {
            $rangeText = 'نقطة < ' . $range[1];
        } else {
            $rangeText = $range[0] . ' ≤ نقطة < ' . $range[1];
        }
        
        $pdf->SetX($startX);
        $pdf->Cell($checkboxWidth + $labelWidth + $checkboxMargin, 4, $rangeText, 0, 0, 'C');
        $startX += $checkboxWidth + $labelWidth + $checkboxMargin;
    }
    
    // Signature section - more compact
    $pdf->SetY($pdf->GetY() + 10); // Reduced from 8 to 6
    $pdf->SetFont('aealarabiya', '', 10); // Smaller font
    $pdf->Cell($pageWidth / 2, 6, "توقيع الإدارة أو السلطة المفوض لها:", 0, 0, 'R');
    $pdf->Cell($pageWidth / 2, 6, "حرر بـ:", 0, 1, 'R');
    
    // Output PDF
    return $pdf->Output('evaluation.pdf', 'I');
}

// Helper method to convert numbers to Arabic ordinals
private function getArabicOrdinal($number) {
    $ordinals = [
        1 => 'الأولى',
        2 => 'الثانية',
        3 => 'الثالثة',
        4 => 'الرابعة',
        5 => 'الخامسة',
        6 => 'السادسة'
    ];
    
    return isset($ordinals[$number]) ? $ordinals[$number] : $number;
}

}