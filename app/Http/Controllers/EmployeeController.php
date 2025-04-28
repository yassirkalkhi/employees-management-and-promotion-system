<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::latest()->paginate(10);
        
        return Inertia::render('Employees/Index', [
            'employees' => $employees
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create');
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'nom_famille' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'numero_cin' => 'required|string|unique:employees',
            'numero_embauche' => 'required|string|unique:employees',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:255',
            'situation_familiale' => 'required|string|max:255',
            'nombre_enfants' => 'required|integer|min:0',
            'cadre' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'date_grade' => 'required|date',
            'level' =>'required|numeric',
            'rang' => 'required||numeric',
            'date_effet' => 'required|date',
            'date_entree_fonction_publique' => 'required|date',
            'fonction_actuelle' => 'required|string|max:255',
            'date_fonction_actuelle' => 'required|date',
            'lieu_affectation' => 'required|string|max:255',
            'adresse' => 'nullable|string'
        ]);

        Employee::create($validated);

        return redirect()->route('employees.index')
            ->with('message', 'Employee created successfully.');
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/Edit', [
            'employee' => $employee
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'nom_famille' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'numero_cin' => 'required|string|unique:employees,numero_cin,' . $employee->id,
            'numero_embauche' => 'required|string|unique:employees,numero_embauche,' . $employee->id,
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:255',
            'situation_familiale' => 'required|string|max:255',
            'nombre_enfants' => 'required|integer|min:0',
            'cadre' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'date_grade' => 'required|date',
            'rang' => 'required|numeric',
            'level' => 'required|numeric',
            'date_effet' => 'required|date',
            'date_entree_fonction_publique' => 'required|date',
            'fonction_actuelle' => 'required|string|max:255',
            'date_fonction_actuelle' => 'required|date',
            'lieu_affectation' => 'required|string|max:255',
            'adresse' => 'nullable|string'
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')
            ->with('message', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('message', 'Employee deleted successfully.');
    }

    
    }