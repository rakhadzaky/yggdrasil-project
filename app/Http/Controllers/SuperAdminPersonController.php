<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

use App\Models\Persons;
use App\Models\PersonRelations;
use App\Models\Families;
use App\Models\FamilyRelations;
use App\Models\PersonPhotos;

use Carbon\Carbon;
use Image;
use DateTime;


class SuperAdminPersonController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('roleCheck:super_admin');
    }

    public function FetchAllHeadFamilyData(Request $request) {
        $validator = Validator::make($request->all(), [
            'search'    => 'regex:/^[a-z\d\-_\s]+$/i|nullable',
            'gender'    => 'alpha|nullable',
            'page'      => 'numeric|nullable',
            'length'    => 'numeric|nullable',
            'family_id' => 'numeric|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        if ($request->family_id) {
            $jwtToken = explode(' ', $request->header('Authorization'))[1];
            $userData = Auth::payload($jwtToken)->toArray();

            $familyData = FamilyRelations::where('family_id', $request->family_id)->where('person_id', $userData["user"]["person"]["id"])->first();
            if ($familyData == null) {
                return response([
                    'success' => false,
                    'message' => 'Invalid family data',
                ], 400);
            }
        }

        $search = $request->input('search');
        $gender = $request->input('gender');
        $family_id = $request->input('family_id');

        $page = $request->input('page');
        $length = $request->input('length');

        $pagination = [$page, $length];

        $fetchPersonQuery = DB::table('persons_relations')
        ->select('persons_relations.hfid', DB::raw('count(persons_relations.hfid) as total_member'), 'persons.*')
        ->join('persons','persons.id', '=', 'persons_relations.hfid')
        ->orWhereNull('persons.deleted_at')
        ->when($family_id, function ($query, $family_id) {
            return $query->join('family_relations','family_relations.person_id', '=', 'persons.id')->where('family_relations.family_id', $family_id);
        })
        ->groupBy('persons_relations.hfid')
        ->when($search, function ($query, $search) {
            return $query->having('name', 'LIKE', '%'.$search.'%');
        })
        ->when($gender, function ($query, $gender) {
            return $query->having('gender', $gender);
        });

        $fetchPersonTotal = $fetchPersonQuery->count();

        $fetchPerson = $fetchPersonQuery
            ->when($pagination, function ($query, $pagination) {
                $pageNum = $pagination[0];
                $lengthLimit = $pagination[1];
                if ($pageNum > 0 && $lengthLimit > 0) {
                    return $query->skip($lengthLimit * ($pageNum - 1))->take($lengthLimit);
                }
            })
            ->get();

        if (!$fetchPerson) {
            return response([
                'success' => true,
                'data' => [],
                'page' => intval($page),
                'total' => 0,
            ], 200);
        }

        foreach ($fetchPerson as $key => $person) {
            $fetchPerson[$key]->age = Carbon::parse($person->birthdate)->age;
        }

        return response([
            'success' => true,
            'data' => $fetchPerson,
            'page' => intval($page),
            'total' => $fetchPersonTotal,
        ], 200);
    }
    
    public function FetchAllPersonData(Request $request) {
        $validator = Validator::make($request->all(), [
            'search'    => 'regex:/^[a-z\d\-_\s]+$/i|nullable',
            'gender'    => 'alpha|nullable',
            'page'      => 'numeric|nullable',
            'length'    => 'numeric|nullable',
            'family_id' => 'numeric|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        if ($request->family_id) {
            $jwtToken = explode(' ', $request->header('Authorization'))[1];
            $userData = Auth::payload($jwtToken)->toArray();

            $familyData = FamilyRelations::where('family_id', $request->family_id)->where('person_id', $userData["user"]["person"]["id"])->first();
            if ($familyData == null) {
                return response([
                    'success' => false,
                    'message' => 'Invalid family data',
                ], 400);
            }
        }

        $search = $request->input('search');
        $gender = $request->input('gender');
        $family_id = $request->input('family_id');

        $page = $request->input('page');
        $length = $request->input('length');

        $pagination = [$page, $length];

        $fetchPersonQuery = DB::table('persons')
        ->select('persons.*', 'persons_relations.pid')
        ->orWhereNull('persons.deleted_at')
        ->leftjoin('persons_relations','persons.id', '=', 'persons_relations.pid')
        ->when($family_id, function ($query, $family_id) {
            return $query->join('family_relations','family_relations.person_id', '=', 'persons.id')->where('family_relations.family_id', $family_id);
        })
        ->when($search, function ($query, $search) {
            return $query->where('name', 'LIKE', '%'.$search.'%');
        })
        ->when($gender, function ($query, $gender) {
            return $query->where('gender', $gender);
        });

        $fetchPersonTotal = $fetchPersonQuery->count();

        $fetchPerson = $fetchPersonQuery
            ->when($pagination, function ($query, $pagination) {
                $pageNum = $pagination[0];
                $lengthLimit = $pagination[1];
                if ($pageNum > 0 && $lengthLimit > 0) {
                    return $query->skip($lengthLimit * ($pageNum - 1))->take($lengthLimit);
                }
            })
            ->get();

        if (!$fetchPerson) {
            return response([
                'success' => true,
                'data' => [],
                'page' => intval($page),
                'total' => 0,
            ], 200);
        }

        foreach ($fetchPerson as $key => $person) {
            $fetchPerson[$key]->age = Carbon::parse($person->birthdate)->age;
        }

        return response([
            'success' => true,
            'data' => $fetchPerson,
            'page' => intval($page),
            'total' => $fetchPersonTotal,
        ], 200);
    }

    public function AddNewPerson(Request $request) {
        $validator = Validator::make($request->all(), [
            'family_id' => 'required|exists:families,id',
            'name' => 'required|regex:/^[a-z\d\-_\s]+$/i',
            'gender' => 'required|alpha',
            'birthdate' => 'required|date',
            'img_file' => 'mimes:jpg,jpeg,bmp,png',
            'live_loc' => 'regex:/^[a-z\d\-_\s]+$/i|nullable',
            'phone' => 'numeric|nullable'
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        if ($request->input('img_url') == null && $request->file('img_file') == null) {
            return response([
                'success' => false,
                'message' => [
                    'img_url' => ['image url or image file is required'],
                    'img_file' => ['image url or image file is required'],
                ],
            ], 400);
        }

        $imgData = null;
        if ($request->file('img_file') != null) {
            // get image
            $imgFile = $request->file('img_file');
            $img = Image::make($imgFile->getRealPath());
            $img->resize(720, 720, function ($constraint) {
                $constraint->aspectRatio();                 
            });
            
            // rename image
            $date = new DateTime();
            $dateStr = $date->format('YmdHis');
            $imgFileName = 'img/'.$request->input('name').'-'.$dateStr.'.'.$imgFile->getClientOriginalExtension();

            // store
            $img->stream();
            Storage::disk('local')->put('public/'.$imgFileName, $img, 'public');

            $imgData = 'storage/'.$imgFileName;
        }

        // prepare data for person data
        $insertPerson = new Persons;
        $insertPerson->name = $request->input('name');
        $insertPerson->gender = $request->input('gender');
        $insertPerson->birthdate = $request->input('birthdate');
        $insertPerson->img_url = $request->input('img_url');
        $insertPerson->img_file = $imgData;
        $insertPerson->live_loc = $request->input('live_loc');
        $insertPerson->phone = $request->input('phone');

        // prepare data for family relations
        $familyRelationsData = [
            "family_id" => $request->family_id,
        ];

        // prepare data for person photos list
        $insertPersonPhotos = new PersonPhotos;
        $insertPersonPhotos->img_address = $imgData;
        $insertPersonPhotos->is_main_image = true;

        // store and save data using transaction
        DB::beginTransaction();
        try {
            $insertPerson->save();
            
            $familyRelationsData["person_id"] = $insertPerson->id;
            FamilyRelations::create($familyRelationsData);
            
            $insertPersonPhotos->pid = $insertPerson->id;
            $insertPerson->save();

            DB::commit();
        } catch (QueryException $e) {
            DB::rollback();

            return response([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

        return response([
            'success' => true,
            'inserted_id' => $insertPerson->id,
        ], 200);
    }

    public function DeletePerson(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required|array|min:1',
            'id.*' => 'exists:persons,id',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $wantDeleteData = Persons::find($request->input('id'));
        $totalData = $wantDeleteData->count();
        try {
            $wantDeleteData->each(function ($person, $key) {
                $person->delete();
            });
        } catch (QueryException $e) {
            return response([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

        return response([
            'success' => true,
            'total_data' => $totalData,
        ], 200);
    }

    public function UpdatePerson(Request $request, $pid) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|regex:/^[a-z\d\-_\s]+$/i',
            'gender' => 'required|alpha',
            'birthdate' => 'required|date',
            'img_file' => 'mimes:jpg,jpeg,bmp,png|nullable',
            'live_loc' => 'regex:/^[a-z\d\-_\s]+$/i|nullable',
            'phone' => 'numeric|nullable'
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $insertPerson = Persons::find($pid);
        if ($insertPerson == null) {
            return response([
                'success' => false,
                'message' => 'person not found',
            ], 400);
        }

        $imgData = null;
        if ($request->file('img_file') != null) {
            // get image
            $imgFile = $request->file('img_file');
            $img = Image::make($imgFile->getRealPath());
            $img->resize(720, 720, function ($constraint) {
                $constraint->aspectRatio();                 
            });
            
            // rename image
            $date = new DateTime();
            $dateStr = $date->format('YmdHis');
            $imgFileName = 'img/'.$request->input('name').'-'.$dateStr.'.'.$imgFile->getClientOriginalExtension();

            // store
            $img->stream();
            Storage::disk('local')->put('public/'.$imgFileName, $img, 'public');

            $imgData = 'storage/'.$imgFileName;
        }

        // prepare data for update person data
        $insertPerson->name = $request->input('name');
        $insertPerson->gender = $request->input('gender');
        $insertPerson->birthdate = $request->input('birthdate');
        $insertPerson->live_loc = $request->input('live_loc');
        $insertPerson->phone = $request->input('phone');
        if ($imgData != null) {
            $insertPerson->img_file = $imgData;
        }
        if ($request->input('img_url')) {
            $insertPerson->img_url = $request->input('img_url');
        }

        // prepare update all previous person photo list
        $updatePersonPhotos = PersonPhotos::where('pid', $pid);

        // prepare data for person photos list
        $insertPersonPhotos = new PersonPhotos;
        $insertPersonPhotos->img_address = $imgData;
        $insertPersonPhotos->is_main_image = true;
        $insertPersonPhotos->pid = $pid;

        // store and save data using transaction
        DB::beginTransaction();
        try {
            $insertPerson->save();

            $updatePersonPhotos->update(['is_main_image' => 0]);
            $insertPersonPhotos->save();

            DB::commit();
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

    public function GetPersonDetail(Request $request, $pid) {
        $person = Persons::find($pid);
        if (!$person) {
            return response([
                'success' => false,
                'data' => null,
                'message' => 'Data not found'
            ], 404);
        }

        // fetch person relation
        $personRelation = PersonRelations::where('pid', '=', $pid)->first();
        if ($personRelation != null) {
            $relationData = [
                "father" => $personRelation->fatherPerson,
                "mother" => $personRelation->motherPerson,
                "partner" => $personRelation->partnerPerson,
                "head" => $personRelation->headOfFamilyPerson,
            ];

            $person->family = $relationData;
        } else {
            $person->family = null;
        }

        // fetch person relation
        $person->families = $person->families;

        return response([
            'success' => true,
            'data' => $person
        ], 200);
    }

    public function GetFamilyList(Request $request, $person_id) {
        $person = Persons::find($person_id);
        if (!$person) {
            return response([
                'success' => false,
                'data' => null,
                'message' => 'Data not found'
            ], 404);
        }

        $families = [];
        $familyRelations = $person->families;
        foreach ($familyRelations as $value) {
            array_push($families, $value->family);
        }

        return response([
            'success' => true,
            'data' => $families
        ], 200);
    }

    public function AssignPersonRelation(Request $request) {
        $validator = Validator::make($request->all(), [
            'pid' => 'nullable|numeric|exists:persons,id',
            'mid' => 'nullable|numeric|exists:persons,id',
            'fid' => 'nullable|numeric|exists:persons,id',
            'pid_relation' => 'nullable|numeric|exists:persons,id',
            'is_head_of_family' => 'boolean',
            'family_id_list' => 'required|array',
            'family_id_list.*' => 'numeric|exists:families,id',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        // prepare person relation data
        $personRelationData = [
            'pid' => $request->pid,
            'mid' => $request->mid,
            'fid' => $request->fid,
            'pid_relation' => $request->pid_relation,
        ];
        if ($request->is_head_of_family) {
            $personRelationData['hfid'] = $request->pid;
        }

        // prepare family relation data
        $familyRelationsData = [];
        foreach ($request->family_id_list as $family_id) {
            array_push($familyRelationsData, [
                'person_id' => $request->pid,
                'family_id' => $family_id
            ]);
        }

        // store and update data using transaction
        DB::beginTransaction();
        try {
            PersonRelations::upsert($personRelationData, ['pid'], ['mid', 'fid', 'pid_relation']);
            FamilyRelations::upsert($familyRelationsData, ['person_id', 'family_id']);

            DB::commit();
        } catch (QueryException $e) {
            DB::rollback();

            return response([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

        return response([
            'success' => true,
        ], 200);
    }

    public function AddNewPersonPhotos(Request $request) {
        $validator = Validator::make($request->all(), [
            'pid' => 'required|exists:persons,id',
            "img_address"    => "required|array",
            'img_address.*' => 'required|regex:/^[a-zA-Z]+\/.*/',
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
                'pid' => $request->pid,
                'img_address' => $img_address,
                'is_main_image' => false,
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
            PersonPhotos::insert($photoListData);
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

    public function SetMainPersonPhoto(Request $request) {
        $validator = Validator::make($request->all(), [
            'pid' => 'required|exists:persons,id',
            'photos_id' => 'required|exists:person_photos,id',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        // get photo detail data
        $photo = PersonPhotos::find($request->photos_id);
        if ($photo == null) {
            return response([
                'success' => false,
                'message' => 'Photo not found',
                'data' => null
            ], 404);
        }
        $photo->is_main_image = true;

        try {
            PersonPhotos::where('pid', $request->pid)->update(['is_main_image' => false]);
            $photo->save();
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
