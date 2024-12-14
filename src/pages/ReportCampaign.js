// Import Hook
import React from "react";
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";


export default function ReportCampaign() {
    const { campaignId, charityOrgId } = useParams();
    console.log("---> ReportCampaign rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const [dataDonate, setDataDonate] = useState();
    const [dataExpense, setDataExpense] = useState();
    const [dataCampaign, setDataCampaign] = useState();


    const fetchDataDonation = async () => {
        try {
            const response = await fetch(`http://localhost:5000/reports/donations?campaign_id=${campaignId}&charity_org_id${charityOrgId}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${context.isLog.isLog}` // Ensure this value is valid
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('fetchDataDonation GETTED:', data);
                setDataDonate(data);
            } else {
                console.error('fetchDataDonation GETTED Fail:', data.message);
            }
        } catch (err) {
            console.error('fetchDataDonation Get Fail - Error:', err.message);
        }
    };

    const fetchDataExpense = async () => {
        try {
            const response = await fetch(`http://localhost:5000/reports/expenses?campaign_id=${campaignId}&charity_org_id${charityOrgId}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${context.isLog.isLog}` // Ensure this value is valid
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('fetchDataExpense GETTED:', data);
                setDataExpense(data);
            } else {
                console.error('fetchDataExpense GETTED Fail:', data.message);
            }
        } catch (err) {
            console.error('fetchDataExpense Get Fail - Error:', err.message);
        }
    };

    const fetchDataCampaign = async () => {
        try {
            const response = await fetch(`http://localhost:5000/campaigns/${campaignId}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    },
                });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('fetchDataCampaign GETTED:', data);
            setDataCampaign(data);
        } catch (err) {
            console.error('Load campaign Failed:', err);
        }
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchDataDonation();
                await fetchDataExpense();
                await fetchDataCampaign();
            } catch (err) {
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <h1 className="bg-white text-2xl font-bold tracking-tight text-blue-800 p-4">
                Báo cáo thu chi <i class='text-blue-600 bx bx-universal-access' ></i>
            </h1>
            <h1 className="bg-white text-2xl font-bold tracking-tight text-black-800 p-4">
                Danh sách đóng góp của {dataCampaign.title}
            </h1>
            <div class="bg-white p-4 relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>

                            <th scope="col" class="px-6 py-3">
                                Người đóng góp
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Số điện thoại
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Số tiền đóng góp
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Phương thức đóng góp
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Ngày đóng góp
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataDonate?.map((donate, index) => (
                            <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {donate.User.lastName} {donate.User.firstName}
                                </th>
                                <td class="px-6 py-4">
                                    {donate.User.phoneNumber}
                                </td>
                                <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {parseFloat(donate.amount).toLocaleString()} VNĐ
                                </th>
                                <td class="px-6 py-4">
                                    {donate.status == "completed" ? "Giao dịch đã hoàn tất" :
                                        donate.status == "failed" ? "Giao dịch chưa hoàn tất" : "Đang giao dịch"}
                                </td>
                                <td class="px-6 py-4">
                                    {new Date(donate.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <h1 className="bg-white text-2xl font-bold tracking-tight text-black-800 p-4">
                Danh sách chi tiêu
            </h1>
            <div class="p-4 relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Nội dung chi tiêu
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Số tiền đã chi
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Ngày chi tiêu
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataExpense?.map((expenses, index) => (
                            <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td class="px-6 py-4">
                                    {expenses.description}
                                </td>
                                <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {parseFloat(expenses.amount).toLocaleString()} VNĐ
                                </th>
                                <td class="px-6 py-4">
                                    {new Date(expenses.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <h1 className="bg-white text-2xl font-bold tracking-tight text-black-800 p-4">
                Tổng quan thu chi
            </h1>
            <div class="p-4 relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Nội dung
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Tổng số tiền
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4">
                                Tổng số tiền đã nhận (Giao dịch hoàn tất)
                            </td>
                            <th class="px-6 py-4 font-medium text-green-600 whitespace-nowrap">
                                {parseFloat(dataCampaign?.currentAmount).toLocaleString()} VNĐ
                            </th>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4">
                                Tổng số tiền đã chi
                            </td>
                            <th class="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">
                                {parseFloat(dataCampaign?.distributedAmount).toLocaleString()} VNĐ
                            </th>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4">
                                Tổng số tiền kêu gọi
                            </td>
                            <th class="px-6 py-4 font-medium text-orange-600 whitespace-now">
                                {parseFloat(dataCampaign?.goalAmount).toLocaleString()} VNĐ
                            </th>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4">
                                Tổng số tiền cần kêu gọi thêm
                            </td>
                            <th class="px-6 py-4 font-medium text-white whitespace-now">
                                {parseFloat(dataCampaign?.goalAmount - dataCampaign?.currentAmount).toLocaleString()} VNĐ
                            </th>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4">
                                Tổng số tiền còn lại thực tế
                            </td>
                            <th class="px-6 py-4 font-medium text-white whitespace-now">
                                {parseFloat(dataCampaign?.currentAmount - dataCampaign?.distributedAmount).toLocaleString()} VNĐ
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Outlet context={context} />
        </div >
    );
}

