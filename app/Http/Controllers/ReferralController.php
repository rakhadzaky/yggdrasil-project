<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

use App\Models\ReferralLog;
use App\Models\Persons;
use App\Mail\MailService;

class ReferralController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function CreateReferral(Request $request) {
        $validator = Validator::make($request->all(), [
            'submited_person_id'   => 'required|exists:persons,id',
            'sent_to_email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        $referral = new ReferralLog;
        $referral->submited_pid = $request->submited_person_id;
        $referral->referral_code = Str::random(8);
        $referral->expired_time = Carbon::now()->addDays(1);
        $referral->is_used = false;
        $referral->sent_to_email = $request->sent_to_email;
        $referral->created_by_email = $userData["user"]["email"];
        try {
            $referral->save();

            $mailContent = [
                'sender' => $userData["user"]["name"],
                'referral_code' => $referral->referral_code,
                'expired_time' => $referral->expired_time,
            ];
            Mail::to($request->sent_to_email)->send(new MailService($mailContent));
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

    public function SearchReferralCode(Request $request, $referral_code) {
        // get user data from authorization
        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        // get referral data by referral code
        $referralData = ReferralLog::where('referral_code', $referral_code)->first();
        if ($referralData == null) {
            return response([
                'success' => false,
                'message' => 'Sorry, your referral code was not valid',
            ], 404);
        }

        // validate referral data
        $isUserValid = $referralData->sent_to_email == $userData["user"]["email"];
        $isNotExpired = Carbon::now()->lt($referralData->expired_time);
        $isNotUsed = !($referralData->is_used);

        if (!($isUserValid && $isNotExpired && $isNotUsed)) {
            return response([
                'success' => false,
                'message' => 'wrong referral code, or this code have been used',
            ], 400);
        }

        $personData = Persons::find($referralData->submited_pid);

        return response([
            'success' => true,
            'person' => $personData,
        ], 200);
    }

    public function InvalidateUsedReferralCode(Request $request) {
        $validator = Validator::make($request->all(), [
            'referral_code'   => 'required|exists:referral_log,referral_code',
        ]);
        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => $validator->messages(),
            ], 400);
        }

        // get user data from authorization
        $jwtToken = explode(' ', $request->header('Authorization'))[1];
        $userData = Auth::payload($jwtToken)->toArray();

        // get referral data by referral code
        $referralData = ReferralLog::where('referral_code', $request->referral_code)
                                ->where('sent_to_email', $userData["user"]["email"])->first();
        if ($referralData == null) {
            return response([
                'success' => false,
                'message' => 'something went wrong',
            ], 400);
        }

        // assign user to person data
        $personData = Persons::find($referralData->submited_pid);
        $personData->user_id = $userData["user"]["id"];

        // update referral code as used code
        $referralData->is_used = true;

        // store and update data using transaction
        DB::beginTransaction();
        try {
            $personData->save();
            $referralData->save();

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
}
