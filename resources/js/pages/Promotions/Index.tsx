import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

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
}

export default function Index({ auth, employees }: { auth: any; employees: Employee[] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="قائمة الترقيات المحتملة" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">قائمة الترقيات المحتملة</h2>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3" rowSpan={2}>الاسم الكامل</th>
                                            <th scope="col" className="px-6 py-3 text-center" colSpan={3}> الوضعية الحالية </th>
                                            <th scope="col" className="px-6 py-3 text-center" colSpan={3}> الوضعية الجديدة</th>
                                        </tr>
                                        <tr>
                                            <th scope="col" className="px-6 py-3">الرتبة الحالية</th>
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
                                                <td className="px-6 py-4">{ 'يتم الحساب'}</td>
                                                <td className="px-6 py-4">{employee.effect_date}</td>
                                                <td className="px-6 py-4">{parseInt(employee.current_grade) + 1}</td> 
                                                <td className="px-6 py-4">{ 'يتم الحساب'}</td>
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