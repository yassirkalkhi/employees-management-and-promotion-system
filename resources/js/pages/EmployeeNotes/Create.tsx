import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface Props {
    auth: {
        user: any;
    };
    employee: Employee;
    availableYears: number[];
}

export default function Create({ auth, employee, availableYears = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        year: availableYears && Object.values(availableYears).length > 0 ? Object.values(availableYears)[0] : new Date().getFullYear(),
        productivity: 0, // المردودية (0-5)
        organization: 0, // القدرة على التنظيم (0-3)
        professional_conduct: 0, // السلوك المهني (0-4)
        innovation: 0, // البحث والابتكار (0-3)
        job_performance: 0, // إنجاز المهام الوظيفية (0-5)
        notes: '',
        job_performance_comment : '',
        productivity_comment :'',
        organization_comment : '',
        professional_conduct_comment : '',
        innovation_comment : '',
    });

    const [totalScore, setTotalScore] = useState(0);
    const [grade, setGrade] = useState('ضعيف');
    const [promotionPace, setPromotionPace] = useState('بطيء');

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
        post(route('employee-notes.store', employee.id));
    };
    console.log(typeof(availableYears))

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">إضافة تنقيط جديد</h2>}
        >
            <Head title={`إضافة تنقيط جديد - ${employee.nom_famille} ${employee.prenom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href={route('employee-notes.show', employee.id)}>
                            <Button variant="outline" className="inline-flex items-center bg-blue-500 border-0 transition-all hover:bg-blue-600">
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

                            {/* Year Selection */}
                            <div className="p-4 border-b">
                                <Label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-700">
                                    السنة
                                </Label>
                                <Select
                                    value={data.year.toString()}
                                    onValueChange={(value) => setData('year', Number(value))}
                                    required
                                >
                                    <SelectTrigger className=' text-gray-700'>
                                        <SelectValue placeholder="Select year" className=' text-gray-700'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableYears && Object.values(availableYears).map((year) => (
                                            <SelectItem className='text-gray-700' key={year} value={year.toString()} >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                        <tr>
                                            <td colSpan={2} className="py-3 px-4 text-right font-bold text-gray-800">المجموع:</td>
                                            <td colSpan={2} className="py-3 px-4">
                                                <Input
                                                    type="text"
                                                    value={totalScore.toFixed(2)}
                                                    readOnly
                                                    className="w-full text-gray-900 font-bold bg-white"
                                                    disabled
                                                />
                                            </td>
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
                                        value={totalScore.toFixed(2)}
                                        readOnly
                                        className="w-1/3 text-gray-700"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700">معدل النقاط المحصل عليها</label>
                                    <Input
                                        type="text"
                                        value={totalScore.toFixed(2)}
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
                            <div className="p-4 flex justify-center">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                                >
                                    حفظ التقييم
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}