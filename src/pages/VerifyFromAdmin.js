import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from "react-router-dom";

export default function VerifyFromAdmin() {
    console.log("---> VerifyFromAdmin rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialMount = useRef(true);
    const [loadingState, setLoadingState] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5000/getOrgNotApproval`, {
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
                console.log("Load getOrgNotApproval Success", response);
                setData(Object.entries(response));
            })
            .catch((error) => {
                console.error('Load getOrgNotApproval Failed:', error);
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
    if (!Array.isArray(data) || data[2][1].length === 0) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-8">Phê duyệt tổ chức từ thiện - No data available</div >;

    function HandleApprove(e, item) {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to approve ${item.organizationName} organization?`) && loadingState[item.id] !== true) {
            console.log("Approve", item.id);
            fetch(`http://localhost:5000/verify/${item.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${context.isLog.isLog}`
                },
            })
                .then((response) => {
                    console.log("Approve Success", response);
                    setLoadingState(prevState => ({ ...prevState, [item.id]: true }));
                })
                .catch((error) => {
                    console.error('Approve Failed:', error);
                    alert('Approve Failed:', error);
                    setLoadingState(prevState => ({ ...prevState, [item.id]: false }));
                })
        } else {
            return;
        }
    }

    // Merge the arrays based on userPhone/phoneNumber
    const mergedData = data[2][1].map(org => {
        const user = data[1][1].find(user => user.phoneNumber === org.userPhone);
        return {
            ...org,
            ...user,
            id: org.id,
        };
    });
    console.log(mergedData);

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-orange-700 p-8">
                Phê duyệt Tổ chức từ thiện <i class='text-orange-600 bx bx-check-shield'></i>
            </h1>
            <div className="p-8">
                {
                    mergedData.map((item, index) => (
                        <div key={index} className="mb-8 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div>
                                <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Tổ chức từ thiện: {item.organizationName}
                                </div>
                            </div>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Số định danh: <span className='text-orange-400'>{item.licenseDocument} </span>
                            </p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Họ và tên người đại diện: <span className='text-orange-400'>{item.lastName} {item.firstName}</span>
                            </p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Số điện thoại người đại diện: <span className='text-orange-400'>{item.phoneNumber}</span>
                            </p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Email người đại diện: <span className='text-orange-400'>{item.email}</span>
                            </p>
                            <div onClick={(e) => !loadingState[item.id] && HandleApprove(e, item)}>
                                {loadingState[item.id] ? (
                                    <span className="disabled inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                                        Đã được xác minh</span>
                                ) : (
                                    <span className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                        Xác minh</span>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}