<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Families;
use App\Models\FamilyRelations;
use App\Models\Galleries;
use App\Models\Photos;

use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;

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
            'inserted_id' => $family->id,
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

    public function FetchFamilyGalleries(Request $request, $family_id) {
        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        $families = FamilyRelations::where('person_id', $userData["user"]["person"]["id"])->get();

        // validate family id
        $familyFound = false;
        foreach ($families as $key => $family) {
            if ($family->family_id == $family_id) {
                $familyFound = true;
            }
        }
        if (!$familyFound) {
            return response([
                'success' => false,
                'message' => 'Gallery not found',
                'data' => null
            ], 404);
        }

        $family = Families::find($family_id);
        if ($family == null) {
            return response([
                'success' => false,
                'message' => 'Family not found',
                'data' => null
            ], 404);
        }

        $galleries = Galleries::where('family_id', $family->id)->get();
        if ($galleries == null) {
            return response([
                'success' => true,
                'message' => 'No gallery found',
                'data' => null
            ], 200);
        }

        return response([
            'success' => true,
            'data' => $galleries
        ], 200);
    }

    public function CreateNewGallery(Request $request) {
        $validator = Validator::make($request->all(), [
            'family_id'   => 'required|exists:families,id',
            'gallery_title'   => 'required',
            'description' => 'nullable',
            'gallery_date' => 'date|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        $families = FamilyRelations::where('person_id', $userData["user"]["person"]["id"])->get();

        // validate family id
        $familyFound = false;
        foreach ($families as $key => $family) {
            if ($family->family_id == $request->family_id) {
                $familyFound = true;
            }
        }
        if (!$familyFound) {
            return response([
                'success' => false,
                'message' => 'You are not part of the family',
                'data' => null
            ], 400);
        }

        $galleries = new Galleries;
        $galleries->family_id = $request->family_id;
        $galleries->gallery_title = $request->gallery_title;
        $galleries->description = $request->description;
        $galleries->gallery_date = $request->gallery_date;

        try {
            $galleries->save();
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

    public function UpdateGallery(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'family_id'   => 'required|exists:families,id',
            'gallery_title'   => 'required',
            'description' => 'nullable',
            'gallery_date' => 'date|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        $families = FamilyRelations::where('person_id', $userData["user"]["person"]["id"])->get();

        // validate family id
        $familyFound = false;
        foreach ($families as $key => $family) {
            if ($family->family_id == $request->family_id) {
                $familyFound = true;
            }
        }
        if (!$familyFound) {
            return response([
                'success' => false,
                'message' => 'You are not part of the family',
                'data' => null
            ], 400);
        }

        $galleries = Galleries::find($id);
        if ($galleries == null) {
            return response([
                'success' => false,
                'message' => 'Gallery not found',
                'data' => null
            ], 404);
        }

        $galleries->family_id = $request->family_id;
        $galleries->gallery_title = $request->gallery_title;
        $galleries->description = $request->description;
        $galleries->gallery_date = $request->gallery_date;

        try {
            $galleries->save();
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

    public function FetchFamilyGalleryDetail(Request $request, $id) {
        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        $families = FamilyRelations::where('person_id', $userData["user"]["person"]["id"])->get();

        $gallery = Galleries::find($id);
        if ($gallery == null) {
            return response([
                'success' => false,
                'message' => 'Gallery not found',
                'data' => null
            ], 404);
        }

        $familyFound = false;
        foreach ($families as $key => $family) {
            if ($family->family_id == $gallery->family_id) {
                $familyFound = true;
            }
        }
        if (!$familyFound) {
            return response([
                'success' => false,
                'message' => 'Gallery not found',
                'data' => null
            ], 404);
        }

        return response([
            'success' => true,
            'data' => $gallery
        ], 200);
    }

    public function AddNewPhotosToGallery(Request $request) {
        $validator = Validator::make($request->all(), [
            'gallery_id' => 'required|exists:galleries,id',
            "img_address"    => "required|array",
            'img_address.*' => 'required|regex:/^[a-zA-Z]+\/.*/',
            'description' => 'regex:/^[a-z\d\-_\s]+$/i|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        // prepare data
        $photoListData = [];

        foreach ($request->img_address as $key => $img_address) {
            array_push($photoListData, [
                'gallery_id' => $request->gallery_id,
                'img_address' => $img_address,
                'description' => $request->description,
            ]);
        }

        if (count($photoListData) <= 0) {
            return response([
                'success' => false,
                'message' => 'No Image to Upload',
                'data' => null
            ], 400);
        }

        try {
            Photos::insert($photoListData);
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
}
