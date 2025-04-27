import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Employee {
    id: number;
    nom_famille: string;
    prenom: string;
    numero_embauche: string;
}

interface Props {
    auth: any;
    employees: Employee[];
}

export default function Index({ auth, employees }: Props) {
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

    const generateReport = (employeeId: number) => {
        window.open(route('annual-reports.generate', employeeId), '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">التقارير السنوية</h2>}
        >
            <Head title="التقارير السنوية" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رقم التأجير
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الاسم الكامل
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {employee.numero_embauche}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {employee.nom_famille} {employee.prenom}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Button
                                                        onClick={() => generateReport(employee.id)}
                                                        variant="outline"
                                                    >
                                                        إنشاء التقرير
                                                    </Button>
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