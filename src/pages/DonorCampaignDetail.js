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
    const [rate, setRate] = useState('');
    const [feedbacks, setFeedbacks] = useState();

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
    const campaignInformation = { title, description, goalAmount, startDate, endDate, locations };
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

    function Map(locations) {
        // MAP
        // Initialize the map once the component is mounted
        const ol = window.ol;
        // Define map layers and map view
        var longitude = Math.floor(locations[0].longitude);
        var latitude = Math.floor(locations[0].latitude);
        var lonLat = [longitude, latitude];
        console.log(longitude, latitude);
        console.log("lonLat", lonLat);

        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat(lonLat),
                zoom: 15
            })
        });

        // Add marker
        var marker = new ol.Feature({
            geometry: new ol.geom.Point(
                ol.proj.fromLonLat(lonLat)
            )
        });

        marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: '/images/marker-icon.png'
            }))
        }));

        var vectorSource = new ol.source.Vector({
            features: [marker]
        });

        var markerVectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        map.addLayer(markerVectorLayer);
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

                    // Validate and set locations
                    if (Array.isArray(data.Locations)) {
                        setLocations(data.Locations);
                        Map(data.Locations);
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
            <div className="bg-white dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="p-10 text-2xl font-bold text-center text-gray-700 dark:text-white"> {title} </h2>
                    <div className="pt-2 text-l text-white"> Ngày bắt đầu: <strong>{startDate}</strong> - Ngày kết thúc : <strong>{endDate}</strong></div>
                    <p
                        className={`text-l font-medium ${statusStyles[state]?.color || "text-gray-500"}`}
                    >
                        Trạng thái: {statusStyles[state]?.label || "Không xác định"}
                    </p>
                </div>

                <div className="flex-col justify-center text-justify p-4">
                    <p className="pl-4 pr-4 text-l text-gray-600 dark:text-gray-400"> {description} </p>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
                    <div
                        className="cursor-pointer relative group mb-8 max-w-full p-6 bg-white border border-yellow-200 rounded-lg shadow  dark:bg-gray-800 dark:border-yellow-700 hover:shadow-yellow-500"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            SỐ TIỀN KÊU GỌI
                        </h2>
                        <p className="text-3xl text-orange-500 ">
                            {parseFloat(goalAmount).toLocaleString()} VNĐ
                        </p>
                    </div>
                    <Link to={`/auth/donorCampaign/create/${id}/${locations[0].id}`} className=" relative group mb-8 max-w-full  p-10 cursor-pointer text-4xl font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                        ĐÓNG GÓP</Link>
                </div>
                <h2 className="p-4 text-xl font-bold text-gray-700 dark:text-white">
                    Khu vực ảnh hưởng:</h2>
                <div className="p-10 text-l flex flex-row ">
                    <div className="flex-col">
                        <p className=" text-gray-600 dark:text-gray-400"> Tỉnh: <span className="text-white font-bold">{locations[0].province}</span></p>
                        <p className=" text-gray-600 dark:text-gray-400"> Thành phố: <span className="text-white font-bold">{locations[0].city}</span></p>
                        <p className=" text-gray-600 dark:text-gray-400"> Quận: <span className="text-white font-bold">{locations[0].district}</span></p>
                        <p className=" text-gray-600 dark:text-gray-400"> Phường: <span className="text-white font-bold">{locations[0].ward}</span></p>
                        <p className=" text-gray-600 dark:text-gray-400"> MỨC THIỆT HẠI: <span className="text-orange-500 font-bold">{locations[0].damageLevel}</span></p>
                    </div>
                    {/* <div id="map" style={{ paddingLeft: "100px", textAlign: "center", width: "80%", height: "500px" }}></div> */}
                </div>
                <hr />

                <h2 className="p-4 text-xl font-bold text-gray-700 dark:text-white">
                    Gửi Bình luận:</h2>
                <div className="p-4 text-l">
                    <form onSubmit={HandleSubmit}>
                        <label
                            htmlFor="feedback"
                            className="block mb-1 text-l text-gray-600 dark:text-gray-400"
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
                            <label htmlFor="rate" className="pt-2 block mb-1 text-sm text-gray-600 dark:text-gray-200">
                                Độ hài lòng trên thang điểm 5:
                            </label>
                            <select
                                value={rate}
                                onChange={(e) => { setRate(e.target.value) }}
                                id="rate"
                                className="block w-full px-4 pb-2 mt-1 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
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

                <h2 className="p-4 text-xl font-bold text-gray-700 dark:text-white">
                    Các Bình luận:</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 p-4">
                    {feedbacks?.map((item) => (
                        <div className="mb-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {item.title}
                            </h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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

