<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persons;
use App\Models\PersonRelations;

use Carbon\Carbon;
use Illuminate\Support\Facades\URL;



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

        return response([
            'success' => true,
            'data' => $person
        ], 200);
    }
}
