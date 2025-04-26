<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'year',
        'productivity',
        'organization',
        'professional_conduct',
        'innovation',
        'job_performance',
        'total_score',
        'grade',
        'promotion_pace',
        'notes',
        'job_performance_comment',
        'productivity_comment',
        'organization_comment',
        'professional_conduct_comment',
        'innovation_comment'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // حساب المجموع التلقائي
    public function calculateTotal()
    {
        $this->total_score = 
            $this->productivity + 
            $this->organization + 
            $this->professional_conduct + 
            $this->innovation + 
            $this->job_performance;
        
        return $this->total_score;
    }

    // تحديد الميزة الممنوحة بناءً على المجموع
    public function calculateGrade()
    {
        $total = $this->total_score;
        
        if ($total < 10) {
            return 'ضعيف';
        } elseif ($total >= 10 && $total < 14) {
            return 'متوسط';
        } elseif ($total >= 14 && $total < 16) {
            return 'جيد';
        } elseif ($total >= 16 && $total < 18) {
            return 'جيد جدا';
        } else {
            return 'ممتاز';
        }
    }

    // تحديد نسق الترقية
    public function calculatePromotionPace()
    {
        $total = $this->total_score;
        
        if ($total < 10) {
            return 'بطيء';
        } elseif ($total >= 10 && $total < 16) {
            return 'متوسط';
        } else {
            return 'سريع';
        }
    }
}