<?php




use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employee_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->integer('year');
            $table->decimal('productivity', 3, 1)->default(0); // المردودية
            $table->decimal('organization', 3, 1)->default(0); // القدرة على التنظيم
            $table->decimal('professional_conduct', 3, 1)->default(0); // السلوك المهني
            $table->decimal('innovation', 3, 1)->default(0); // البحث والابتكار
            $table->decimal('job_performance', 3, 1)->default(0); // إنجاز المهام الوظيفية
            $table->decimal('total_score', 5, 2)->default(0); // المجموع
            $table->string('grade')->nullable(); // الميزة الممنوحة
            $table->string('promotion_pace')->nullable(); // نسق الترقية
            $table->text('notes')->nullable(); // ملاحظات
            $table->text('job_performance_comment')->nullable();
            $table->text('productivity_comment')->nullable();
            $table->text('organization_comment')->nullable();
            $table->text('professional_conduct_comment')->nullable();
            $table->text('innovation_comment')->nullable();
            $table->unique(['employee_id', 'year']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('employee_notes');
    }
};