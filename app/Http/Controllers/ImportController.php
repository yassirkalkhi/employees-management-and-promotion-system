<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class ImportController extends Controller
{   
    private function parseDate($value)
    {
        if (empty($value)) {
            return null;
        }

        // Si c'est déjà un objet DateTime
        if ($value instanceof \DateTime) {
            return $value;
        }

        // Si c'est un nombre (format Excel)
        if (is_numeric($value)) {
            return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value);
        }

        // Essayer de parser la date
        try {
            return \Carbon\Carbon::parse($value);
        } catch (\Exception $e) {
            \Log::warning('Impossible de parser la date: ' . $value);
            return null;
        }
    }
 
    public function import(Request $request)
    {
        Log::info('Received file: '. $request->file('file')->getClientOriginalName());
        $request->validate([
            'file' => 'required|file|mimes:xls,xlsx'
        ]);

        try {
        $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            
            // Vérifier l'extension du fichier
            if (!in_array($extension, ['xls', 'xlsx'])) {
                return redirect()->route('employees.index')
                    ->with('error', 'يجب أن يكون الملف بتنسيق Excel (.xls أو .xlsx)');
            }

            // Utiliser PhpSpreadsheet directement
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($file->getPathname());
            $reader->setReadDataOnly(true);
            
            try {
                $spreadsheet = $reader->load($file->getPathname());
                $worksheet = $spreadsheet->getActiveSheet();
                $rows = $worksheet->toArray();

                // Vérifier si le fichier contient des données
                if (count($rows) < 2) {
                    return redirect()->route('employees.index')
                        ->with('error', 'ملف Excel فارغ');
                }

                // Supprimer l'en-tête
                array_shift($rows);

                $importedCount = 0;
                $errors = [];

                \DB::beginTransaction();

                foreach ($rows as $rowIndex => $row) {
                    if (empty($row[0])) continue;

                    // Vérifier si l'employé existe déjà
                    if (Employee::where('numero_cin', $row[2])->exists()) {
                        $errors[] = "الموظف برقم البطاقة الوطنية {$row[2]} موجود بالفعل (السطر " . ($rowIndex + 2) . ")";
                        continue;
                    }

                    // Créer l'employé
                    Log::info('Importing employee: '. $row[0]. ' '. $row[1]);
                    Employee::create([
                        'nom_famille' => $row[0],
                        'prenom' => $row[1],
                        'numero_cin' => $row[2],
                        'numero_embauche' => $row[3],
                        'date_naissance' => $this->parseDate($row[4]),
                        'lieu_naissance' => $row[5],
                        'situation_familiale' => $row[6],
                        'nombre_enfants' => (int)$row[7],
                        'cadre' => $row[8],
                        'grade' => $row[9],
                        'date_grade' => $this->parseDate($row[10]),
                        'rang' => $row[11],
                        'date_effet' => $this->parseDate($row[12]),
                        'date_entree_fonction_publique' => $this->parseDate($row[13]),
                        'fonction_actuelle' => $row[14],
                        'date_fonction_actuelle' => $this->parseDate($row[15]),
                        'lieu_affectation' => $row[16],
                        'adresse' => $row[17] ?? null
                    ]);

                    $importedCount++;
                }

                if ($importedCount > 0) {
                    \DB::commit();
                    $message = "تم استيراد {$importedCount} موظف بنجاح";
                    if (count($errors) > 0) {
                        $message .= ". مع " . count($errors) . " أخطاء";
                    }
                    return Inertia::render('Employees/Index', [
                        'success' => $message,
                        'import_errors' => $errors
                    ]);
                } else {
                    \DB::rollBack();
                    return redirect()->route('employees.index')
                        ->with('error', 'لم يتم استيراد أي موظف. تحقق من بيانات الملف.');
                }

            } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
                \Log::error('خطأ في قراءة الملف: ' . $e->getMessage());
                return redirect()->route('employees.index')
                    ->with('error', 'لا يمكن قراءة الملف. تأكد من أن الملف بتنسيق Excel صحيح.');
            }

        } catch (\Exception $e) {
            \Log::error('خطأ عام: ' . $e->getMessage());
        return redirect()->route('employees.index')
                ->with('error', 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
        }
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
          }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
