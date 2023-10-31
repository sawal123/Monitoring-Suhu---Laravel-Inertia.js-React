import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import * as XLSX from "xlsx";

import "datatables.net";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { utcToZonedTime, format as formatTz } from "date-fns-tz";
import moment from "moment";
import { Inertia } from "@inertiajs/inertia";
import Button from "datatables.net-buttons-bs5";
import DateTime from "datatables.net-datetime";
import Respon from "datatables.net-responsive-bs5";
import formatDistance from "date-fns/formatDistance";

function Dashboard({ auth, data }:any) {
    const tableRef = useRef();
    const [cari, setCari] = useState("");
    const [query, setQuery] = useState([]);
    const inputHandler = (event: { target: { value: any; }; }) => {
        const target = event.target.value;
        setCari(target);
    };
    const { searchResults } = usePage().props;

    const handleDownload = () => {
        const table = document.getElementById("example");
        const ws = XLSX.utils.table_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "table-data.xlsx");
    };
    const handlePrint = () => {
        const noCetak = document.querySelectorAll(".noCetak");

        noCetak.forEach((element) => {
            const el = element as HTMLElement ;
            // console.log(el);
            el.style.display = "none";
        });

        window.addEventListener("afterprint", () => {
            // Jika pencetakan dimulai, tampilkan kembali elemen-elemen setelah pencetakan selesai
            noCetak.forEach((element) => {
                const el = element as HTMLElement ;
                el.style.display = "block";
            });
        });
        window.print();
    };
    useEffect(() => {}, [setQuery, auth, query, data]);
    // console.log(cari);
    // console.log(data);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className=" text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12 ">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            <div className="lg:flex justify-between align-align-items-center mb-5">
                                <input
                                    type="text"
                                    placeholder="Cari.."
                                    className="rounded-lg mb-2 noCetak"
                                    name="query"
                                    value={cari}
                                    onChange={inputHandler}
                                />
                                <div className="flex h-10">
                                    <button
                                        onClick={handlePrint}
                                        className="bg-blue-500 hover:bg-blue-700 transition-colors text-white mr-2   px-4 rounded-lg py-0 noCetak"
                                    >
                                        Print
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="bg-gray-400 hover:bg-gray-700 transition-colors text-white  px-4 rounded-lg py-0 noCetak"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                            <table
                                id="example"
                                className=" border-collapse w-full min-w-full divide-y divide-gray-200 table table-striped"
                            >
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Suhu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Debu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item:any) => {
                                        const originalDate = item.created_at;
                                        const dateAndTime =
                                            originalDate.split("T"); // Memisahkan tanggal dan waktu berdasarkan spasi
                                        const formattedDate = format(
                                            new Date(dateAndTime[0]),
                                            "dd/MM/yyyy"
                                        );
                                     
                                        const formattedTime = dateAndTime[1].replace(/\.\d+Z/, '');;
                                      

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border "
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2 ">
                                                    {item.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2">
                                                    {item.suhu}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2">
                                                    {item.debu}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2">
                                                    {formattedDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formattedTime}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard;
