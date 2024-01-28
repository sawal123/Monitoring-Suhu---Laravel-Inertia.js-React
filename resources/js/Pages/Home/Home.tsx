import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Home({ title, suhu, debu, user,  date }: any) {
    // const {user} = props;
    const mystyle = {
        width: "300px",
    };

    const [data, setData] = useState([suhu, debu]);
    const fetchData = async () => {
        try {
            const response = await axios.get("/sse");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    // Panggil fungsi berlangganan saat komponen dimu
    useEffect(() => {
        fetchData(); // Memuat data saat komponen pertama kali dimuat
        const interval = setInterval(() => {
            fetchData(); // Memuat data secara berkala setiap 1000 ms (1 detik)
        }, 1000);
        return () => {
            clearInterval(interval); // Membersihkan interval saat komponen dibongkar
        };
    }, []);
    // console.log(user.name);
    return (
        <div className="p-2">
            <Head title={title} />
            <div className="container mx-auto my-10 mb-10 text-center rounded-lg border p-4">
                <div className="mb-5">
                    <h1 className="text-4xl font-bold">
                        Monitoring Suhu & Debu Ruangan {user ? (user.name):('')}
                    </h1>
                    <div className="text-xl font-bold mt-2">
                        {date}
                    </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                    <div
                        className={`p-10 text-center hover:shadow-lg transition-shadow  border rounded-md ${data[0].suhu >= 25 && data[0].suhu <=30 ? "Normal" : "bg-red-600 text-white"} `}
                        style={mystyle}
                    >
                        Suhu {data[0].suhu >= 25 && data[0].suhu <=30 ? "Normal" : "Tidak Normal"}
                        <p className="text-3xl font-bold">{data[0].suhu}</p>
                        
                    </div>
                    <div
                        className={`p-10 text-center hover:shadow-lg transition-shadow border rounded-md ${data[0].debu >= 0.0 && data[0].debu <=0.10 ? "Normal" : "bg-red-600 text-white"} `}
                        style={mystyle}
                    >
                        Debu {data[0].debu >= 0.0 && data[0].debu <= 0.10 ? "Normal" : "Tidak Normal"}
                        <p className="text-3xl font-bold">{data[0].debu}</p>
                    </div>
                </div>
                <div className="grid my-16 text-center">
                    <h1>Login untuk melihat rekap data</h1>
                    <div className="flex justify-center">
                        {user ? (
                            <Link
                                href={"/dashboard"}
                                className="w-40 py-3 font-bold text-center text-white bg-blue-500 hover:bg-blue-700 transition-colors rounded-lg px5"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={"/login"}
                                className="w-40 py-3 font-bold text-center text-white bg-blue-500 hover:bg-blue-700 transition-colors rounded-lg px5"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
