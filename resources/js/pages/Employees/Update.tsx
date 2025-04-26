import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRef } from "react";

export default function Update() {
    const closeRef = useRef<HTMLButtonElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        nom_famille: '',
        prenom: '',
        numero_cin: '',
        numero_embauche: '',
        lieu_naissance: '',
        date_naissance: '',
        nombre_enfants: 0,
        situation_familiale: '',
        cadre: '',
        grade: '',
        rang: '',
        date_grade: '',
        date_effet: '',
        date_entree_fonction_publique: '',
        fonction_actuelle: '',
        date_fonction_actuelle: '',
        lieu_affectation: '',
        adresse: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employees.update'), {
            onSuccess: () => {
                reset();
                closeRef.current?.click();
            },
            onError: (errors) => {
                console.error('Form submission failed:', errors);
            },
            preserveScroll: true,
            preserveState: true
        });
    };

    const errorMessages = {
        nom_famille: 'الرجاء إدخال الاسم العائلي',
        prenom: 'الرجاء إدخال الاسم الشخصي',
        numero_cin: 'رقم البطاقة الوطنية مستخدم من قبل',
        numero_embauche: 'رقم التأجير مستخدم من قبل',
        lieu_naissance: 'الرجاء إدخال مكان الازدياد',
        date_naissance: 'الرجاء إدخال تاريخ الازدياد',
        situation_familiale: 'الرجاء اختيار الحالة العائلية',
        cadre: 'الرجاء إدخال الإطار',
        grade: 'الرجاء إدخال الدرجة',
        rang: 'الرجاء إدخال الرتبة',
        date_grade: 'الرجاء إدخال تاريخ التعيين في الدرجة',
        date_effet: 'الرجاء إدخال تاريخ المفعول',
        date_entree_fonction_publique: 'الرجاء إدخال تاريخ ولوج الوظيفة العمومية',
        fonction_actuelle: 'الرجاء إدخال الوظيفة المزاولة حاليا',
        date_fonction_actuelle: 'الرجاء إدخال تاريخ مزاولة الوظيفة الحالية',
        lieu_affectation: 'الرجاء إدخال مقر التعيين',
        adresse: 'الرجاء إدخال العنوان'
    };

    // Add this helper function
    const getFieldError = (fieldName: string) => {
        if (errors[fieldName]) {
            return (
                <span className="text-sm text-red-600 mt-1 block">
                    {errorMessages[fieldName as keyof typeof errorMessages] || errors[fieldName]}
                </span>
            );
        }
        return null;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="inline-flex items-center">
                    <PlusIcon className="w-4 h-4 ml-1" />
                    إضافة موظف
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] bg-white max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right text-gray-900">إضافة موظف جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Right Column - Personal Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 mb-4">المعلومات الشخصية</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom_famille" className="text-sm font-medium text-gray-700">الاسم العائلي</Label>
                                    <Input
                                        id="nom_famille"
                                        value={data.nom_famille}
                                        onChange={e => setData('nom_famille', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prenom" className="text-sm font-medium text-gray-700">الاسم الشخصي</Label>
                                    <Input
                                        id="prenom"
                                        value={data.prenom}
                                        onChange={e => setData('prenom', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numero_cin" className="text-sm font-medium text-gray-700">رقم ب.ت.و</Label>
                                    <Input
                                        id="numero_cin"
                                        value={data.numero_cin}
                                        onChange={e => setData('numero_cin', e.target.value)}
                                        className={`text-gray-700 ${errors.numero_cin ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {getFieldError('numero_cin')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numero_embauche" className="text-sm font-medium text-gray-700">رقم التأجير</Label>
                                    <Input
                                        id="numero_embauche"
                                        value={data.numero_embauche}
                                        onChange={e => setData('numero_embauche', e.target.value)}
                                        className={`text-gray-700 ${errors.numero_embauche ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {getFieldError('numero_embauche')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lieu_naissance" className="text-sm font-medium text-gray-700">مكان الازدياد</Label>
                                    <Input
                                        id="lieu_naissance"
                                        value={data.lieu_naissance}
                                        onChange={e => setData('lieu_naissance', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_naissance" className="text-sm font-medium text-gray-700">تاريخ الازدياد</Label>
                                    <Input
                                        id="date_naissance"
                                        type="date"
                                        value={data.date_naissance}
                                        onChange={e => setData('date_naissance', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nombre_enfants" className="text-sm font-medium text-gray-700">عدد الاطفال</Label>
                                    <Input
                                        id="nombre_enfants"
                                        type="number"
                                        value={data.nombre_enfants}
                                        onChange={e => setData('nombre_enfants', Number(e.target.value))}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="situation_familiale" className="text-sm font-medium text-gray-700">الحالة العائلية</Label>
                                    <Select
                                        value={data.situation_familiale}
                                        onValueChange={(value) => setData('situation_familiale', value)}
                                        required
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="اختر الحالة العائلية" className="text-gray-700" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="أعزب" className="hover:bg-blue-100/70 text-gray-700">أعزب</SelectItem>
                                            <SelectItem value="متزوج" className="hover:bg-blue-100/70 text-gray-700">متزوج</SelectItem>
                                            <SelectItem value="مطلق" className="hover:bg-blue-100/70 text-gray-700">مطلق</SelectItem>
                                            <SelectItem value="أرمل" className="hover:bg-blue-100/70 text-gray-700">أرمل</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="adresse" className="text-sm font-medium text-gray-700">العنوان</Label>
                                    <Input
                                        id="adresse"
                                        value={data.adresse}
                                        onChange={e => setData('adresse', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Left Column - Professional Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 mb-4">المعلومات المهنية</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cadre" className="text-sm font-medium text-gray-700">الإطار</Label>
                                    <Input
                                        id="cadre"
                                        value={data.cadre}
                                        onChange={e => setData('cadre', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="grade" className="text-sm font-medium text-gray-700">الدرجة</Label>
                                    <Input
                                        id="grade"
                                        value={data.grade}
                                        onChange={e => setData('grade', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rang" className="text-sm font-medium text-gray-700">الرتبة</Label>
                                    <Input
                                        id="rang"
                                        value={data.rang}
                                        onChange={e => setData('rang', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_grade" className="text-sm font-medium text-gray-700">تاريخ التعيين في الدرجة</Label>
                                    <Input
                                        id="date_grade"
                                        type="date"
                                        value={data.date_grade}
                                        onChange={e => setData('date_grade', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_effet" className="text-sm font-medium text-gray-700">تاريخ المفعول</Label>
                                    <Input
                                        id="date_effet"
                                        type="date"
                                        value={data.date_effet}
                                        onChange={e => setData('date_effet', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fonction_actuelle" className="text-sm font-medium text-gray-700">الوظيفة المزاولة حاليا</Label>
                                    <Input
                                        id="fonction_actuelle"
                                        value={data.fonction_actuelle}
                                        onChange={e => setData('fonction_actuelle', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_entree_fonction_publique" className="text-sm font-medium text-gray-700">تاريخ ولوج الوظيفة العمومية</Label>
                                    <Input
                                        id="date_entree_fonction_publique"
                                        type="date"
                                        value={data.date_entree_fonction_publique}
                                        onChange={e => setData('date_entree_fonction_publique', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_fonction_actuelle" className="text-sm font-medium text-gray-700">تاريخ مزاولة الوظيفة الحالية</Label>
                                    <Input
                                        id="date_fonction_actuelle"
                                        type="date"
                                        value={data.date_fonction_actuelle}
                                        onChange={e => setData('date_fonction_actuelle', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lieu_affectation" className="text-sm font-medium text-gray-700">مقر التعيين</Label>
                                    <Input
                                        id="lieu_affectation"
                                        value={data.lieu_affectation}
                                        onChange={e => setData('lieu_affectation', e.target.value)}
                                        className="text-gray-700"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Messages Section */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                            <h4 className="text-red-800 font-medium mb-2">يرجى تصحيح الأخطاء التالية:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field} className="text-red-700">
                                        {errorMessages[field as keyof typeof errorMessages] || error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-6">
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                            {processing ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                        <DialogClose ref={closeRef}>
                            <Button 
                                type="button" 
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                onClick={() => reset()}
                            >
                                إلغاء
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}