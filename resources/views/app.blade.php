<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Monitoring') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link href="https://cdn.datatables.net/1.13.6/css/dataTables.tailwindcss.min.css" rel="stylesheet" />
    

    <!-- Scripts -->

   

 
    <!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
    <!-- <script src="https://code.jquery.com/jquery-3.7.0.js"></script> -->
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->

     <!-- <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script> -->
    <!-- <script>
        Pusher.logToConsole = true;
        var pusher = new Pusher('aa93625dcc21015f5816', {
            cluster: 'ap1'
        });
        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function(data) {
           JSON.stringify(data);
        });
    </script> -->


    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.tailwindcss.min.js"></script>
</body>

</html>
