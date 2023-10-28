<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminPersonController;

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
Route::get('/admin/person', [AdminPersonController::class, 'FetchAllPersonData'])->name('admin_fetch_person');
Route::post('/admin/person', [AdminPersonController::class, 'AddNewPerson'])->name('admin_add_person');
Route::post('/admin/person/delete', [AdminPersonController::class, 'DeletePerson'])->name('admin.delete_person');
Route::post('/admin/person/update/{pid}', [AdminPersonController::class, 'UpdatePerson'])->name('admin.update_person');