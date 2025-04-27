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
        $pdf->SetMargins(20, 10, 20);
    
        
        // Draw border around entire page
        $pdf->Rect(10, 10, 190, 277);
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
}

    private function generatePage2($pdf, $employee)
    {
        $pdf->SetFont('dejavusans', '', 14);
        $pdf->Cell(0, 10, 'الصفحة الثانية', 0, 1, 'C');
        // Add content for page 2 based on the second image
    }

    private function generatePage3($pdf, $employee)
    {
        $pdf->SetFont('dejavusans', '', 14);
        $pdf->Cell(0, 10, 'الصفحة الثالثة', 0, 1, 'C');
        // Add evaluation grid based on the third image
    }

    private function generatePage4($pdf, $employee)
    {
        $pdf->SetFont('dejavusans', '', 14);
        $pdf->Cell(0, 10, 'الصفحة الرابعة', 0, 1, 'C');
        // Add training section based on the fourth image
    }
}