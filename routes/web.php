<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\EmployeeNoteController;
use App\Http\Controllers\EmployeePromotionController;
use App\Http\Controllers\AnnualReportController;






require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


    

// مسارات بطاقات التنقيط
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/',[EmployeeController::class , 'index'])->name('home');
    
    Route::resource('employees', EmployeeController::class);

    Route::post('/employees/import', [ImportController::class, 'import'])->name('employees.import');
    Route::get('/employees/import/results', [ImportController::class, 'results'])->name('import.results'); 


    Route::get('/employee-notes', [EmployeeNoteController::class, 'index'])->name('employee-notes.index');
    Route::get('/employee-notes/{employee}', [EmployeeNoteController::class, 'show'])->name('employee-notes.show');
    Route::get('/employee-notes/{employee}/create', [EmployeeNoteController::class, 'create'])->name('employee-notes.create');
    Route::post('/employee-notes/{employee}', [EmployeeNoteController::class, 'store'])->name('employee-notes.store');
    Route::get('/employee-notes/{employee}/{note}/edit', [EmployeeNoteController::class, 'edit'])->name('employee-notes.edit');
    Route::put('/employee-notes/{employee}/{note}', [EmployeeNoteController::class, 'update'])->name('employee-notes.update');
    Route::delete('/employee-notes/{employee}/{note}', [EmployeeNoteController::class, 'destroy'])->name('employee-notes.destroy');
    Route::get('/employee-notes/{employee}/{employeeNote}/export-pdf', [EmployeeNoteController::class, 'generatePDF'])->name('employee-notes.export-pdf');
    
    Route::get('/promotions', [EmployeePromotionController::class, 'index'])->name('promotions.index');
    // Add this with your other promotion routes
    Route::get('/promotions/export-pdf', [EmployeePromotionController::class, 'exportPdf'])->name('promotions.export-pdf');
    Route::get('/annual-reports', [AnnualReportController::class, 'index'])->name('annual-reports.index');
    Route::get('/annual-reports/{employee}', [AnnualReportController::class, 'generatePDF'])->name('annual-reports.generate');
});
