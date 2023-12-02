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

function Dashboard({ auth, data }: any) {
    const tableRef = useRef();
    const [cari, setCari] = useState("");
    const [query, setQuery] = useState([]);
    const inputHandler = (event: { target: { value: any } }) => {
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
            const el = element as HTMLElement;
            el.style.display = "none";
        });

        window.addEventListener("afterprint", () => {
            noCetak.forEach((element) => {
                const el = element as HTMLElement;
                el.style.display = "block";
            });
        });
        window.print();
    };
    useEffect(() => {}, [setQuery, auth, query, data]);
    console.log(data.links);
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
                            <div className="overflow-x-auto">
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
                                            Status
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
                                    {data.data.map((item: any, index:any) => {
                                        const originalDate = item.created_at;
                                        const dateAndTime =
                                            originalDate.split("T"); // Memisahkan tanggal dan waktu berdasarkan spasi
                                        const formattedDate = format(
                                            new Date(dateAndTime[0]),
                                            "dd/MM/yyyy"
                                        );

                                        const formattedTime =
                                            dateAndTime[1].replace(
                                                /\.\d+Z/,
                                                ""
                                            );

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border "
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2 ">
                                                    {index+1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2">
                                                    {item.suhu}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap border-r-2">
                                                    {item.debu}
                                                </td>
                                                <td className="pl-3 py-4 whitespace-nowrap border-r-2">
                                                    <span
                                                        className={`py-2 px-4   rounded-lg text-white ${
                                                            item.suhu >= 25 &&
                                                            item.suhu <= 30 &&
                                                            item.debu >= 25 &&
                                                            item.debu <= 30
                                                                ? "bg-slate-400"
                                                                : (item.suhu <=
                                                                      25 ||
                                                                      item.suhu >=
                                                                          30) &&
                                                                  item.debu >=
                                                                      25 &&
                                                                  item.debu <=
                                                                      30
                                                                ? "bg-red-500"
                                                                : item.suhu >=
                                                                      25 &&
                                                                  item.suhu <=
                                                                      30 &&
                                                                  (item.debu <=
                                                                      25 ||
                                                                      item.debu >=
                                                                          30)
                                                                ? "bg-blue-500"
                                                                : "bg-slate-600"
                                                        }`}
                                                    >
                                                        {item.suhu >= 25 &&
                                                        item.suhu <= 30 &&
                                                        item.debu >= 25 &&
                                                        item.debu <= 30
                                                            ? "Normal"
                                                            : (item.suhu <=
                                                                  25 ||
                                                                  item.suhu >=
                                                                      30) &&
                                                              item.debu >= 25 &&
                                                              item.debu <= 30
                                                            ? "Suhu Danger"
                                                            : item.suhu >= 25 &&
                                                              item.suhu <= 30 &&
                                                              (item.debu <=
                                                                  25 ||
                                                                  item.debu >=
                                                                      30)
                                                            ? "Debu Danger"
                                                            : "Tidak Normal"}
                                                    </span>
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
                           
                            <div className="pagination mt-5 noCetak">
                                {data.links.map((link: any, index: any) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 mx-1 border rounded ${
                                            link.active
                                                ? "bg-blue-500 text-white"
                                                : "bg-white text-blue-500"
                                        }`}
                                    >
                                        {link.label === "Next &raquo;"
                                            ? "Next"
                                            : link.label === "&laquo; Previous"
                                            ? "Next"
                                            : link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard;
