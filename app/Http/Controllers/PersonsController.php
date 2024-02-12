<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persons;
use App\Models\PersonRelations;
use App\Models\Families;
use App\Models\FamilyRelations;
use App\Models\Roles;
use App\Models\RolesUser;
use App\Models\PersonPhotos;

use Carbon\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use Image;
use DateTime;

class PersonsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function FetchFamilyByPersonId($pid) {
        $familliesTree = array();

        $person = Persons::find($pid);
        if (!$person) {
            return response([
                'success' => false,
                'message' => 'Data not found',
                'data' => null
            ], 404);
        }
        
        $relation = PersonRelations::where('pid', $person->id)->first();

        if (!$relation) {
            // assign current person to list
            
            $imgProfile = $person->img_url;
            if ($person->img_file != null) {
                $imgProfile = URL::to('/').'/'.$person->img_file;
            }

            array_unshift($familliesTree, [
                'id' => $person->id,
                'pids' => [null],
                'mid' => null,
                'fid' => null,
                'name' => $person->name,
                'gender' => $person->gender,
                'age' => Carbon::parse($person->birthdate)->age,
                'img' => $imgProfile,
                'link' => "",
            ]);

            return response([
                'success' => true,
                'data' => $familliesTree
            ], 200);
        }

        // get self ancestor recrusive
        if ($relation->mid != null) {
            foreach ($this->getAncestorRelationByPersonId($relation->mid) as $ancestorMother) {
                array_unshift($familliesTree, $ancestorMother);
            }
        }
        if ($relation->fid != null) {
            foreach ($this->getAncestorRelationByPersonId($relation->fid) as $ancestorFather) {
                array_unshift($familliesTree, $ancestorFather);
            }
        }

        // get wife/husband ancestor recrusive
        if ($relation->pid_relation != null) {
            $personInRelationship = Persons::find($relation->pid_relation);
            $relationPIR = PersonRelations::where('pid', $personInRelationship->id)->first();

            // wife/husband ancestor mother
            if ($relationPIR->mid != null) {
                foreach ($this->getAncestorRelationByPersonId($relationPIR->mid) as $ancestorMother) {
                    array_unshift($familliesTree, $ancestorMother);
                }
            }
            // wife/husband ancestor father
            if ($relationPIR->fid != null) {
                foreach ($this->getAncestorRelationByPersonId($relationPIR->fid) as $ancestorFather) {
                    array_unshift($familliesTree, $ancestorFather);
                }
            }

            $imgProfile = $personInRelationship->img_url;
            if ($personInRelationship->img_file != null) {
                $imgProfile = URL::to('/').'/'.$personInRelationship->img_file;
            }

            // assign person in relationship to list
            array_unshift($familliesTree, [
                'id' => $relationPIR->pid,
                'pids' => [$relationPIR->pid_relation],
                'mid' => $relationPIR->mid,
                'fid' => $relationPIR->fid,
                'name' => $personInRelationship->name,
                'gender' => $personInRelationship->gender,
                'age' => Carbon::parse($personInRelationship->birthdate)->age,
                'img' => $imgProfile,
                'link' => "",
            ]);
        }

        // get brother/sister from parent
        if ($relation->mid != null && $relation->fid != null) {
            $parentDescendants = $this->getDescendantsRelationByPersonId($relation->mid, $relation->fid);
            foreach ($parentDescendants as $sibling) {
                array_unshift($familliesTree, $sibling);
            }
        }

        // get mother grandparents descendant
        if ($relation->mid != null) {
            $grandmaDescendants = $this->getGrandParentsDescendantsRelationByParentID($relation->mid);
            foreach ($grandmaDescendants as $motherSibling) {
                array_unshift($familliesTree, $motherSibling);
            }
        }
        // get father grandparents descendant
        if ($relation->fid != null) {
            $grandpanextDescendants = $this->getGrandParentsDescendantsRelationByParentID($relation->fid);
            foreach ($grandmaDescendants as $fatherSibling) {
                array_unshift($familliesTree, $fatherSibling);
            }
        }

        // get descendant recrusive
        if ($relation->pid_relation != null) {
            $nextDescendants = array();
            if ($person->gender == 'male') {
                $nextDescendants = $this->getDescendantsRelationByPersonId($relation->pid_relation, $relation->pid);
            }else {
                $nextDescendants = $this->getDescendantsRelationByPersonId($relation->pid, $relation->pid_relation);
            }
            foreach ($nextDescendants as $descendant) {
                array_unshift($familliesTree, $descendant);
            }
        }

        // assign current person to list
        $imgProfile = $person->img_url;
        if ($person->img_file != null) {
            $imgProfile = URL::to('/').'/'.$person->img_file;
        }

        array_unshift($familliesTree, [
            'id' => $relation->pid,
            'pids' => [$relation->pid_relation],
            'mid' => $relation->mid,
            'fid' => $relation->fid,
            'name' => $person->name,
            'gender' => $person->gender,
            'age' => Carbon::parse($person->birthdate)->age,
            'img' => $imgProfile,
            'link' => "",
        ]);

        if (sizeof($familliesTree) <= 0) {
            return [
                'success' => false,
                'message' => 'Data not found',
                'data' => null
            ];
        }

        $myCollection = collect($familliesTree);

        $uniqueCollection = $myCollection->unique(function ($item) {
                            return $item['id'];
                        });

        return response([
            'success' => true,
            'data' => $uniqueCollection
        ], 200);
    }

    public function getAncestorRelationByPersonId($pid) {
        $familliesTree = array();

        $person = Persons::find($pid);
        $relation = PersonRelations::where('pid', $person->id)->first();

        if ($relation->mid != null) {
            foreach ($this->getAncestorRelationByPersonId($relation->mid) as $ancestorMother) {
                array_unshift($familliesTree, $ancestorMother);
            }
        }
        if ($relation->fid != null) {
            foreach ($this->getAncestorRelationByPersonId($relation->fid) as $ancestorFather) {
                array_unshift($familliesTree, $ancestorFather);
            }
        }

        $imgProfile = $person->img_url;
        if ($person->img_file != null) {
            $imgProfile = URL::to('/').'/'.$person->img_file;
        }

        array_unshift($familliesTree, [
            'id' => $relation->pid,
            'pids' => [$relation->pid_relation],
            'mid' => $relation->mid,
            'fid' => $relation->fid,
            'name' => $person->name,
            'gender' => $person->gender,
            'age' => Carbon::parse($person->birthdate)->age,
            'img' => $imgProfile,
            'link' => "",
        ]);

        return $familliesTree;
    }

    public function getDescendantsRelationByPersonId($mid, $fid) {
        $familliesTree = array();

        $relations = PersonRelations::where('mid', $mid)->where('fid', $fid)->get();
        foreach ($relations as $relation) {
            $person = Persons::find($relation->pid);
            if ($person == null) {
                continue;
            }

            $imgProfile = URL::to('/').'/dummy-profile.png';

            if ($person->img_url != null) {
                $imgProfile = $person->img_url;
            }
            if ($person->img_file != null) {
                $imgProfile = URL::to('/').'/'.$person->img_file;
            }

            array_unshift($familliesTree, [
                'id' => $relation->pid,
                'pids' => [$relation->pid_relation],
                'mid' => $relation->mid,
                'fid' => $relation->fid,
                'name' => $person->name,
                'gender' => $person->gender,
                'age' => Carbon::parse($person->birthdate)->age,
                'img' => $imgProfile,
                'link' => "",
            ]);

            if ($relation->pid_relation != null) {
                $nextDescendants = array();
                if ($person->gender == 'male') {
                    $nextDescendants = $this->getDescendantsRelationByPersonId($relation->pid_relation, $relation->pid);
                }else {
                    $nextDescendants = $this->getDescendantsRelationByPersonId($relation->pid, $relation->pid_relation);
                }
                foreach ($nextDescendants as $descendant) {
                    array_unshift($familliesTree, $descendant);
                }
            }
        }

        return $familliesTree;
    }

    public function getGrandParentsDescendantsRelationByParentID($pid) {
        $familliesTree = array();

        $parentRelation = PersonRelations::where('pid', $pid)->first();

        $relations = PersonRelations::where('mid', $parentRelation->mid)->where('fid', $parentRelation->fid)->get();
        foreach ($relations as $relation) {
            $person = Persons::find($relation->pid);

            $imgProfile = $person->img_url;
            if ($person->img_file != null) {
                $imgProfile = URL::to('/').'/'.$person->img_file;
            }

            array_unshift($familliesTree, [
                'id' => $relation->pid,
                'pids' => [$relation->pid_relation],
                'mid' => $relation->mid,
                'fid' => $relation->fid,
                'name' => $person->name,
                'gender' => $person->gender,
                'age' => Carbon::parse($person->birthdate)->age,
                'img' => $imgProfile,
                'link' => "",
            ]);

            if ($relation->pid_relation != null) {
                $nextDescendants = array();
                if ($person->gender == 'male') {
                    $nextDescendants = $this->getDescendantsRelationByPersonId($relation->pid_relation, $relation->pid);
                }else {
                    $nextDescendants = $this->getDescendantsRelationByPersonId($relation->pid, $relation->pid_relation);
                }
                foreach ($nextDescendants as $descendant) {
                    array_unshift($familliesTree, $descendant);
                }
            }
        }

        return $familliesTree;
    }

    public function getDetailPersonByPID($pid) {
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

    public function AddNewFamilyAndPerson(Request $request) {
        $validator = Validator::make($request->all(), [
            'family_name'   => 'required|regex:/^[a-z\d\-_\s]+$/i',
            'main_address'      => 'required|regex:/(^[-0-9A-Za-z.,\/ ]+$)/|nullable',
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

        // create family prepare data
        $family = new Families;
        $family->family_name = $request->family_name;
        $family->family_address = $request->main_address;

        // create person data
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
        // get user data from authorization
        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        $insertPerson = new Persons;
        $insertPerson->user_id = $userData["user"]["id"];
        $insertPerson->name = $request->input('name');
        $insertPerson->gender = $request->input('gender');
        $insertPerson->birthdate = $request->input('birthdate');
        $insertPerson->img_url = $request->input('img_url');
        $insertPerson->img_file = $imgData;
        $insertPerson->live_loc = $request->input('live_loc');
        $insertPerson->phone = $request->input('phone');

        // assign person to family
        // prepare data for family relations
        $familyRelationsData = [
            "family_id" => 0,
            "person_id" => 0
        ];

        // prepare data for person relations
        $personRelationData = [
            "pid" => 0,
            "hfid" => 0,
        ];

        // prepare data for roles admin
        $roleData = [
            "role_id" => 1, // role 1 = Admin
            "user_id" => $userData["user"]["id"],
        ];

        // store and save data using transaction
        DB::beginTransaction();
        try {
            $family->save();
            $insertPerson->save();
            $familyRelationsData["family_id"] = $family->id;
            $familyRelationsData["person_id"] = $insertPerson->id;
            FamilyRelations::create($familyRelationsData);
            $personRelationData["pid"] = $insertPerson->id;
            $personRelationData["hfid"] = $insertPerson->id;
            PersonRelations::create($personRelationData);
            RolesUser::upsert($roleData, ['user_id', 'role_id']);

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

    public function FetchPersonPhotos($pid) {
        $validator = Validator::make(['pid' => $pid], [
            'pid' => 'required|exists:persons,id',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $photos = PersonPhotos::where('pid', $pid)->get();
        if ($photos == null) {
            return response([
                'success' => false,
                'message' => 'No photo data found, please insert it first',
                'data' => null,
            ], 404);
        }

        return response([
            'success' => true,
            'data' => $photos,
        ], 200);
    }
}
