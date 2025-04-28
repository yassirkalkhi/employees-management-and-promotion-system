<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) { 
            $table->id(); 
            $table->string('nom_famille')->comment('الاسم العائلي'); 
            $table->string('prenom')->comment('الاسم الشخصي'); 
            $table->string('numero_cin')->unique()->comment('رقم ب.ت.و'); 
            $table->string('numero_embauche')->unique()->comment('رقم التأجير'); 
            $table->date('date_naissance')->comment('تاريخ الازدياد'); 
            $table->string('lieu_naissance')->comment('مكان الازدياد'); 
            $table->string('situation_familiale')->comment('الحالة العائلية'); 
            $table->integer('nombre_enfants')->default(0)->comment('عدد الأطفال'); 
            $table->string('cadre')->comment('الإطار'); 
            $table->string('grade')->comment('الدرجة'); 
            $table->date('date_grade')->comment('تاريخ التعيين في الدرجة'); 
            $table->integer('rang')->comment('الرتبة'); 
            $table->integer('level')->default(0)->comment('سلم'); 
            $table->date('date_effet')->comment('تاريخ المفعول'); 
            $table->date('date_entree_fonction_publique')->comment('تاريخ ولوج الوظيفة العمومية'); 
            $table->string('fonction_actuelle')->comment('الوظيفة المزاولة حاليا'); 
            $table->date('date_fonction_actuelle')->comment('تاريخ مزاولة الوظيفة الحالية'); 
            $table->string('lieu_affectation')->comment('مقر التعيين'); 
            $table->text('adresse')->nullable()->comment('العنوان'); 
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};