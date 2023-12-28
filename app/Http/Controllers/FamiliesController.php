<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Families;
use App\Models\FamilyRelations;

use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\URL;

class FamiliesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function CreateFamily(Request $request) {
        $validator = Validator::make($request->all(), [
            'family_name'   => 'required|regex:/^[a-z\d\-_\s]+$/i',
            'main_address'      => 'required|regex:/(^[-0-9A-Za-z.,\/ ]+$)/|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $family = new Families;
        $family->family_name = $request->family_name;
        $family->family_address = $request->main_address;
        try {
            $family->save();
        } catch (QueryException $e) {
            return response([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

        return response([
            'success' => true,
        ], 200);
    }

    public function AssignFamily(Request $request) {
        $validator = Validator::make($request->all(), [
            'family_id'   => 'required|exists:families,id',
            'person_id'   => 'required|exists:persons,id',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $familyRelation = new FamilyRelations;
        $familyRelation->person_id = $request->person_id;
        $familyRelation->family_id = $request->family_id;
        try {
            $familyRelation->save();
        } catch (QueryException $e) {
            return response([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

        return response([
            'success' => true,
        ], 200);
    }

    public function FetchAllFamilyMember(Request $request, $family_id) {
        $family = Families::find($family_id);
        if (!$family) {
            return response([
                'success' => false,
                'message' => 'Data not found',
                'data' => null
            ], 404);
        }

        $personList = [];
        foreach ($family->persons as $familyRelation) {
            array_push($personList, $familyRelation->person);
        }

        return response([
            'success' => true,
            'data' => $personList
        ], 200);
    }

    public function FetchAllFamily(Request $request) {
        $families = Families::all();
        return response([
            'success' => true,
            'data' => $families
        ], 200);
    }
}
