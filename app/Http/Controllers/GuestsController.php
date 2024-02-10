<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\GuestAccess;

class GuestsController extends Controller
{
    public function GuestFetchFamily(Request $request, $guestCode) {
        $guestLogData = GuestAccess::where('guest_access_code', $guestCode)->first();
        if ($guestLogData == null) {
            Log::channel('guest_access')->info('GuestFetchFamily | code '.$guestCode.' not found');
            return response([
                'success' => false,
                'message' => 'data not found',
            ], 404);
        }
        $guestLogData->counter_used = $guestLogData->counter_used + 1;
        $guestLogData->save();

        $guestCodeParse = substr($guestCode, 0, -4) . '****';
        $logData = [
            'GuestCode' => $guestCodeParse,
            'Counter' => $guestLogData->counter_used,
            'ipAddress' => $request->ip(),
        ];

        Log::channel('guest_access')->info('GuestFetchFamily', $logData);

        return app(PersonsController::class)->FetchFamilyByPersonId($guestLogData->focus_pid);
    }
}
