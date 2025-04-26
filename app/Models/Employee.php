<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'nom_famille',
        'prenom',
        'numero_cin',
        'numero_embauche',
        'date_naissance',
        'lieu_naissance',
        'situation_familiale',
        'nombre_enfants',
        'cadre',
        'grade',
        'date_grade',
        'rang',
        'date_effet',
        'date_entree_fonction_publique',
        'fonction_actuelle',
        'date_fonction_actuelle',
        'lieu_affectation',
        'adresse'
    ];

    protected $dates = [
        'date_naissance',
        'date_grade',
        'date_effet',
        'date_entree_fonction_publique',
        'date_fonction_actuelle'
    ];

    public function notes()
    {
        return $this->hasMany(EmployeeNote::class);
    }
}