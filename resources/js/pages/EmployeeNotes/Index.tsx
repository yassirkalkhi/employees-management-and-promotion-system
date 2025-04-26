import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { StarIcon } from '@heroicons/react/24/outline';

interface Employee {
    id: number;
    nom_famille: string;
    prenom: string;
    numero_cin: string;
    numero_embauche: string;
    grade: string;
    rang: string;
}

interface Props {
    auth: {
        user: any;
    };
    employees: Employee[];
}

export default function Index({ auth, employees }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">بطاقات التنقيط</h2>}
        >
            <Head title="بطاقات التنقيط" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">قائمة الموظفين</h3>
                                <p className="text-sm text-gray-500">اختر موظفًا لعرض أو إضافة بطاقات التنقيط</p>
                            </div>

                            <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم العائلي</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم الشخصي</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم ب.ت.و</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التأجير</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدرجة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرتبة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                       {employees.map((employee) => (
                                            <tr  className="hover:bg-accent/10" key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.nom_famille}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.prenom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.numero_cin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.numero_embauche}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.grade}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.rang}</td>
                                                <td>
                                                <div className="flex items-center space-x-2">
                                                        <Link href={route('employee-notes.show', employee.id)}>
                                                            <Button variant="outline" size="sm" className="inline-flex items-center bg-blue-500 hover:bg-blue-600 border-0 transition-all text-white">
                                                                <StarIcon className="w-4 h-4 ml-1" />
                                                                بطاقات التنقيط
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                               
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