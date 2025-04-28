import React from 'react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Props {
    auth: {
        user: any;
    };
    success?: string;
    import_errors?: string[] | string;
}

export default function ImportResult({ auth, success, import_errors }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">نتائج الاستيراد</h2>}
        >
            <Head title="نتائج الاستيراد" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">نتائج استيراد الموظفين</h3>
                            <Link href={route('employees.index')}>
                                <Button variant={"default"} className="flex   border-0 items-center gap-2">
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    العودة إلى قائمة الموظفين
                                </Button>
                            </Link>
                        </div>

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline mr-2">{success}</span>
                            </div>
                        )}

                        {import_errors && import_errors.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-red-600 mb-2">الأخطاء التي تم العثور عليها:</h4>
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <ul className="list-disc list-inside space-y-1 text-red-700">
                                        {Array.isArray(import_errors) 
                                            ? import_errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))
                                            : <li>{import_errors}</li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        )}

                     
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}