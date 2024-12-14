import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function VerifyDonateFromAdmin() {
    const navigate = useNavigate();
    console.log("---> VerifyDonateFromAdmin rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialMount = useRef(true);
    const [loadingState, setLoadingState] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5000/donations`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${context.isLog.isLog}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((response) => {
                console.log("Load getDonationNotApproval Success", response);
                setData(response);
            })
            .catch((error) => {
                console.error('Load getDonationNotApproval Failed:', error);
                setError('Failed to load data. Please try again later.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            console.log("Data has changed:", data);
        }
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!Array.isArray(data) || data.length === 0) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-8">Phê duyệt đóng góp từ thiện - Hiện không có đóng góp nào</div >;

    function HandleApprove(e, item) {
        e.preventDefault();
        if (window.confirm(`Bạn chắc chắn xác nhận?`) && loadingState[item.id] !== true) {
            console.log("Approve", item.id);
            fetch(`http://localhost:5000/donations/update-status`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${context.isLog.isLog}`
                },
                body: JSON.stringify({ donationId: item.id, status: "completed" })
            })
                .then((response) => {
                    console.log("Approve Success", response);
                    setLoadingState(prevState => ({ ...prevState, [item.id]: true, status: "completed" }));
                    console.log('loadingState', loadingState);
                    navigate('/auth/homepage');
                })
                .catch((error) => {
                    console.error('Approve Failed:', error);
                    alert('Approve Failed:', error);
                    setLoadingState(prevState => ({ ...prevState, [item.id]: false, status: "pending" }));
                    console.log('loadingState', loadingState);
                })
        } else {
            return;
        }
    }

    function HandleReject(e, item) {
        e.preventDefault();
        if (window.confirm(`Bạn chắc chắn xác nhận?`) && loadingState[item.id] !== true) {
            console.log("Reject", item.id);
            fetch(`http://localhost:5000/donations/update-status`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${context.isLog.isLog}`
                },
                body: JSON.stringify({ donationId: item.id, status: "failed" })
            })
                .then((response) => {
                    console.log("Reject Success", response);
                    setLoadingState(prevState => ({ ...prevState, [item.id]: true, status: "failed" }));
                    console.log('loadingState', loadingState);
                    navigate('/auth/homepage');
                })
                .catch((error) => {
                    console.error('Reject Failed:', error);
                    alert('Reject Failed:', error);
                    setLoadingState(prevState => ({ ...prevState, [item.id]: false, status: "pending" }));
                    console.log('loadingState', loadingState);
                })
        } else {
            return;
        }
    }


    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-orange-700 p-8">
                Phê duyệt Đóng góp từ thiện <i class='text-orange-600 bx bx-check-shield'></i>
            </h1>
            <div className="p-8">
                {
                    data.map((item, index) => (
                        <div key={index} className="mb-8 max-w-full p-6  border  rounded-lg shadow bg-gray-800 border-gray-700">
                            <div>
                                <div className="mb-2 text-2xl font-bold tracking-tight  text-white">
                                    Đóng góp từ thiện - ID: {item.id}
                                </div>
                            </div>
                            <p className="mb-3 font-normal  text-gray-400">
                                Thuộc ID chiến dịch: <span className='text-orange-400'>{item.campaignId} </span>
                            </p>
                            <p className="mb-3 font-normal  text-gray-400">
                                Thuộc ID khu vực: <span className='text-orange-400'>{item.locationId} </span>
                            </p>
                            <p className="mb-3 font-normal text-gray-400">
                                Thuộc ID người đóng góp: <span className='text-orange-400'>{item.donorId} </span>
                            </p>
                            <p className="mb-3 font-normal text-gray-400">
                                Số tiền đóng góp: <span className='text-orange-400'>
                                    {parseFloat(item.amount).toLocaleString()} VNĐ
                                </span>
                            </p>
                            <p className="mb-3 font-normal text-gray-400">
                                Qua phương thức: <span className='text-orange-400'>
                                    {item.method == "bank" ?
                                        "Ngân hàng"
                                        : item.method = "cash"
                                            ? "Tiền Mặt"
                                            : "Ví điện tử"
                                    }
                                </span>
                            </p>

                            <div>
                                {item.status !== "pending"
                                    ?
                                    <div>
                                        {item.status === "completed" ?
                                            <span className="disabled inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                                                Đã nhận
                                            </span>
                                            : <span className="disabled inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
                                                Không nhận được</span>}

                                    </div>

                                    : (
                                        <div className='grid gap-2'>
                                            <span onClick={(e) => !loadingState[item.id] && HandleApprove(e, item)} className="w-40 cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                                Xác minh đã nhận</span>
                                            <span onClick={(e) => !loadingState[item.id] && HandleReject(e, item)} className="w-40 cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                                Xác minh không nhận được</span>
                                        </div>

                                    )}
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    );
}