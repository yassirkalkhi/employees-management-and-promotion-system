import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface Employee {
    id: number;
    nom_famille: string;
    prenom: string;
    numero_cin: string;
    numero_embauche: string;
    grade: string;
    rang: string;
    lieu_affectation: string;
}

interface EmployeeNote {
    id: number;
    year: number;
    productivity: number;
    organization: number;
    professional_conduct: number;
    innovation: number;
    job_performance: number;
    total_score: number;
    grade: string;
    promotion_pace: string;
    notes: string;
    job_performance_comment?: string;
    productivity_comment?: string;
    organization_comment?: string;
    professional_conduct_comment?: string;
    innovation_comment?: string;
}

interface Props {
    auth: {
        user: any;
    };
    employee: Employee;
    note: EmployeeNote;
}

export default function Edit({ auth, employee, note }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        productivity: note.productivity, // المردودية (0-5)
        organization: note.organization, // القدرة على التنظيم (0-3)
        professional_conduct: note.professional_conduct, // السلوك المهني (0-4)
        innovation: note.innovation, // البحث والابتكار (0-3)
        job_performance: note.job_performance, // إنجاز المهام الوظيفية (0-5)
        notes: note.notes || '',
        job_performance_comment: note.job_performance_comment || '',
        productivity_comment: note.productivity_comment || '',
        organization_comment: note.organization_comment || '',
        professional_conduct_comment: note.professional_conduct_comment || '',
        innovation_comment: note.innovation_comment || '',
    });

    const [totalScore, setTotalScore] = useState(note.total_score);
    const [grade, setGrade] = useState(note.grade);
    const [promotionPace, setPromotionPace] = useState(note.promotion_pace);

    // حساب المجموع والميزة ونسق الترقية عند تغيير أي قيمة
    useEffect(() => {
        const total = 
            parseFloat(data.productivity.toString()) + 
            parseFloat(data.organization.toString()) + 
            parseFloat(data.professional_conduct.toString()) + 
            parseFloat(data.innovation.toString()) + 
            parseFloat(data.job_performance.toString());
        
        setTotalScore(total);
        
        // تحديد الميزة الممنوحة
        if (total < 10) {
            setGrade('ضعيف');
        } else if (total >= 10 && total < 14) {
            setGrade('متوسط');
        } else if (total >= 14 && total < 16) {
            setGrade('جيد');
        } else if (total >= 16 && total < 18) {
            setGrade('جيد جدا');
        } else {
            setGrade('ممتاز');
        }
        
        // تحديد نسق الترقية
        if (total < 10) {
            setPromotionPace('بطيء');
        } else if (total >= 10 && total < 16) {
            setPromotionPace('متوسط');
        } else {
            setPromotionPace('سريع');
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('employee-notes.update', [employee.id, note.id]));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">تعديل بطاقة التنقيط</h2>}
        >
            <Head title={`تعديل بطاقة التنقيط - ${employee.nom_famille} ${employee.prenom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={route('employee-notes.show', employee.id)}>
                            <Button variant="outline" className="inline-flex items-center bg-blue-500 border-0 transition-all hover:bg-blue-600 text-white">
                                <ArrowLeftIcon className="w-4 h-4 ml-1" />
                                العودة إلى القائمة
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit}>
                            {/* هوية الموظف */}
                            <div className="bg-blue-600 text-white p-3 text-center font-bold">
                                هوية الموظف
                            </div>
                            <div className="p-4 grid grid-cols-3 gap-4 border-b">
                                <div>
                                    <div className="text-gray-600 text-sm">الاسم العائلي:</div>
                                    <div className="font-medium text-gray-900">{employee.nom_famille}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">الاسم الشخصي:</div>
                                    <div className="font-medium text-gray-900">{employee.prenom}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">رقم بطاقة التعريف الوطنية:</div>
                                    <div className="font-medium text-gray-900">{employee.numero_cin}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">الرتبة:</div>
                                    <div className="font-medium text-gray-900">{employee.rang}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">الدرجة:</div>
                                    <div className="font-medium text-gray-900">{employee.grade}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">مكان العمل:</div>
                                    <div className="font-medium text-gray-900">{employee.lieu_affectation}</div>
                                </div>
                            </div>

                            {/* Year Display (not editable) */}
                            <div className="p-4 border-b">
                                <div className="text-gray-600 text-sm">السنة:</div>
                                <div className="font-medium text-gray-900">{note.year}</div>
                            </div>

                            {/* النقطة الممنوحة */}
                            <div className="bg-blue-600 text-white p-3 text-center font-bold">
                                النقطة الممنوحة
                            </div>
                            <div className="p-4">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-right py-2 px-4 font-medium text-gray-700">عناصر التنقيط</th>
                                            <th className="text-right py-2 px-4 font-medium text-gray-700">سلم التنقيط</th>
                                            <th className="text-right py-2 px-4 font-medium text-gray-700">النقطة الممنوحة</th>
                                            <th className="text-right py-2 px-4 font-medium text-gray-700">ملاحظات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-3 px-4 text-gray-800">إنجاز المهام الوظيفية</td>
                                            <td className="py-3 px-4 text-gray-600">من 0 إلى 5</td>
                                            <td className="py-3 px-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    step="0.5"
                                                    value={data.job_performance}
                                                    onChange={(e) => setData('job_performance', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-gray-700"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <textarea
                                                    rows={2}
                                                    value={data.job_performance_comment}
                                                    onChange={(e) => setData('job_performance_comment', e.target.value)}
                                                    className="w-full text-gray-900 bg-white text-sm border-1 rounded p-2 resize-none"
                                                    placeholder="ملاحظات حول إنجاز المهام..."
                                                    maxLength={200}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-4 text-gray-800">المردودية</td>
                                            <td className="py-3 px-4 text-gray-600">من 0 إلى 5</td>
                                            <td className="py-3 px-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    step="0.5"
                                                    value={data.productivity}
                                                    onChange={(e) => setData('productivity', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-gray-700"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <textarea
                                                    rows={2}
                                                    value={data.productivity_comment}
                                                    onChange={(e) => setData('productivity_comment', e.target.value)}
                                                    className="w-full text-gray-900 bg-white text-sm border-1 rounded p-2 resize-none"
                                                    placeholder="ملاحظات حول المردودية..."
                                                    maxLength={200}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-4 text-gray-800">القدرة على التنظيم</td>
                                            <td className="py-3 px-4 text-gray-600">من 0 إلى 3</td>
                                            <td className="py-3 px-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="3"
                                                    step="0.5"
                                                    value={data.organization}
                                                    onChange={(e) => setData('organization', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-gray-700"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <textarea
                                                    rows={2}
                                                    value={data.organization_comment}
                                                    onChange={(e) => setData('organization_comment', e.target.value)}
                                                    className="w-full text-gray-900 bg-white text-sm border-1 rounded p-2 resize-none"
                                                    placeholder="ملاحظات حول القدرة على التنظيم..."
                                                    maxLength={200}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-4 text-gray-800">السلوك المهني</td>
                                            <td className="py-3 px-4 text-gray-600">من 0 إلى 4</td>
                                            <td className="py-3 px-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="4"
                                                    step="0.5"
                                                    value={data.professional_conduct}
                                                    onChange={(e) => setData('professional_conduct', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-gray-700"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <textarea
                                                    rows={2}
                                                    value={data.professional_conduct_comment}
                                                    onChange={(e) => setData('professional_conduct_comment', e.target.value)}
                                                    className="w-full text-gray-900 bg-white text-sm border-1 rounded p-2 resize-none"
                                                    placeholder="ملاحظات حول السلوك المهني..."
                                                    maxLength={200}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-4 text-gray-800">البحث والابتكار</td>
                                            <td className="py-3 px-4 text-gray-600">من 0 إلى 3</td>
                                            <td className="py-3 px-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="3"
                                                    step="0.5"
                                                    value={data.innovation}
                                                    onChange={(e) => setData('innovation', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-gray-700"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <textarea
                                                    rows={2}
                                                    value={data.innovation_comment}
                                                    onChange={(e) => setData('innovation_comment', e.target.value)}
                                                    className="w-full text-gray-900 bg-white text-sm border-1 rounded p-2 resize-none"
                                                    placeholder="ملاحظات حول البحث والابتكار..."
                                                    maxLength={200}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td colSpan={2} className="py-3 px-4 font-semibold text-gray-800">المجموع العام (من 0 إلى 20)</td>
                                            <td colSpan={2} className="py-3 px-4 font-semibold text-gray-800">{totalScore}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                                 {/* الميزة الممنوحة */}
                                 <div className="bg-blue-600 text-white p-3 text-center font-bold">
                                الميزة الممنوحة
                            </div>
                            <div className="p-4 flex justify-center space-x-4 rtl:space-x-reverse">
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="grade-excellent" 
                                        name="grade" 
                                        checked={grade === 'ممتاز'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="grade-excellent" className="text-gray-700">ممتاز</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="grade-very-good" 
                                        name="grade" 
                                        checked={grade === 'جيد جدا'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="grade-very-good" className="text-gray-700">جيد جدا</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="grade-good" 
                                        name="grade" 
                                        checked={grade === 'جيد'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="grade-good" className="text-gray-700">جيد</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="grade-average" 
                                        name="grade" 
                                        checked={grade === 'متوسط'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="grade-average" className="text-gray-700">متوسط</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="grade-weak" 
                                        name="grade" 
                                        checked={grade === 'ضعيف'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="grade-weak" className="text-gray-700">ضعيف</label>
                                </div>
                            </div>

                            {/* معدل النقاط المحصل عليها */}
                            <div className="bg-blue-600 text-white p-3 text-center font-bold">
                                معدل النقاط المحصل عليها
                            </div>
                            <div className="p-4 grid grid-cols-1 gap-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700">نقطة سنة {new Date().getFullYear()}</label>
                                    <Input
                                        type="text"
                                        value={totalScore}
                                        readOnly
                                        className="w-1/3 text-gray-700"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700">معدل النقاط المحصل عليها</label>
                                    <Input
                                        type="text"
                                        value={totalScore}
                                        readOnly
                                        className="w-1/3 text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* نسق الترقية المحصل عليها */}
                            <div className="bg-blue-600 text-white p-3 text-center font-bold">
                                نسق الترقية المحصل عليها
                            </div>
                            <div className="p-4 flex justify-center space-x-4 rtl:space-x-reverse">
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="pace-fast" 
                                        name="pace" 
                                        checked={promotionPace === 'سريع'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="pace-fast" className="text-gray-700">سريع</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="pace-medium" 
                                        name="pace" 
                                        checked={promotionPace === 'متوسط'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="pace-medium" className="text-gray-700">متوسط</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="pace-slow" 
                                        name="pace" 
                                        checked={promotionPace === 'بطيء'} 
                                        readOnly 
                                        className="mr-2 rtl:ml-2" 
                                    />
                                    <label htmlFor="pace-slow" className="text-gray-700">بطيء</label>
                                </div>
                            </div>
                            {/* Submit Button */}
                            <div className="p-4 flex justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}