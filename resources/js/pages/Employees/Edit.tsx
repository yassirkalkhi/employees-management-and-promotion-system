import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from '@inertiajs/react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useRef } from "react";

interface Employee {
    id: number;
    nom_famille: string;
    prenom: string;
    numero_cin: string;
    numero_embauche: string;
    cadre: string;
    grade: string;
    rang: string;
    level: number;
    fonction_actuelle: string;
    lieu_affectation: string;
    lieu_naissance?: string;
    date_naissance?: string;
    nombre_enfants?: number;
    situation_familiale?: string;
    date_grade?: string;
    date_effet?: string;
    date_entree_fonction_publique?: string;
    date_fonction_actuelle?: string;
    adresse?: string;
}

interface EditProps {
    employee: Employee;
}

export default function Edit({ employee }: EditProps) {
    const closeRef = useRef<HTMLButtonElement>(null);
    // Add to the form data
    const { data, setData, put, processing, errors } = useForm({
        id: employee.id,
        nom_famille: employee.nom_famille || '',
        prenom: employee.prenom || '',
        numero_cin: employee.numero_cin || '',
        numero_embauche: employee.numero_embauche || '',
        lieu_naissance: employee.lieu_naissance || '',
        date_naissance: employee.date_naissance || '',
        nombre_enfants: employee.nombre_enfants || 0,
        situation_familiale: employee.situation_familiale || '',
        cadre: employee.cadre || '',
        grade: employee.grade || '',
        rang: employee.rang || '',
        level: employee.level || 0,
        date_grade: employee.date_grade || '',
        date_effet: employee.date_effet || '',
        date_entree_fonction_publique: employee.date_entree_fonction_publique || '',
        fonction_actuelle: employee.fonction_actuelle || '',
        date_fonction_actuelle: employee.date_fonction_actuelle || '',
        lieu_affectation: employee.lieu_affectation || '',
        adresse: employee.adresse || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('employees.update', employee.id), {
            onSuccess: () => {
                closeRef.current?.click();
            },
            onError: (errors) => {
                console.error('Form submission failed:', errors);
            },
            preserveScroll: true,
            preserveState: true
        });
    };

    // Add to the error messages (if not already present)
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
        level: 'الرجاء إدخال سلم',
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
                <button className="text-indigo-600 hover:text-indigo-900">
                    <Button variant="default" size="sm" className="text-gray-700 bg-white shadow-none  hover:text-gray-800 hover:bg-accent/30">
                        <PencilIcon className="w-4 h-4" />
                        
                    </Button>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] bg-white max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right text-gray-900">تعديل بيانات الموظف</DialogTitle>
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
                                        <SelectTrigger className="bg-white text-gray-700">
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
                                    <Label htmlFor="level" className="text-sm font-medium text-gray-700">السلم</Label>
                                    <Input
                                       id="level"
                                       type="number"
                                       defaultValue={1}
                                       min={1}
                                       value={data.level}
                                       onChange={(e) => setData('level', parseInt(e.target.value))}
                                        className="text-gray-700"
                                                 />
                                              {getFieldError('level')}
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

                    <div className="flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant={"outline"} ref={closeRef} type="button" >إلغاء</Button>
                        </DialogClose>
                        <Button type="submit" variant="outline" className="bg-blue-500 text-white hover:text-white hover:bg-blue-600 border-0" disabled={processing}>حفظ التغييرات</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

