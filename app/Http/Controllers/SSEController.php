<?php

namespace App\Http\Controllers;

use App\Events\NewContentNotication;
use App\Models\Debu;
use App\Models\Suhu;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Response;
use Pusher\Pusher;
use Symfony\Component\HttpFoundation\StreamedResponse;
use GuzzleHttp\Client;
use App\Http\Controllers\Controller as Control;


class SSEController extends Controller
{
    //
    public function stream(Request $request)
    {

        // event(new NewContentNotication("Latihan Pusher"));
        $suhuAkhir = Suhu::orderBy("id", "desc")->first();
        $debuAkhir = Debu::orderBy("id", "desc")->first();
        $suhu = $suhuAkhir->suhu;

        $data=[];

        $data[] = [
            "suhu"=> $suhu,
            "debu"=> $debuAkhir->debu
        ];

        return $data;
    }
}
