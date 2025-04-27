<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmployeePromotionController extends Controller
{
    
    public function index()
    {
        $employees = Employee::query()
            ->select([
                'id',
                'nom_famille',
                'prenom',
                'rang',
                'date_effet',
            ])
            ->with(['latestNote']) // Add relationship with latest evaluation
            ->get()
            ->map(function ($employee) {
                // Get promotion pace from latest note
                $promotionPace = $employee->latestNote?->promotion_pace ?? 'متوسط';
                
               
                $yearsNeeded = $this->calculateYearsNeeded($employee->rang, $promotionPace);
                // Calculate next grade date
                $nextGradeDate = $yearsNeeded ? 
                    Carbon::parse($employee->date_effet)
                        ->addYears(floor($yearsNeeded))
                        ->addMonths(($yearsNeeded - floor($yearsNeeded)) * 12)
                        ->format('Y-m-d') : 
                    null;
                   
                return [
                    'id' => $employee->id,
                    'full_name' => $employee->nom_famille . ' ' . $employee->prenom,
                    'current_grade' => $employee->rang,
                    'effect_date' => $employee->date_effet,
                    'next_promotion_date' => $nextGradeDate,
                ];
            });

        return Inertia::render('Promotions/Index', [
            'employees' => $employees
        ]);
    }

    private function calculateYearsNeeded( $currentRank,  $promotionPace): ?float
    {
        $promotionTable = [
            'سريع' => [
                '1' => 1, '2' => 2, '3' => 2, '4' => 2, '5' => 2,
                '6' => 3, '7' => 3, '8' => 3, '9' => 4
            ],
            'متوسط' => [
                '1' => 1.5, '2' => 2.5, '3' => 2.5, '4' => 2.5, '5' => 2.5,
                '6' => 3.5, '7' => 3.5, '8' => 4, '9' => 5
            ],
            'بطيء' => [
                '1' => 2, '2' => 3, '3' => 3.5, '4' => 3.5, '5' => 3.5,
                '6' => 4, '7' => 4, '8' => 4.5, '9' => 5.5
            ]
        ];

        $rank = substr($currentRank, -1); // Get last character of rank
        return $currentRank >= 10 ? 3 : $promotionTable[$promotionPace][$rank]?? null;
    }
private function calculateNextGrade(string $currentRank, string $promotionPace): ?string
{
    $gradeTable = [
        'سريع' => [
            '1' => '2', '2' => '3', '3' => '4', '4' => '5', '5' => '6',
            '6' => '7', '7' => '8', '8' => '9', '9' => '10'
        ],
        'متوسط' => [
            '1' => '2', '2' => '3', '3' => '4', '4' => '5', '5' => '6',
            '6' => '7', '7' => '8', '8' => '9', '9' => '10'
        ],
        'بطيء' => [
            '1' => '2', '2' => '3', '3' => '4', '4' => '5', '5' => '6',
            '6' => '7', '7' => '8', '8' => '9', '9' => '10'
        ]
    ];

    $rank = substr($currentRank, -1); // Get last character of rank
    $nextRank = $gradeTable[$promotionPace][$rank] ?? null;
    
    if ($nextRank === null) {
        return null;
    }
    
    // Replace the last character of current rank with the next rank number
    return substr($currentRank, 0, -1) . $nextRank;
}


    private function calculateNex7tGrade(string $currentRank): string
    {
        $currentNumber = (int)substr($currentRank, -1);
        $nextNumber = min($currentNumber + 1, 10);
        return str_replace($currentNumber, $nextNumber, $currentRank);
    }
}