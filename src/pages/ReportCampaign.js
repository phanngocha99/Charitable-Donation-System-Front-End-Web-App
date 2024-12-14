// Import Hook
import React from "react";
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
    const [campaign, setCampaign] = useState();

    const navigate = useNavigate();
    async function HandleSubmit(event) {
        // event.preventDefault();
        // // Data of User
        // try {
        //     const response = await fetch(`http://localhost:5000/feedbacks/create`, {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': "application/json",
        //             'Authorization': `Bearer ${context.isLog.isLog}` // Ensure this value is valid
        //         },
        //         body: JSON.stringify({
        //             campaignId: id,
        //             content: feedback,
        //             rating: rate,
        //         })
        //     });

        //     const data = await response.json();

        //     if (response.status === 201) {
        //         console.log('feedback Created:', data);
        //         navigate("/auth/DonorCampaignList");
        //     } else {
        //         console.error('feedback Created Fail:', data.message);
        //     }
        // } catch (err) {
        //     console.error('feedback Created - Error:', err.message);
        // }
    };

    useEffect(() => {
        // Function to fetch data
        console.log('campaignId', campaignId);
        console.log('charityOrgId', charityOrgId);

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
                const response = await fetch(`http://localhost:5000/campaigns`, {
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

        fetchDataDonation();
        fetchDataExpense();
        fetchDataCampaign();

    }, []); // Empty dependency array ensures it runs only once


    return (
        <div className="bg-gray-900">
            <div>
                <label htmlFor="Campaign" className="pt-2 block mb-1 text-sm  text-white">
                    Chọn Campaign để xem chi tiết báo cáo:
                </label>
                <select
                    required
                    value={campaign}
                    onChange={(e) => {
                        setCampaign(e.target.value);
                    }}
                    id="locationDonate"
                    className="block w-full px-4 pb-2 mt-1 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    aria-label="Chọn khu vực để đóng góp"
                >
                    <option value="">
                        --Chọn--
                    </option>
                    {dataCampaign?.map((campaign, index) => (
                        <option key={index} value={campaign.id}>
                            {campaign.title}
                        </option>
                    ))}
                </select>
            </div>
            <Outlet context={context} />
        </div >
    );
}

