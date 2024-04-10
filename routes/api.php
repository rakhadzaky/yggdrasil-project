<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminPersonController;
use App\Http\Controllers\FamiliesController;
use App\Http\Controllers\ReferralController;
use App\Http\Controllers\GuestsController;
use App\Http\Controllers\ImageController;

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
Route::get('/person/photos/list/{pid}', [PersonsController::class, 'FetchPersonPhotos'])->name('person_photos_list');
Route::post('/admin/new/family-person', [PersonsController::class, 'AddNewFamilyAndPerson'])->name('admin_new_family_person');

Route::post('/person/search', [AuthController::class, 'CheckPersonLogName'])->name('search_person');

// AdminPerson
Route::get('/admin/person', [SuperAdminPersonController::class, 'FetchAllPersonData'])->name('admin_fetch_person');
Route::get('/admin/person/{pid}', [SuperAdminPersonController::class, 'GetPersonDetail'])->name('admin_fetch_detail_person');
Route::get('/admin/headfamily', [SuperAdminPersonController::class, 'FetchAllHeadFamilyData'])->name('admin_fetch_headfamily');
Route::post('/admin/person', [SuperAdminPersonController::class, 'AddNewPerson'])->name('admin_add_person');
Route::post('/admin/person/delete', [SuperAdminPersonController::class, 'DeletePerson'])->name('admin_delete_person');
Route::post('/admin/person/update/{pid}', [SuperAdminPersonController::class, 'UpdatePerson'])->name('admin_update_person');
Route::get('/admin/family/list/{pid}', [SuperAdminPersonController::class, 'GetFamilyList'])->name('admin_get_family_list');
Route::post('/admin/person/relation/add', [SuperAdminPersonController::class, 'AssignPersonRelation'])->name('admin_assign_person_relation');
Route::post('/admin/person/photos/add', [SuperAdminPersonController::class, 'AddNewPersonPhotos'])->name('admin_add_person_photos');
Route::post('/admin/person/photos/set-main', [SuperAdminPersonController::class, 'SetMainPersonPhoto'])->name('admin_set_main_person_photos');

// AdminFamilyController
Route::post('/admin/family/create', [FamiliesController::class, "CreateFamily"])->name('admin_create_family');
Route::post('/admin/family/assign', [FamiliesController::class, "AssignFamily"])->name('admin_assign_family');
Route::get('/admin/family/members/{fid}', [FamiliesController::class, "FetchAllFamilyMember"])->name('admin_fetch_family_member');
Route::get('/admin/family', [FamiliesController::class, "FetchAllFamily"])->name('admin_fetch_family_list');

// Galleries
Route::get('/gallery/list/{fid}', [FamiliesController::class, "FetchFamilyGalleries"])->name('fetch_gallery_by_family_id');
Route::get('/gallery/detail/{gid}', [FamiliesController::class, "FetchFamilyGalleryDetail"])->name('fetch_gallery_detail');
Route::post('/gallery/store', [FamiliesController::class, "CreateNewGallery"])->name('create_gallery');
Route::post('gallery/update/{gid}', [FamiliesController::class, "UpdateGallery"])->name('update_gallery');
Route::post('gallery/photos/add', [FamiliesController::class, "AddNewPhotosToGallery"])->name('add_photo_to_gallery');

// ReferralController
Route::post('/admin/referral/create', [ReferralController::class, "CreateReferral"])->name('admin_create_referral');
Route::get('/admin/referral/search/{referral_code}', [ReferralController::class, "SearchReferralCode"])->name('admin_search_referral');
Route::post('/admin/referral/invalidate', [ReferralController::class, "InvalidateUsedReferralCode"])->name('admin_invalidate_referral');

// GuestAccessController
Route::get('guest/family/person/{guest_code}', [GuestsController::class, "GuestFetchFamily"])->name('guest_family_list');
Route::post('guest/check', [GuestsController::class, "CheckGuestCode"])->name('guest_check_code');

// PhotoController
Route::post('/photo/upload', [ImageController::class, "UploadPhotoToStore"])->name('upload_photo');