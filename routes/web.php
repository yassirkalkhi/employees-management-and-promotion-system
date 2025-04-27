<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\EmployeeNoteController;
use App\Http\Controllers\EmployeePromotionController;
use App\Http\Controllers\AnnualReportController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::resource('employees', EmployeeController::class)
    ->middleware(['auth', 'verified']);
    
Route::post('/employees/import', [ImportController::class, 'import'])->name('employees.import');

// مسارات بطاقات التنقيط
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/employee-notes', [EmployeeNoteController::class, 'index'])->name('employee-notes.index');
    Route::get('/employee-notes/{employee}', [EmployeeNoteController::class, 'show'])->name('employee-notes.show');
    Route::get('/employee-notes/{employee}/create', [EmployeeNoteController::class, 'create'])->name('employee-notes.create');
    Route::post('/employee-notes/{employee}', [EmployeeNoteController::class, 'store'])->name('employee-notes.store');
    Route::get('/employee-notes/{employee}/{note}/edit', [EmployeeNoteController::class, 'edit'])->name('employee-notes.edit');
    Route::put('/employee-notes/{employee}/{note}', [EmployeeNoteController::class, 'update'])->name('employee-notes.update');
    Route::delete('/employee-notes/{employee}/{note}', [EmployeeNoteController::class, 'destroy'])->name('employee-notes.destroy');
    Route::get('/employee-notes/{employee}/{employeeNote}/export-pdf', [EmployeeNoteController::class, 'generatePDF'])
        ->name('employee-notes.export-pdf')
        ->middleware(['auth', 'verified']);
    Route::get('/promotions', [EmployeePromotionController::class, 'index'])->name('promotions.index');
    Route::middleware('auth')->group(function () {
        Route::get('/annual-reports', [AnnualReportController::class, 'index'])->name('annual-reports.index');
        Route::get('/annual-reports/{employee}', [AnnualReportController::class, 'generatePDF'])->name('annual-reports.generate');
    });
});
