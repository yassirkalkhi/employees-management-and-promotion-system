import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';  // Changed from UploadIcon to ArrowUpTrayIcon
import { useState } from "react";
import * as XLSX from 'xlsx';

interface ImportError {
    row: number;
    errors: string[];
}

export default function Import() {
    const [errors, setErrors] = useState<ImportError[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setErrors([]);
        setProcessing(true);

        if (!file) {
            setErrors([{ row: 0, errors: ['الرجاء اختيار ملف'] }]);
            setProcessing(false);
            return;
        }

        // Validate file type
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            setErrors([{ row: 0, errors: ['نوع الملف غير مدعوم. يرجى استخدام ملف Excel (.xlsx or .xls)'] }]);
            setProcessing(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            router.post(route('employees.import'), formData, {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (errors) => {
                    setErrors([{ row: 0, errors: [errors.message || 'حدث خطأ أثناء الاستيراد'] }]);
                    setProcessing(false);
                },
                preserveScroll: true,
            });
        } catch (error) {
            setErrors([{ row: 0, errors: ['حدث خطأ أثناء قراءة الملف'] }]);
            setProcessing(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button  variant={"outline"} size="sm" className="inline-flex border-0 items-center  transition-all">
                    <ArrowUpTrayIcon className="w-4 h-4 ml-1" />
                    استيراد من Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right text-gray-900">استيراد الموظفين من ملف Excel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ArrowUpTrayIcon className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">اضغط للاختيار</span> أو اسحب وأفلت
                                </p>
                                <p className="text-xs text-gray-500">XLSX, XLS</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".xlsx,.xls" 
                                onChange={handleFileUpload}
                                disabled={processing}
                            />
                        </label>
                    </div>

                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <h4 className="text-red-800 font-medium mb-2">يرجى تصحيح الأخطاء التالية:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index} className="text-red-700">
                                        {error.row > 0 ? `سطر ${error.row}: ` : ''}
                                        {error.errors.join('، ')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}