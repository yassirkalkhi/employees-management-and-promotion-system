import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Create from './Create';
import Import from './Import';
import Edit from './Edit';
import { Button } from '@/components/ui/button';

// Update the Employee interface
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
    level: number;
}

interface Props {
    auth: {
        user: any;
    };
    employees: {
        data: Employee[];
    };
    import_errors: any;
    success:any;
}

export default function Index({ auth, employees,import_errors ,success }: Props) {
   
    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
            router.delete(route('employees.destroy', id), {
                preserveScroll: true,
            });
        }
    };
    if(import_errors || success){
       window.location.href = '/employees';
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">إدارة الموظفين</h2>}
        >
            <Head title="إدارة الموظفين" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {import_errors && 
                     import_errors.map((error:any) => (
                        <div key={error.row} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>

                     ))
                    }
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">تم بنجاح!</strong>
                            <span className="block sm:inline">تم استيراد الملف بنجاح.</span>
                        </div> 
                    )}
                
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
                                                سلم
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
                                        {employees?.data.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.nom_famille}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.prenom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.numero_cin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.numero_embauche}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.cadre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.grade}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.rang}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.level}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.fonction_actuelle}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{employee.lieu_affectation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Edit employee={employee} />
                                                            <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                                                    onClick={() => handleDelete(employee.id)}
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </Button>
                                                           
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