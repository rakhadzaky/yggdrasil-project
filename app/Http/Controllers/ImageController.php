<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use Image;
use DateTime;

class ImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function UploadPhotoToStore(Request $request) {
        $validator = Validator::make($request->all(), [
            'img_file' => 'mimes:jpg,jpeg,bmp,png',
            'photo_type' => [
                'required',
                Rule::in(['gallery', 'profile'])
            ]
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        // get image
        $imgFile = $request->file('img_file');
        $img = Image::make($imgFile->getRealPath());
        $img->resize(720, 720, function ($constraint) {
            $constraint->aspectRatio();                 
        });
        
        // rename image
        $date = new DateTime();
        $dateStr = $date->format('YmdHis');
        $imgFileName = $request->photo_type.'/'.$userData["user"]["person"]["id"].'-'.$dateStr.'.'.$imgFile->getClientOriginalExtension();

        // store
        $img->stream();
        try {
            Storage::disk('local')->put('public/'.$imgFileName, $img, 'public');
        } catch (QueryException $e) {
            return response([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

        $imgData = 'storage/'.$imgFileName;

        return response([
            'success' => true,
            'image_location' => $imgData
        ], 200);
    }
}
