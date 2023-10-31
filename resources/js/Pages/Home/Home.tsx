import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Home({ title, suhu, debu, user }: any) {
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
    // Panggil fungsi berlangganan saat komponen dimuat
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
        <div>
            <Head title={title} />
            <div className="container mx-auto">
                <div className="my-10 mb-10 text-center ">
                    <h1 className="text-4xl font-bold">
                        Monitoring Suhu & Debu Ruangan {user ? (user.name):('')}
                    </h1>
                </div>
                <div className="grid grid-cols-1 text-center lg:flex lg:justify-evenly lg:grid-cols-2 ">
                    <div
                        className="p-10 m-5 mx-auto text-center border rounded-md"
                        style={mystyle}
                    >
                        Suhu
                        <p className="text-3xl font-bold">{data[0].suhu}</p>
                    </div>
                    <div
                        className="p-10 m-5 mx-auto text-center border rounded-md"
                        style={mystyle}
                    >
                        Debu
                        <p className="text-3xl font-bold">{data[0].debu}</p>
                    </div>
                </div>
                <div className="grid my-16 text-center">
                    <h1>Login untuk melihat data lebih detail</h1>
                    <div className="flex justify-center">
                        {user ? (
                            <Link
                                href={"/dashboard"}
                                className="w-40 py-3 font-bold text-center text-white bg-blue-700 rounded-lg px5"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={"/login"}
                                className="w-40 py-3 font-bold text-center text-white bg-blue-700 rounded-lg px5"
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
