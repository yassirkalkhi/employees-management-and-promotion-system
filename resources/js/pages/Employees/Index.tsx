import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Create from './Create';
import Import from './Import';
import Edit from './Edit';

interface Employee {
    id: number;
    nom_famille: string;
    prenom: string;
    numero_cin: string;
    numero_embauche: string;
    cadre: string;
    grade: string;
    rang: string;
    fonction_actuelle: string;
    lieu_affectation: string;
}

interface Props {
    auth: {
        user: any;
    };
    employees: {
        data: Employee[];
    };
}

export default function Index({ auth, employees }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
            router.delete(route('employees.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">إدارة الموظفين</h2>}
        >
            <Head title="إدارة الموظفين" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-end mb-6">
                                <div className="flex gap-2">
                                    <Create />
                                    <Import /> {/* Replace the button with the Import component */}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الاسم العائلي
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الاسم الشخصي
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رقم ب.ت.و
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رقم التأجير
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإطار
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الدرجة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الرتبة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الوظيفة المزاولة حاليا
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                مقر التعيين
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employees.data.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.nom_famille}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.prenom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.numero_cin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.numero_embauche}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.cadre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.grade}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.rang}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.fonction_actuelle}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.lieu_affectation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Edit employee={employee} />
                                                        <button
                                                            onClick={() => handleDelete(employee.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
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