<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SSEController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [Controller::class, 'home']);
Route::get('/sse', [SSEController::class,'stream'])->name('stream');

Route::get('/addData/{suhu}/{kelembaban}/{debu}', [Controller::class, 'addData']);

Route::middleware('auth')->group(function () {
    Route::get('/dashboard/{date?}', [Controller::class, 'Dashboard'] )->name('dashboard');
    // Route::get('/dashboard/{date?}', [Controller::class, 'Dashboard'] )->middleware(['auth', 'verified'])->name('dashboard');
    Route::get('/search',[Controller::class, 'search'])->name('search');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
});

require __DIR__.'/auth.php';
