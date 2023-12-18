<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\ClientException;


use App\Models\Persons;
use App\Models\User;
use JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    public function hitAPI($method, $url) {
        $client = new GuzzleClient();
        try {
            $res = $client->get($url);
        } catch (ClientException $e) {
            return false;
        }

        return json_decode($res->getBody()->getContents());
    }

    public function login(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        $url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=".$request->access_token."";
        $googleUserInfo = $this->hitAPI("GET", $url);
        if ($googleUserInfo == false) {
            return response()->json([
                'status' => "Failed to login",
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = User::where("email", $googleUserInfo->email)->first();
        if ($user == null) {
            // if user doesn't exists then create the new one
            $user = User::create([
                'name' => $googleUserInfo->name,
                'email' => $googleUserInfo->email,
                'profile_pict' => $googleUserInfo->picture,
            ]);
        }

        // update profile pict if the profile pict changed or doesn't exists
        if ($user->profile_pict == null || $user->profile_pict != $googleUserInfo->picture) {
            $user->profile_pict = $googleUserInfo->picture;
            $user->save();
        }

        $token = JWTAuth::fromUser($user);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        return response()->json([
                'status' => 'success',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ]);

    }

    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($user);
        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

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
