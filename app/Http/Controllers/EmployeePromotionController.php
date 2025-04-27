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
    
    public function index(Request $request)
    {
        $grade = $request->input('grade');

        $employees = Employee::query()
            ->select([
                'id',
                'nom_famille',
                'prenom',
                'rang',
                'date_effet',
                'level',
            ])
            ->when($grade, function ($query) use ($grade) {
                return $query->where('grade', $grade);
            })
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
                    'old_indicative_number' => $this->getIndicativeNumber($employee->level, $employee->rang),
                    'new_indicative_number' =>$this->getIndicativeNumber($employee->level, $employee->rang + 1),
                ];
            });

        return Inertia::render('Promotions/Index', [
            'employees' => $employees,
            'filters' => [
                'grade' => $grade,
            ],
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
      

    private function getIndicativeNumber($scale, $rank)
    {
        // الجدول كما هو موجود في الصورة
        $grid = [
            1 => [1 => 107, 2 => 109, 3 => 112, 4 => 115, 5 => 117, 6 => 119, 7 => 122, 8 => 124, 9 => 126, 10 => 128],
            2 => [1 => 119, 2 => 124, 3 => 128, 4 => 133, 5 => 136, 6 => 139, 7 => 144, 8 => 148, 9 => 153, 10 => 158],
            3 => [1 => 126, 2 => 130, 3 => 134, 4 => 139, 5 => 146, 6 => 153, 7 => 161, 8 => 170, 9 => 175, 10 => 181],
            4 => [1 => 131, 2 => 135, 3 => 140, 4 => 147, 5 => 154, 6 => 162, 7 => 171, 8 => 179, 9 => 188, 10 => 200],
            5 => [1 => 137, 2 => 141, 3 => 150, 4 => 157, 5 => 165, 6 => 174, 7 => 183, 8 => 192, 9 => 201, 10 => 220],
            6 => [1 => 151, 2 => 161, 3 => 173, 4 => 185, 5 => 197, 6 => 209, 7 => 222, 8 => 236, 9 => 249, 10 => 262],
            7 => [1 => 177, 2 => 193, 3 => 208, 4 => 225, 5 => 242, 6 => 260, 7 => 277, 8 => 291, 9 => 305, 10 => 318],
            8 => [1 => 207, 2 => 224, 3 => 241, 4 => 259, 5 => 317, 6 => 339, 7 => 361, 8 => 382, 9 => 404, 10 => 438],
            9 => [1 => 235, 2 => 253, 3 => 274, 4 => 296, 5 => 317, 6 => 339, 7 => 361, 8 => 382, 9 => 404, 10 => 438],
            10 => [1 => 275, 2 => 300, 3 => 326, 4 => 351, 5 => 377, 6 => 402, 7 => 428, 8 => 456, 9 => 484, 10 => 512],
            11 => [1 => 336, 2 => 369, 3 => 403, 4 => 436, 5 => 472, 6 => 509, 7 => 542, 8 => 574, 9 => 606, 10 => 639],
            12 => [1 => 704, 2 => 764, 3 => 779, 4 => 812, 5 => 840, 6 => 870, 7 => 900, 8 => 930, 9 => null, 10 => null],
        ];
        if ($scale == 1 && $rank > 10) {
           return 131; 
        }
        if ($scale == 10 && $rank > 10) {
            return 564; 
         }
        if ($scale == 11 && $rank > 10) {
            return 704;
         } 
        
      
    
        // تحقق من وجود السلم والرتبة
        if (isset($grid[$scale][$rank])) {
            return $grid[$scale][$rank];
        }
    
        return null; // في حال السلم أو الرتبة غير موجودة
    }
}