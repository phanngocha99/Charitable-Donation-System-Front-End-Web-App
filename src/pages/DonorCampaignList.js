import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from "react-router-dom";

export default function CharityCampaign() {
    console.log("---> CharityCampaign rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/campaigns`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((response) => {
                console.log("Load campaign Success", response);
                setData(response);
            })
            .catch((error) => {
                console.error('Load campaign Failed:', error);
                setError('Failed to load data. Please try again later.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!Array.isArray(data) || data.length === 0) return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-red-700 p-8">
                Chọn Chiến Dịch muốn Đóng Góp  <i class="text-red-600 bx bxs-donate-heart"></i>
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-8">
                - Hiện không có chiến dịch nào
            </div >
        </div>
    )

    const statusStyles = {
        pending: {
            label: "Đang chờ",
            color: "text-yellow-500",
        },
        active: {
            label: "Đang hoạt động",
            color: "text-blue-500",
        },
        completed: {
            label: "Hoàn thành",
            color: "text-green-500",
        },
        cancelled: {
            label: "Đã hủy",
            color: "text-red-500",
        },
    };



    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-red-700 p-8">
                Chọn Chiến Dịch muốn Đóng Góp <i class="text-red-600 bx bxs-donate-heart"></i>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 p-4">
                {data.map((item) => (
                    <Link to={`/auth/DonorCampaignDetail/${item.id}`}
                        key={item.id}
                        className="cursor-pointer relative group mb-8 max-w-full p-6  border  rounded-lg shadow  bg-gray-800 border-gray-700 hover:shadow-red-500"
                    >
                        {/* Title Section */}
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold  text-white">
                                {item.title}
                            </h2>
                            <p className="text-sm font-medium  text-gray-400">
                                {new Date(item.startDate).toLocaleDateString()} -{" "}
                                {new Date(item.endDate).toLocaleDateString()}
                            </p>
                        </div>


                        {/* Footer Section */}
                        <div className="mt-4 pt-4 border-t  border-gray-600">
                            <p className="text-lg font-semibold  text-white">
                                Mục tiêu: {parseFloat(item.goalAmount).toLocaleString()} VNĐ
                            </p>
                            <p
                                className={`text-sm font-medium ${statusStyles[item.status]?.color || "text-gray-500"}`}
                            >
                                Trạng thái: {statusStyles[item.status]?.label || "Không xác định"}
                            </p>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg  "></div>
                    </Link>
                ))}
            </div>

        </div >
    );
}