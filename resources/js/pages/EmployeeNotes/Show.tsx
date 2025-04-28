import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';

interface Employee {
    id: number;
    nom_famille: string;
    prenom: string;
    numero_cin: string;
    numero_embauche: string;
    grade: string;
    rang: string;
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
}

interface Props {
    auth: {
        user: any;
    };
    employee: Employee;
    notes: EmployeeNote[];
}

export default function Show({ auth, employee, notes }: Props) {
    const handleDelete = (noteId: number) => {
        if (confirm('هل أنت متأكد من حذف بطاقة التنقيط هذه؟')) {
            router.delete(route('employee-notes.destroy', [employee.id, noteId]));
        }
    };

    const handleExportPdf = (noteId: number) => {
        window.open(route('employee-notes.export-pdf', [employee.id, noteId]), '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">بطاقات التنقيط</h2>}
        >
            <Head title={`بطاقات التنقيط - ${employee.nom_famille} ${employee.prenom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        بطاقات التنقيط للموظف: {employee.nom_famille} {employee.prenom}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        رقم ب.ت.و: {employee.numero_cin} | رقم التأجير: {employee.numero_embauche}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('employee-notes.create', employee.id)}>
                                        <Button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                                            <PlusIcon className="w-4 h-4 ml-1" />
                                            إضافة تنقيط جديد
                                        </Button>
                                    </Link>
                                    <Link href={route('employee-notes.index')}>
                                        <Button variant={'default'} className="inline-flex items-center border-0  transition-all text-gray-700">
                                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                                            العودة إلى القائمة
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {notes.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">لا توجد بطاقات تنقيط لهذا الموظف</p>
                                    <Link href={route('employee-notes.create', employee.id)}>
                                        <Button variant={'outline'} className="mt-4  transition-all text-gray-700">
                                            إضافة أول بطاقة تنقيط
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                 <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    السنة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            المردودية
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    المقدرة على التنظيم
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    السلوك المهني
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    البحث والابتكار
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    إنجاز المهام
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    مجموع
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    الميزة الممنوحة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            نسق الترقية
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الإجراءات
                                            </th>
                                        </tr>
                                     </thead>
                                    
                                    
                                     <tbody className="bg-white divide-y divide-gray-200">
                                            {notes.map((note) => (
                                                 <tr key={note.id}>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.year}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.productivity}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.organization}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.professional_conduct}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.innovation}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.job_performance}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">{note.total_score}</td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">
                                                   <span className={`px-2 py-1 rounded-full text-xs ${
                                                            note.grade === 'ممتاز' ? 'bg-green-500 text-white' :
                                                            note.grade === 'جيد جدا' ? 'bg-green-400 text-white' :
                                                            note.grade === 'جيد' ? 'bg-green-300 text-white' :
                                                            note.grade === 'متوسط' ? 'bg-green-200 text-white' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {note.grade}
                                                        </span>
                                                 </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">
                                                 <span className={`px-2 py-1 rounded-full text-xs ${
                                                            note.promotion_pace === 'سريع' ? 'bg-green-500 text-white' :
                                                            note.promotion_pace === 'متوسط' ? 'bg-green-200 text-white' :
                                                            'bg-red-600 text-white'
                                                        }`}>
                                                            {note.promotion_pace}
                                                        </span>
                                                 </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-right">
                                                 <div className="flex items-center space-x-2">
                                                                <Link href={route('employee-notes.edit', [employee.id, note.id])}>
                                                                    <Button variant="default" size="sm" className="text-gray-700 bg-white shadow-none  hover:text-gray-800 hover:bg-accent/30">
                                                                        <PencilIcon className="w-4 h-4" />
                                                                        
                                                                    </Button>
                                                                </Link>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                                                    onClick={() => handleDelete(note.id)}
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                                                                    onClick={() => handleExportPdf(note.id)}
                                                                >
                                                                    <DocumentArrowDownIcon className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                 </td>
                                                 </tr>))}
                                        </tbody>   
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}