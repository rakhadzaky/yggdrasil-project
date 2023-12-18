<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persons;
use App\Models\PersonRelations;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

use Image;
use DateTime;


class SuperAdminPersonController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function FetchAllHeadFamilyData(Request $request) {
        $validator = Validator::make($request->all(), [
            'search'    => 'regex:/^[a-z\d\-_\s]+$/i|nullable',
            'gender'    => 'alpha|nullable',
            'page'      => 'numeric|nullable',
            'length'    => 'numeric|nullable',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $search = $request->input('search');
        $gender = $request->input('gender');

        $page = $request->input('page');
        $length = $request->input('length');

        $pagination = [$page, $length];

        $fetchPersonQuery = DB::table('persons_relations')
        ->select('persons_relations.hfid', DB::raw('count(persons_relations.hfid) as total_member'), 'persons.*')
        ->join('persons','persons.id', '=', 'persons_relations.hfid')
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
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $search = $request->input('search');
        $gender = $request->input('gender');

        $page = $request->input('page');
        $length = $request->input('length');

        $pagination = [$page, $length];

        $fetchPersonQuery = DB::table('persons')
        ->select('persons.*', 'persons_relations.pid')
        ->leftjoin('persons_relations','persons.id', '=', 'persons_relations.pid')
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
            'name' => 'required|regex:/^[a-z\d\-_\s]+$/i',
            'gender' => 'required|alpha',
            'birthdate' => 'required|date',
            'img_url' => 'url:http,https',
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

        $insertPerson = new Persons;
        $insertPerson->name = $request->input('name');
        $insertPerson->gender = $request->input('gender');
        $insertPerson->birthdate = $request->input('birthdate');
        $insertPerson->img_url = $request->input('img_url');
        $insertPerson->img_file = $imgData;
        $insertPerson->live_loc = $request->input('live_loc');
        $insertPerson->phone = $request->input('phone');

        try {
            $insertPerson->save();
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
            'img_url' => 'url:http,https',
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

        $insertPerson = Persons::find($pid);
        if ($insertPerson == null) {
            return response([
                'success' => false,
                'message' => 'person not found',
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

        $insertPerson->name = $request->input('name');
        $insertPerson->gender = $request->input('gender');
        $insertPerson->birthdate = $request->input('birthdate');
        $insertPerson->img_url = $request->input('img_url');
        $insertPerson->img_file = $imgData;
        $insertPerson->live_loc = $request->input('live_loc');
        $insertPerson->phone = $request->input('phone');

        try {
            $insertPerson->save();
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

        $personRelation = PersonRelations::where('pid', '=', $pid)->first();
        
        if ($personRelation != null) {
            $relationData = [
                "father" => $personRelation->fatherPerson,
                "mother" => $personRelation->motherPerson,
            ];

            $person->family = $relationData;
        } else {
            $person->family = null;
        }

        return response([
            'success' => true,
            'data' => $person
        ], 200);
    }
}
