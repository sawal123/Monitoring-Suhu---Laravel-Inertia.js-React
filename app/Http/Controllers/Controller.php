<?php

namespace App\Http\Controllers;

use App\Models\Debu;
use App\Models\Suhu;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request as HttpRequest;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function home()
    {
        $title = "Monitoring";
        $suhu = Suhu::all();
        $suhuAkhir = Suhu::orderBy("id", "desc")->first();
        $debuAkhir = Debu::orderBy("id", "desc")->first();
        return Inertia::render('Home/Home', [
            'title' => $title,
            'suhu' => $suhuAkhir,
            'debu' => $debuAkhir,
            'user' => Auth::user()
        ]);
    }
    public function dashboard(){
        
        $suhu = Suhu::all();
        $data = Suhu::join('debus', 'debus.id', '=', 'suhus.id')
        ->select('suhus.id', 'suhus.suhu', 'debus.debu', 'debus.created_at')
        ->get();
        
        // dd($data);
        return Inertia::render('Dashboard',[
            'title'=> 'Dashboard',
            'data' => $data
        ]);
    }

    public function search(HttpRequest $request){
        $query = $request->input('query');
        $results = Suhu::where('suhu', 'LIKE', '%' . $query . '%')->get();

        return Inertia::render('SearchResults', [
            'results' => $results,
            'query' => $query,
        ]);
    }
}
