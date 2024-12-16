// Import Hook
import React from "react";
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { useParams } from "react-router-dom";


export default function DonorCampaignDetail() {
    const { id } = useParams();
    console.log("---> DonorCampaignDetail rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [distributedAmount, setDistributedAmount] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [state, setState] = useState('');
    const [feedback, setFeedback] = useState('');
    const [url, setUrl] = useState('');
    const [rate, setRate] = useState('');
    const [totalRating, setTotalRating] = useState('');
    const [feedbacks, setFeedbacks] = useState();
    const [idLocate, setIdLocate] = useState();
    const [locations, setLocations] = useState(
        [{
            name: '',
            latitude: '',
            longitude: '',
            damageLevel: '',
            needsHelp: true,
            ward: '',
            district: '',
            province: '',
            city: '',
            goalAmount: '',
        }]
    );
    const campaignInformation = { title, description, goalAmount, startDate, endDate, locations, currentAmount, distributedAmount };
    console.log('campaignInformation', campaignInformation);

    async function HandleSubmit(event) {
        event.preventDefault();
        // Data of User
        try {
            const response = await fetch(`http://localhost:5000/feedbacks/create`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${context.isLog.isLog}` // Ensure this value is valid
                },
                body: JSON.stringify({
                    campaignId: id,
                    content: feedback,
                    rating: rate,
                })
            });

            const data = await response.json();

            if (response.status === 201) {
                console.log('feedback Created:', data);
                navigate("/auth/DonorCampaignList");
            } else {
                console.error('feedback Created Fail:', data.message);
            }
        } catch (err) {
            console.error('feedback Created - Error:', err.message);
        }
    };
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


    useEffect(() => {
        // Function to fetch data
        console.log('id', id);

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/campaigns/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `Bearer ${context.isLog.isLog}` // Ensure this value is valid
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Campaign GETTED:', data);
                    setTitle(data.title);
                    setDescription(data.description);
                    setGoalAmount(data.goalAmount);
                    setStartDate(data.startDate);
                    setEndDate(data.endDate);
                    setDistributedAmount(data.distributedAmount);
                    setCurrentAmount(data.currentAmount);
                    setState(data.status);
                    setUrl(data.url);
                    // Validate and set locations
                    if (Array.isArray(data.Locations)) {
                        setLocations(data.Locations);
                    } else {
                        console.error("Invalid locations format:", data.Locations);
                        setLocations([]); // Fallback
                    }
                } else {
                    console.error('Campaign GETTED Fail:', data.message);
                }
            } catch (err) {
                console.error('Campaign Get Fail - Error:', err.message);
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const response = await fetch(`http://localhost:5000/feedbacks?campaignId=${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    },
                });

                const data = await response.json();

                if (response.status === 200) {
                    console.log('FEEDBACK GETTED:', data);
                    let sumRate = 0;
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            sumRate += data[i].rating;
                        }
                        setTotalRating((sumRate / data.length).toFixed(1) + "/5")
                    } else {
                        setTotalRating("Chưa có đánh giá nào")

                    }
                    setFeedbacks(data);
                } else {
                    console.error('FEEDBACK GETTED Fail:', data.message);
                }
            } catch (err) {
                console.error('FEEDBACK Get Fail - Error:', err.message);
            }
        };

        fetchData(); // Call the function when the component mounts
        fetchFeedbacks();

    }, []); // Empty dependency array ensures it runs only once


    return (
        <div>
            <div className="bg-gray-900">
                <div className="text-center">
                    <h2 className="p-10 text-2xl font-bold text-center  text-white"> {title} </h2>
                    <div className="pt-2 text-l text-white"> Ngày bắt đầu: <strong>{startDate}</strong> - Ngày kết thúc : <strong>{endDate}</strong></div>
                    <p
                        className={`text-l font-medium ${statusStyles[state]?.color || "text-gray-500"}`}
                    >
                        Trạng thái: {statusStyles[state]?.label || "Không xác định"}
                    </p>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <img
                        className="p-4 w-1/2 object-cover"
                        src={url}
                        alt="" />
                </div>

                <div className="flex-col justify-center text-justify p-4">
                    <p className="pl-4 pr-4 text-l  text-gray-400"> {description} </p>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
                    <div
                        className="cursor-pointer relative group mb-8 max-w-full p-6  border  rounded-lg shadow  bg-gray-800 border-yellow-700 hover:shadow-yellow-500"
                    >
                        <h2 className="text-2xl font-bold  text-white">
                            SỐ TIỀN KÊU GỌI
                        </h2>
                        <p className="text-3xl text-orange-500 ">
                            {parseFloat(goalAmount).toLocaleString()} VNĐ
                        </p>
                    </div>
                    <div
                        className="cursor-pointer relative group mb-8 max-w-full p-6  border rounded-lg shadow  bg-gray-800 border-green-700 hover:shadow-green-500"
                    >
                        <h2 className="text-2xl font-bold  text-white">
                            SỐ TIỀN HIỆN CÓ
                        </h2>
                        <p className="text-3xl text-green-500 ">
                            {parseFloat(currentAmount).toLocaleString()} VNĐ
                        </p>
                    </div>
                    <div
                        className="cursor-pointer relative group mb-8 max-w-full p-6  border rounded-lg shadow  bg-gray-800 border-blue-700 hover:shadow-blue-500"
                    >
                        <h2 className="text-2xl font-bold  text-white">
                            SỐ TIỀN CẦN THÊM
                        </h2>
                        <p className="text-3xl text-blue-500 ">
                            {parseFloat(goalAmount - currentAmount).toLocaleString()} VNĐ
                        </p>
                    </div>

                </div>
                <h2 className="p-4 text-xl font-bold  text-white">
                    Khu vực ảnh hưởng:</h2>

                {locations.map((location, index) => (
                    <div key={index} className="p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white-200 rounded-lg shadow  bg-gray-800 border-white-700 hover:shadow-white-500">
                            <div
                                className="relative group mb-8 max-w-full p-6 "
                            >
                                <p className=" text-gray-400"> Tỉnh: <span className="text-white font-bold">{location.province}</span></p>
                                <p className=" text-gray-400"> Thành phố: <span className="text-white font-bold">{location.city}</span></p>
                                <p className=" text-gray-400"> Quận: <span className="text-white font-bold">{location.district}</span></p>
                                <p className=" text-gray-400"> Phường: <span className="text-white font-bold">{location.ward}</span></p>
                                <p className=" text-gray-400"> MỨC THIỆT HẠI: <span className="text-orange-500 font-bold">{location.damageLevel}</span></p>
                            </div>
                            <div
                                className="relative group mb-8 mt-8 max-w-full p-6  border rounded-lg shadow  bg-gray-800 border-yellow-700 hover:shadow-yellow-500"
                            >
                                <h2 className="text-2xl font-bold  text-white">
                                    SỐ TIỀN KÊU GỌI
                                </h2>
                                <p className="text-3xl text-orange-500 ">
                                    {parseFloat(location.goalAmount).toLocaleString()} VNĐ
                                </p>
                            </div>
                            <div
                                className="relative group mb-8 mt-8 max-w-full p-6  border rounded-lg shadow  bg-gray-800 border-green-700 hover:shadow-green-500"
                            >
                                <h2 className="text-2xl font-bold  text-white">
                                    SỐ TIỀN HIỆN CÓ
                                </h2>
                                <p className="text-3xl text-green-500 ">
                                    {parseFloat(location.currentAmount).toLocaleString()} VNĐ
                                </p>
                            </div>
                            <div
                                className="relative group mb-8 mt-8 max-w-full p-6  border  rounded-lg shadow  bg-gray-800 border-blue-700 hover:shadow-blue-500"
                            >
                                <h2 className="text-2xl font-bold  text-white">
                                    SỐ TIỀN CẦN THÊM
                                </h2>
                                <p className="text-3xl text-blue-500 ">
                                    {parseFloat(Number(location.goalAmount) - Number(location.currentAmount)).toLocaleString()} VNĐ
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="m-6 p-5 bg-white border border-blue-200 rounded-l ">
                    <label htmlFor="locationDonate" className="pt-2 block mb-1 text-sm  text-black">
                        Chọn khu vực để đóng góp:
                    </label>
                    <select
                        required
                        value={idLocate}
                        onChange={(e) => {
                            setIdLocate(e.target.value);
                        }}
                        id="locationDonate"
                        className="block w-full px-4 pb-2 mt-1  border  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                        aria-label="Chọn khu vực để đóng góp"
                    >
                        <option value="">
                            --Chọn--
                        </option>
                        {locations.map((location, index) => (
                            <option key={index} value={location.id}>
                                {location.province}, {location.city}, {location.district}, {location.ward}
                            </option>
                        ))}
                    </select>
                    {idLocate !== "" && <Link to={`/auth/donorCampaign/create/${id}/${idLocate}`} className="block w-full mt-10 p-5 cursor-pointer text-4xl font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                        ĐÓNG GÓP</Link>}

                </div>


                <h2 className="p-4 text-xl font-bold  text-white">
                    Gửi Bình luận:</h2>
                <div className="p-4 text-l">
                    <form onSubmit={HandleSubmit}>
                        <label
                            htmlFor="feedback"
                            className="block mb-1 text-l  text-gray-400"
                        >
                            Bình luận của bạn:
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            name="feedback"
                            id="feedback"
                            required
                            className="block w-full px-4 pb-2 mt-2 border rounded-md focus:ring-blue-400"
                            placeholder="Điền bình luận của bạn"
                            rows={4}
                        />
                        <div>
                            <label htmlFor="rate" className="pt-2 block mb-1 text-sm  text-gray-200">
                                Độ hài lòng trên thang điểm 5:
                            </label>
                            <select
                                value={rate}
                                onChange={(e) => { setRate(e.target.value) }}
                                id="rate"
                                className="block w-full px-4 pb-2 mt-1   border  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                aria-label="Chọn mức độ hài lòng" required
                            >
                                <option value="" disabled>
                                    --Chọn--
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-40 px-4 py-2 tracking-wide text-white rounded-md bg-blue-500 hover:bg-blue-400"
                        > Gửi bình luận
                        </button>
                    </form>
                </div>
                <hr />

                <h2 className="p-4 text-xl font-bold  text-white">
                    Các Bình luận: ( Tổng đánh giá: <span className="text-orange-500 font-bold">{totalRating}</span> )</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 p-4">
                    {feedbacks?.map((item) => (
                        <div key={item.id} className="mb-1">
                            <h2 className="text-2xl font-bold  text-white">
                                {item.title}
                            </h2>
                            <p className="text-sm font-medium  text-gray-400">
                                Bình luận vào ngày: {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-white">
                                Nội dung: {item.content}
                            </p><p className="text-sm font-medium text-white">
                                Đánh giá: {item.rating} /5
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <Outlet context={context} />
        </div >
    );
}

