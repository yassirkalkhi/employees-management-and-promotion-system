<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeNote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use TCPDF;
use Log;

class AnnualReportController extends Controller
{
    public function index()
    {
        $employees = Employee::select('id', 'nom_famille', 'prenom', 'numero_embauche')->get();
        
        return Inertia::render('AnnualReports/Index', [
            'employees' => $employees
        ]);
    }

    public function generatePDF(Request $request, Employee $employee)
    {
        // Create new PDF document
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8');
        
        // Set document information
        $pdf->SetCreator('EST Safi');
        $pdf->SetAuthor('EST Safi');
        $pdf->SetTitle('التقرير السنوي للموظف');

        // Set RTL mode
        $pdf->setRTL(true);
        
        // Remove default header/footer
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        
        // Set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        
        // Set margins
        $pdf->SetMargins(20, 20, 20);
        
        // Set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, 20);
        
        // Set font for Arabic text
        $pdf->SetFont('dejavusans', '', 12);

        // Add pages
        // Page 1 - Employee Identity
        $pdf->AddPage();
        $this->generatePage1($pdf, $employee);

        // Page 2 - Goals and Requirements
        $pdf->AddPage();
        $this->generatePage2($pdf, $employee);

        // Page 3 - Evaluation Grid
        $pdf->AddPage();
        $this->generatePage3($pdf, $employee);

        // Page 4 - Training
        $pdf->AddPage();
        $this->generatePage4($pdf, $employee);

        // Output PDF
        return response($pdf->Output('annual_report.pdf', 'I'), 200)
            ->header('Content-Type', 'application/pdf');
    }

    private function generatePage1($pdf, $employee)
        {
        Log::info('Generating Page 1 for employee: ' . $employee);
        // Set RTL direction for Arabic text
        $pdf->setRTL(true);
        
        // Set margins
        $pdf->SetMargins(12, 10, 12);
    
   
        // Employee Identity Section
        $pdf->SetFont('dejavusans', '', 10);
        $pdf->Cell(0, 7, '1- هوية الموظف', 1, 1, 'R');
        $pdf->Ln(3); 

        // Draw box around employee identity section
        $startY = $pdf->GetY();
        
        // Table with two columns
        $pdf->SetFillColor(255, 255, 255);
        $pdf->Cell(95, 7, '- الاسم العائلي ' .' : '. $employee->nom_famille, 0, 0, 'R', true);
        $pdf->Cell(70, 7, ' رقم ب.ت.و'  .' : '. $employee->numero_cin, 0, 1, '', true);
         
        $pdf->Cell(95, 7, '- الاسم الشخصي ' .' : '. $employee->prenom, 0, 0, 'R', true);
        $pdf->Cell(70, 7, 'رقم التأجير ' .' : '. $employee->numero_embauche, 0, 1, 'R', true);
        
        $pdf->Cell(95, 7,'- تاريخ الازدياد ' .' : '. $employee->date_naissance, 0, 0, 'R', true);
        $pdf->Cell(70, 7,'مكان الازدياد: ' .' : '. $employee->lieu_naissance, 0, 1, 'R', true);
        
        $pdf->Cell(95, 7,'- العنوان ' .' : '. $employee->adresse, 0, 0, 'R', true);
        $pdf->Cell(70, 7,'' , 0, 1, 'R', true);
    
        $pdf->Cell(95, 7, '- الحالة العائلية ' .' : '. $employee->situation_familiale, 0, 0, 'R', true);
        $pdf->Cell(70, 7,'عدد الأطفال ' .' : '. $employee->nombre_enfants, 0, 1, 'R', true);
        
        // Professional Path Section
        $pdf->Cell(0, 7, '2- المسار المهني', 1, 1, 'R');
        $pdf->Ln(3); 
        
        // Draw box around professional path section
        $startY = $pdf->GetY();

        $pdf->Cell(95, 7,'- الإطــار ومقر التعيين', 0, 0, 'R', true);
        $pdf->Cell(70, 7,'المدرسة العليا للتكنولوجيا - آسفي ' , 0, 1, 'R', true);
        
        $pdf->Cell(95, 7, '- تاريخ التعيين في الدرجة', 0, 0, 'R', true);
        $pdf->Cell(70, 7, $employee->date_grade, 0, 1, 'R', true);
    
        $pdf->Cell(95, 7,   '- الرتبة' .' : '. $employee->rang, 0, 0, 'R', true);
        $pdf->Cell(70, 7,'تاريخ المفعول' .' : '. $employee->date_effet , 0, 1, 'R', true);
        
        $pdf->Cell(95, 7,'- تاريخ ولوج الوظيفة العمومية', 0, 0, 'R', true);
        $pdf->Cell(70, 7, $employee->date_entree_fonction_publique, 0, 1, 'R', true);
        
        $pdf->Cell(95, 7, 'الوظائف المزاولة سابقا', 0, 0, 'R', true);
        $pdf->Cell(70, 7, '', 0, 1, 'R', true);
        
        $pdf->Cell(95, 7, 'الوظيفة المزاولة حاليا', 0, 0, 'R', true);
        $pdf->Cell(70, 7,$employee->fonction_actuelle , 0, 1, 'R', true);
        
        // Points section with multiline cells
        $pdf->Cell(95, 7, 'النقط المحصل عليها خلال المدة المعتمدة للتقييم : من', 0, 0, 'R', true);
        $pdf->Cell(70, 7, 'الى', 0, 1, 'R', true);
        
        $pdf->Cell(95, 7, 'النقط المحصل عليها خلال المدة للترسيم في حالة ترسيم', 0, 0, 'R', true);
        $pdf->Cell(70, 7,'' , 0, 1, 'R', true);
        
        $pdf->Cell(95, 7, 'النقط المحصل عليها خلال المدة المطلوبة للترقي في الدرجة', 0, 0, 'R', true);
        $pdf->Cell(70, 7, 'المدة المعتمدة للتقييم السابق ', 0, 1, 'R', true);
        
        $pdf->Cell(95, 7, 'المدة المعتمدة للتقييم الحالي', 0, 0, 'R', true);
        $pdf->Cell(70, 7, '', 0, 1, 'R', true);
        
        // Professional Behavior Section
        $pdf->Cell(0, 7, '3- السلوك المهني خلال مدة التقييم', 1, 1, 'R');
        $pdf->Ln(3); 
        
        // Draw box around professional behavior section
        $startY = $pdf->GetY();
        
        $pdf->Cell(0, 7, 'التشجيعات (أوسمة، جوائز تنويهات ..)', 0, 1, 'R', true);
        $pdf->Cell(0, 7, 'نوع التشجيع :', 0, 1, 'R', true);
        $pdf->Cell(0, 7, 'مناسبة الحصول عليه:', 0, 1, 'R', true);
        $pdf->Cell(0, 7, 'تاريخ الحصول عليه :', 0, 1, 'R', true);
        
        $pdf->Cell(0, 7, '- العقوبات التأديبية :', 0, 1, 'R', true);
        
        // Punishments section
        $pdf->SetFont('dejavusans', '', 8);
        $pdf->Cell(90, 5, 'العقوبة', 0, 0, 'R', true);
        $pdf->Cell(70, 5, 'التاريخ', 0, 1, 'R', true);
    
        
        $pdf->Cell(90, 5, 'العقوبة', 0, 0, 'R', true);
        $pdf->Cell(70, 5,'التاريخ' , 0, 1, 'R', true);
        
        $pdf->Cell(90, 5,'العقوبة', 0, 0, 'R', true);
        $pdf->Cell(70, 5,'التاريخ' , 0, 1, 'R', true);
        
        $pdf->Cell(90, 5,'العقوبة', 0, 0, 'R', true);
        $pdf->Cell(70, 5,  'التاريخ', 0, 1, 'R', true);
        $pdf->SetFont('dejavusans', '', 8);
        $pdf->Cell(0, 7, '- ملاحظات أخرى في ملف الموظف صادرة عن السلطة التسلسلية ( الاستفسارات .....)', 0, 1, 'R', true);
        $pdf->Cell(0, 7, '', 0, 1, 'R', true); 
        $pdf->Cell(0, 7, '', 0, 1, 'R', true);
        $pdf->SetFont('dejavusans', '', 10);
        // Training Section
        $pdf->Cell(0, 7, '4- التكوين', 0, 1, 'R');
        $pdf->Ln(3); 
        
        // Draw box around training section
        $startY = $pdf->GetY();
        
        // Header row for training certificates table
        $pdf->SetFont('dejavusans', '', 6);
        $pdf->Cell(40, 6, 'الشواهد المحصل عليها  أو التكوين المتبع *', 1, 0, 'C', true);
        $pdf->SetFont('dejavusans', '', 10);
        $pdf->Cell(30, 6,'مجال التكوين', 1, 0, 'C', true);
        $pdf->Cell(40, 6,'السنة' , 1, 0, 'C', true);
        $pdf->Cell(30, 6,'المعهد أو المؤسسة', 1, 0, 'C', true);
        $pdf->Cell(30, 6,'المدينة' , 1, 1, 'C', true);

        // Empty rows for data
        for ($i = 0; $i < 3; $i++) {
            $pdf->Cell(40, 8, '', 1, 0, 'C', true);
            $pdf->Cell(30, 8, '', 1, 0, 'C', true);
            $pdf->Cell(40, 8, '', 1, 0, 'C', true);
            $pdf->Cell(30, 8, '', 1, 0, 'C', true);
            $pdf->Cell(30, 8, '', 1, 1, 'C', true);
        }
        $pdf->SetFont('dejavusans', '', 6);
        $pdf->Cell(0, 5, '(*) الدبلومات والشواهد أو التكوين المتبع منذ التحاق المعني بالأمر بالمصلحة', 0, 1, 'R');


           // Calculate height of content and draw rectangle around it
        $endY = $pdf->GetY();
        $height = $endY - $startY;
        $pdf->Rect(12, $startY - 221, 186, $height + 234);
   
   
}

    private function generatePage2($pdf, $employee)
    {
        $pdf->setRTL(true);
        
        // Set margins
        $pdf->SetMargins(12, 10, 12);
    
        
        // Employee Identity Section
        $pdf->SetFont('dejavusans', '', 10); 
        $pdf->SetFillColor(255, 255, 255);
        $pdf->Cell(70, 7, ' الاسم الشخصي والعائلي ' .' : '. $employee->nom_famille . " " .$employee->prenom , 0, 0, 'R', true);
        $pdf->Cell(70, 7, ' رقم التأجير'  .' : '. $employee->numero_cin, 0, 1, '', true);
        $pdf->Cell(0, 7, '5 - نتائج التقييم', 1, 1, 'R');
        // Get starting Y position to draw rectangle
        $startY = $pdf->GetY();

        $pdf->Cell(95, 7, 'تذكير بتوصيف الوظيفة أو متطلبات المنصب ', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 1', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 2', 0, 1, 'R', true);
        $pdf->Ln(5);

        // Calculate height of content and draw rectangle around it
        $height = $pdf->GetY() - $startY;
        $pdf->Rect(12, $startY, 186, $height);
        $pdf->Ln(5);
        $pdf->Cell(95, 7, 'الأهداف المسطرة :', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 1', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 2', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 3', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 4', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 5', 0, 1, 'R', true);
        $pdf->Ln(5);

  
        
        $pdf->Cell(95, 7, ' : الوسائل الموضوعة رهن إشارة الموظف', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 1', 0, 1, 'R', true);  
        $pdf->Ln(5);

        $pdf->Cell(95, 7, ' : ملاحظات ', 0, 1, 'R', true);
        $pdf->Cell(95, 7, '- 1', 0, 1, 'R', true);  
        $pdf->Ln(2);
        $pdf->Cell(95, 7, '- 2', 0, 1, 'R', true);  
        $pdf->Ln(2);
        $pdf->Cell(95, 7, '- 3', 0, 1, 'R', true);  
        $pdf->Ln(5);

        $pdf->Cell(95, 7, ' : النتائج المحققة ', 0, 1, 'R', true);
        $pdf->Ln(3);
        
        $pdf->Cell(3, 8,'  ' , 0, 0, 'C', true);
        $pdf->Cell(55, 8,' النتائج المرجوة ' , 1, 0, 'C', true);
        $pdf->Cell(55, 8,' النتائج المحصل عليها ', 1, 0, 'C', true);
        $pdf->Cell(55, 8,'الأسباب المفسرة للتفاوت الحاصل' , 1, 1, 'C', true);
         
          // Empty rows for data
          for ($i = 0; $i < 3; $i++) {
            $pdf->Cell(3, 15,'' , 0, 0, 'C', true);
            $pdf->Cell(55, 15,'' , 1, 0, 'C', true);
            $pdf->Cell(55, 15,'', 1, 0, 'C', true);
            $pdf->Cell(55, 15,'', 1, 1, 'C', true);
         
        }
        // Calculate height of content and draw rectangle around it
        $endY = $pdf->GetY();
        $height = $endY - $startY;
        $pdf->Rect(12, $startY - 15, 186, $height + 80);



    }

    private function generatePage3($pdf, $employee)
    {
        $pdf->setRTL(true);
        
        // Set margins
        $pdf->SetMargins(12, 10, 12);
    
        
        // Employee Identity Section
        $pdf->SetFont('dejavusans', '', 10); 
        $pdf->SetFillColor(255, 255, 255);
        $startY = $pdf->GetY();
        
        $pdf->SetFont('dejavusans', '', 10); 
        $pdf->SetFillColor(255, 255, 255);
        $pdf->Cell(70, 7, ' الاسم الشخصي والعائلي ' .' : '. $employee->nom_famille . " " .$employee->prenom , 0, 0, 'R', true);
        $pdf->Cell(70, 7, ' رقم التأجير'  .' : '. $employee->numero_cin, 0, 1, '', true);
        $pdf->Cell(0, 7, '5 -  التقدير العام', 1, 1, 'R');
        $pdf->Ln(5);

        // Create evaluation criteria table
        $pdf->SetFont('dejavusans', '', 10);
        
        // First row with merged cells
        $leftMargin = 5;
        $pdf->Cell($leftMargin);
        $pdf->Cell(70, 8, 'عناصر التنقيط', 1, 0, 'C', true);
        $pdf->Cell(100, 8, 'مستوى التقدير', 1, 1, 'C', true);
        
        // Table headers (removed the empty cell for عناصر التنقيط)
        
        $pdf->Cell($leftMargin);
        $pdf->Cell(70, 8, '', 'R', 0, 'C', true); // Only left and right borders
        $pdf->Cell(20, 8, 'غير مرضية', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'ناقصة', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'مرضية', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'جد مرضية', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'ممتازة', 1, 1, 'C', true);

        // Evaluation criteria rows
        $criteria = [
            'إنجاز المهام المرتبطة بالوظيفة',
            'المردودية',
            'القدرة على التنظيم',
            'السلوك المهني',
            'البحث و الإبتكار'
        ];

        foreach ($criteria as $criterion) {
            $pdf->Cell($leftMargin);
            $pdf->Cell(70, 8, $criterion, 1, 0, 'R', true);
            $pdf->Cell(20, 8, '', 1, 0, 'C', true);
            $pdf->Cell(20, 8, '', 1, 0, 'C', true);
            $pdf->Cell(20, 8, '', 1, 0, 'C', true);
            $pdf->Cell(20, 8, '', 1, 0, 'C', true);
            $pdf->Cell(20, 8, '', 1, 1, 'C', true);
        }
        
        $pdf->SetFont('dejavusans', '', 9);
        $pdf->Ln(7);
        $pdf->Cell(0, 7, 'تعاليق و شروحات (**)  :', 0, 1, 'R');
        $pdf->Ln(15);
        $pdf->Cell(0, 7, '(**) ضع علامة داخل الخانة المناسبة', 0, 1, 'R');
        $pdf->Cell(0, 7, '(**) يرتكز التقدير الإجمالي على نتائج. التقييم و الشروحات التي يتعين الأخذ بها من جديد بمناسبة مناقشة الموظف الخاضع للتقييم', 0, 1, 'R');
        
      
        
        $pdf->Ln(5);
        $pdf->Cell(0, 7, '7 - معدل النقط  المحصل عليها ', 1, 1, 'R');
        $pdf->Ln(5);

        $margin = 7;
        $year = date('Y');
        $previousNotes = $employee->notes()
        ->where('year', '<=', $year)
        ->orderBy('year', 'asc') 
        ->limit(4)
        ->get();

        // Initialize total and count
        $totalPreviousScores = 0;
        $scoreCount = 0;
        $arabicOrdinals = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
        $index = 0;

        // Display previous years
        $rowCount = 0;
        foreach ($previousNotes as $prevNote) {
            if ($rowCount % 3 == 0) {
                // Start new row
                if ($rowCount > 0) {
                    $pdf->Ln();
                }
                $pdf->SetX($margin + 5);
            }
        
        $ordinal = isset($arabicOrdinals[$index]) ? $arabicOrdinals[$index] : 'لاحقة';
        $pdf->Cell(60, 7, "- نقطة السنة " . $ordinal . " : " . $prevNote->total_score, 0, 0, 'R');
        
        $totalPreviousScores += $prevNote->total_score;
        $scoreCount++;
        $index++;
        $rowCount++;
    }

    // Add line break after last row if needed
    if ($rowCount > 0) {
        $pdf->Ln();
    }
        $totalScore = $employee->notes()
        ->where('year', $year)
        ->value('total_score');
        // Display current year's note
        $pdf->SetX($margin + 5);
        $pdf->Cell(0, 7, "- نقطة لسنة " . $year . " : " . $totalScore, 0, 1, 'R');

      
       

        // Calculate average
        $average = $scoreCount > 0 ? round($totalPreviousScores / $scoreCount, 2) : 0;

        // Display average
        $pdf->SetX($margin + 5);
        $pdf->Cell(0,7, "معدل النقط المحصل عليها : " . $average, 0, 1, 'R');
        $pdf->Cell(0, 7, '8 - القرار المقترح  ', 1, 1, 'R');
        $pdf->Ln(10);
        $pdf->Cell(0,7, "يقترح ترسيم المترشح في درجة : " . ' ' .$employee->rang, 0, 0, 'R');
        $pdf->Ln(10);
        $nextGrade = $employee->grade > 10 ? " رتبة استثنائية" : $employee->rang + 1;
        $pdf->Cell(0,7, "يقترح استفادة المترشح من الترقية إلى درجة :" . ' ' .$nextGrade , 0, 0, 'R');
        $pdf->Ln(15);
        $pdf->Cell(0, 7, '9 - توصيات', 1, 1, 'R');
        $pdf->Ln(10);
        $pdf->Cell(0, 7, '- الحركية', 0, 1, 'R');
        $pdf->Ln(10);
        $pdf->Cell(0, 7, ' - التكوين و التأهيل :', 0, 1, 'R');


        // Calculate height of content and draw rectangle around it
        $endY = $pdf->GetY();
        $height = $endY - $startY;
        $pdf->Rect(12, $startY , 186, $height + 30);
    }

    private function generatePage4($pdf, $employee)
    {
        $pdf->setRTL(true);
        
        // Set margins
        $pdf->SetMargins(12, 10, 12);
    
        
        // Employee Identity Section
        $pdf->SetFont('dejavusans', '', 10); 
        $pdf->SetFillColor(255, 255, 255);
        $startY = $pdf->GetY();
        
        $pdf->SetFont('dejavusans', '', 10); 
        $pdf->SetFillColor(255, 255, 255);
        $pdf->Cell(70, 7, ' الاسم الشخصي والعائلي ' .' : '. $employee->nom_famille . " " .$employee->prenom , 0, 0, 'R', true);
        $pdf->Cell(70, 7, ' رقم التأجير'  .' : '. $employee->numero_cin, 0, 1, '', true);
        $pdf->Cell(0, 7, '10 - ملاحظات الموضف الخاضع للتقييم (*) :', 1, 1, 'R');
        $pdf->Ln(70);
        $endY = $pdf->GetY();
        $height = $endY - $startY;
        $pdf->Rect(12, $startY , 186, $height + 30);
        $pdf->Ln(45);
        $pdf->Cell(0, 7, 'يمكن للموظف الخاضع التقييم أن يبدي ،إن ارتأى ذلك ، ملاحظات و أن يقدم توضيحات موجزة بشأن الوضائف المزاولة', 0, 1, 'C', true);
        $pdf->Cell(0, 7, 'و الصعوبات التي تعترضه و حاجياته للتكوين و كذا تقديراته الخاصة بوضعيته في العمل', 0, 0, 'C', true);
        $pdf->Ln(45);
        $pdf->Cell(0, 7, 'حرر في', 0, 1, 'C', true);
        $pdf->Cell(0, 7, 'اسم و صفة الموقع :', 0, 0, 'C', true);




    }
}