import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button'; // Add Button import

interface Employee {
    id: number;
    full_name: string;
    employee_number: string;
    current_grade: string;
    grade_date: string;
    rank: string;
    effect_date: string;
    next_promotion_date: string | null;
    promotion_status: string | null;
    notes: string | null;
    old_indicative_number: string | null;
    new_indicative_number: string | null;
}

interface Props {
    auth: any;
    employees: Employee[];
    filters: {
        grade: string | null;
    };
}

export default function Index({ auth, employees, filters }: Props) {
    const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(route('promotions.index'), {
            grade: event.target.value || null,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportTableAsPdf = () => {
        window.open(route('promotions.export-pdf', { grade: filters.grade || null }), '_blank');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="قائمة الترقيات المحتملة" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    جدول الترقي
                                    {filters.grade && (
                                        <>
                                            <span> في الرتبة الخاص بإطار تقني من الدرجة</span>
                                            <span className='mx-2'>{filters.grade}</span>
                                        </>
                                    )}
                                    <span> برسم سنة {new Date().getFullYear()}</span>
                                </h2>
                                <div className="flex items-center gap-4">
                                    <Button 
                                        onClick={exportTableAsPdf}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        تصدير كملف PDF
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="grade-filter" className="text-sm font-medium text-gray-700">
                                            الدرجة:
                                        </label>
                                        <select
                                            id="grade-filter"
                                            value={filters.grade || ''}
                                            onChange={handleGradeChange}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">جميع الدرجات</option>
                                            <option value="1">الدرجة 1</option>
                                            <option value="2">الدرجة 2</option>
                                            <option value="3">الدرجة 3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3" rowSpan={2}>الاسم الكامل</th>
                                            <th scope="col" className="px-6 py-3 text-center" colSpan={3}> الوضعية الحالية </th>
                                            <th scope="col" className="px-6 py-3 text-center" colSpan={3}> الوضعية الجديدة</th>
                                        </tr>
                                        <tr>
                                            <th scope="col" className="px-6 py-3">الرتبة </th>
                                            <th scope="col" className="px-6 py-3">الرقم الاستدلالي</th>
                                            <th scope="col" className="px-6 py-3">الاقدمية</th>
                                            <th scope="col" className="px-6 py-3">الرتبة</th>
                                            <th scope="col" className="px-6 py-3">الرقم الاستدلالي</th>
                                            <th scope="col" className="px-6 py-3">تاريخ المفعول</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((employee) => (
                                            <tr key={employee.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{employee.full_name}</td>
                                                <td className="px-6 py-4">{employee.current_grade}</td>
                                                <td className="px-6 py-4">{employee.old_indicative_number}</td>
                                                <td className="px-6 py-4">{employee.effect_date}</td>
                                                <td className="px-6 py-4">
                                                    {parseInt(employee.current_grade + 1) <= 10 
                                                        ? parseInt(employee.current_grade) + 1 
                                                        : " رتبة استثنائية"}
                                                </td>
                                                <td className="px-6 py-4">{employee.new_indicative_number}</td>
                                                <td className="px-6 py-4">{ employee.next_promotion_date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}