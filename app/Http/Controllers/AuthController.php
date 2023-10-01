<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persons;

use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function CheckPersonLogName(Request $request) {
        $validator = Validator::make($request->all(), [
            'person_name' => 'required|regex:/^[a-z\d\-_\s]+$/i|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => "invalid input, please check your data",
                'validation' => $validator->messages(),
                'data' => null
            ], 400);
        }
        $personName = $request->input('person_name');

        $person = Persons::where('name', 'LIKE', '%'.$personName.'%')->first();
        if (!$person) {
            return response([
                'success' => false,
                'message' => 'Data not found',
                'data' => null
            ], 404);
        }

        return response([
            'success' => true,
            'data' => $person
        ], 200);
    }
}
