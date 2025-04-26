<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>بطاقة التنقيط الفردية</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            direction: rtl;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 5px;
            text-align: right;
        }
        .header-table td {
            text-align: center;
            vertical-align: middle;
            padding: 5px;
        }
        .title {
            text-align: center;
            font-weight: bold;
            margin: 15px 0;
            font-size: 16px;
        }
        .section-title {
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .logo {
            width: 80px;
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .checkbox-container {
            display: flex;
            justify-content: space-around;
            margin: 10px 0;
        }
        .checkbox {
            border: 1px solid black;
            width: 15px;
            height: 15px;
            display: inline-block;
        }
        .checkbox-label {
            margin-right: 5px;
        }
        .checkbox-row {
            display: flex;
            justify-content: space-around;
        }
        .checkbox-group {
            text-align: center;
        }
        .signature-section {
            text-align: left;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <!-- Header with logos and titles -->
    <table class="header-table">
        <tr>
            <td width="40%">
                <p><b>Ministère de l'Education Nationale, de l'Enseignement Supérieur, de la Formation des Cadres</b></p>
                <p><b>et de la Recherche Scientifique</b></p>
                <p><b>Département de l'Enseignement Supérieur de la Formation des Cadres et de la Recherche Scientifique</b></p>
                <p><b>Université Cadi Ayyad</b></p>
                <p><b>La Présidence</b></p>
            </td>
            <td width="20%">
                <img src="{{ public_path('images/logo.png') }}" class="logo">
            </td>
            <td width="40%">
                <p><b>وزارة التربية الوطنية والتعليم العالي و تكوين الأطر و البحث العلمي</b></p>
                <p><b>قطاع التعليم العالي و تكوين الأطر و البحث العلمي</b></p>
                <p><b>جامعة القاضي عياض - الرئاسة</b></p>
            </td>
        </tr>
    </table>

    <!-- Title -->
    <div class="title">
        بطاقة التنقيط الفردية برسم سنة {{ $year }}
    </div>

    <!-- Employee Identity Section -->
    <table>
        <tr>
            <td colspan="7" class="section-title">1- هوية الموظف</td>
        </tr>
        <tr>
            <td colspan="7">
                <p>- الاسم العائلي: {{ $employee->nom_famille }}                                                رقم ب.ت.و: {{ $employee->numero_cin }}</p>
                <p>- الاسم الشخصي: {{ $employee->prenom }}                                                رقم التأجير: {{ $employee->numero_embauche }}</p>
                <p>- الدرجة: {{ $employee->grade }}                                                الرتبة: {{ $employee->rang }}</p>
                <p>- مكان الإرتباط: {{ $employee->lieu_affectation }}</p>
                <p>- تاريخ التعيين في الدرجة: {{ $employee->date_grade ?? '___________' }}</p>
                <p>- تاريخ المفعول: {{ $employee->date_effet ?? '___________' }}</p>
                <p>- تاريخ ولوج الوظيفة العمومية: {{ $employee->date_entree_fonction_publique ?? '___________' }}</p>
                <p>- الوظيفة المزاولة حاليا: {{ $employee->fonction_actuelle ?? '___________' }}</p>
            </td>
        </tr>
    </table>

    <!-- Scoring Section -->
    <table>
        <tr>
            <td colspan="7" class="section-title">2- النقطة الممنوحة</td>
        </tr>
        <tr>
            <td>عناصر التنقيط</td>
            <td>سلم التنقيط</td>
            <td>النقطة الممنوحة</td>
            <td>ملاحظات</td>
        </tr>
        <tr>
            <td>1</td>
            <td>إنجاز المهام المرتبطة بالوظيفة</td>
            <td>من 0 إلى 5</td>
            <td>{{ $note->job_performance }}</td>
        </tr>
        <tr>
            <td>2</td>
            <td>المردودية</td>
            <td>من 0 إلى 5</td>
            <td>{{ $note->productivity }}</td>
        </tr>
        <tr>
            <td>3</td>
            <td>القدرة على التنظيم</td>
            <td>من 0 إلى 3</td>
            <td>{{ $note->organization }}</td>
        </tr>
        <tr>
            <td>4</td>
            <td>السلوك المهني</td>
            <td>من 0 إلى 4</td>
            <td>{{ $note->professional_conduct }}</td>
        </tr>
        <tr>
            <td>5</td>
            <td>البحث والابتكار</td>
            <td>من 0 إلى 3</td>
            <td>{{ $note->innovation }}</td>
        </tr>
        <tr>
            <td colspan="2">المجموع العام (من 0 إلى 20)</td>
            <td colspan="2">{{ $totalScore }}</td>
        </tr>
    </table>

    <!-- Grade Section -->
    <table>
        <tr>
            <td colspan="7" class="section-title">3- الميزة الممنوحة</td>
        </tr>
        <tr>
            <td colspan="7">
                <div class="checkbox-row">
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $grade == 'ممتاز' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">ممتاز</span>
                        <div>18 ≤ نقطة < 20</div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $grade == 'جيد جدا' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">جيد جدا</span>
                        <div>16 ≤ نقطة < 18</div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $grade == 'جيد' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">جيد</span>
                        <div>14 ≤ نقطة < 16</div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $grade == 'متوسط' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">متوسط</span>
                        <div>10 ≤ نقطة < 14</div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $grade == 'ضعيف' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">ضعيف</span>
                        <div>نقطة < 10</div>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Average Score Section -->
    <table>
        <tr>
            <td colspan="7" class="section-title">4- معدل النقط المحصل عليها</td>
        </tr>
        <tr>
            <td colspan="7">
                <p>تذكير بمعدل النقط المحصل عليها خلال السنوات المطلوبة للترقية في الرتبة:</p>
                <p>- نقطة السنة الأولى: ___________</p>
                <p>- نقطة السنة الثانية: ___________</p>
                <p>- نقطة السنة الثالثة: ___________</p>
                <p>- معدل النقط المحصل عليها: ___________</p>
            </td>
        </tr>
    </table>

    <!-- Promotion Pace Section -->
    <table>
        <tr>
            <td colspan="7" class="section-title">5- نسق الترقية في الرتبة</td>
        </tr>
        <tr>
            <td colspan="7">
                <div class="checkbox-row">
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $promotionPace == 'سريع' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">سريع</span>
                        <div>نقطة ≥ 16</div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $promotionPace == 'متوسط' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">متوسط</span>
                        <div>10 ≤ نقطة < 16</div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox" style="{{ $promotionPace == 'بطيء' ? 'background-color: black;' : '' }}"></div>
                        <span class="checkbox-label">بطيء</span>
                        <div>نقطة < 10</div>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Signature Section -->
    <div class="signature-section">
        <p>حرر في: ___________</p>
        <p>إمضاء الرئيس المباشر أو السلطة المفوض لها:</p>
        <div style="height: 50px;"></div>
    </div>
</body>
</html>