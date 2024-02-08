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
        date_default_timezone_set("Asia/Bangkok");
        $title = "Monitoring";
        $suhu = Suhu::all();
        // dd(date('Y-m-d'));
        $suhuAkhir = Suhu::orderBy("id", "desc")->first();
        $debuAkhir = Debu::orderBy("id", "desc")->first();
        // dd($suhuAkhir);
        return Inertia::render('Home/Home', [
            'title' => $title,
            'kelembaban' => $suhuAkhir,
            'debu' => $debuAkhir,
            'user' => Auth::user(),
            'date' => date('Y-m-d')
        ]);
    }
    public function dashboard($date = null){
        // dd($date);
        date_default_timezone_set("Asia/Bangkok");
        $date = $date === null ? date("Y-m-d") : $date;
        // $date = $date === null ? date("Y-m-d") : $date;
       
        // dd($date);
        $data = Suhu::join('debus', 'debus.id', '=', 'suhus.id')
        ->select('suhus.id', 'suhus.kelembaban', 'debus.debu', 'debus.created_at')
        ->whereDate('suhus.created_at', $date)
        ->paginate(10);
        // dd($data);
        
        return inertia('Dashboard',[
            'title'=> 'Dashboard',
            'datas' => $data,
            'date'=>$date
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

    public function addData($suhu = null,$kelembaban=null, $debu=null){
        if($suhu != null && $debu != null){
            $saveSuhu = new Suhu([
                'suhu' => $suhu,
                'kelembaban' => $kelembaban
            ]);
            $saveDebu =new Debu([
                'debu'=>$debu
            ]);

            $saveSuhu->save();
            $saveDebu->save();

            return '1';
        }
        else{
            return 'Data Gagal Ditambah';
        }
    }
}
