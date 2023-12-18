<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminPersonController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
});


Route::get('/family/persons/{pid}', [PersonsController::class, 'FetchFamilyByPersonId'])->name('family_list');
Route::get('/person/detail/{pid}', [PersonsController::class, 'getDetailPersonByPID'])->name('detail_person');

Route::post('/person/search', [AuthController::class, 'CheckPersonLogName'])->name('search_person');


// AdminPerson
Route::get('/admin/person', [SuperAdminPersonController::class, 'FetchAllPersonData'])->name('admin_fetch_person');
Route::get('/admin/person/{pid}', [SuperAdminPersonController::class, 'GetPersonDetail'])->name('admin_fetch_detail_person');
Route::get('/admin/headfamily', [SuperAdminPersonController::class, 'FetchAllHeadFamilyData'])->name('admin_fetch_headfamily');
Route::post('/admin/person', [SuperAdminPersonController::class, 'AddNewPerson'])->name('admin_add_person');
Route::post('/admin/person/delete', [SuperAdminPersonController::class, 'DeletePerson'])->name('admin_delete_person');
Route::post('/admin/person/update/{pid}', [SuperAdminPersonController::class, 'UpdatePerson'])->name('admin_update_person');