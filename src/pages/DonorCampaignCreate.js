import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

export default function DonorCampaignCreate() {
    const { id, locateID } = useParams();
    const context = useOutletContext();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('cash');
    const [donated, setDonated] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const donorInformation = { campaignId: id, locationId: locateID, amount, method };

    useEffect(() => {
        if (!id || !locateID) {
            console.error("Invalid route parameters.");
            navigate("/auth/charityCampaign");
        }
    }, [id, locateID, navigate]);

    const validInput = (info) => {
        const { amount, method } = info;
        if (!amount || !method) {
            setMsg('fieldEmpty');
            return false;
        }
        return true;
    };

    const registerApi = async (info) => {
        if (window.confirm("Bạn xác nhận muốn đóng góp?")) {
            setIsSubmitting(true);
            try {
                const response = await fetch("http://localhost:5000/donations/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${context.isLog.isLog}`,
                    },
                    body: JSON.stringify(info),
                });
                const data = await response.json();

                if (response.ok) {
                    setDonated(true);
                } else {
                    setMsg("DonationFail");
                    setErr(data.message);
                }
            } catch (error) {
                setMsg("DonationFail");
                setErr(error.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const HandleSubmit = (event) => {
        event.preventDefault();
        if (validInput(donorInformation)) {
            setMsg('');
            registerApi(donorInformation);
        }
    };

    const Redirect = () => {
        setDonated(false);
        navigate(`/auth/DonorCampaignList`);
    };

    const PaymentDetails = ({ method }) => {
        switch (method) {
            case "cash":
                return <p className="text-orange-400">Chúng tôi sẽ liên hệ bạn qua số điện thoại để tiến hành giao dịch!</p>;
            case "bank":
            case "payment":
                return (
                    <div className="flex justify-center text-orange-400">
                        Vui lòng chuyển qua thông tin chuyển khoản {method === "bank" ? "ngân hàng" : "ví điện tử"}:
                        <img
                            style={{ width: "50%" }}
                            src="https://files.get-qr.com/files/674ecf5a676d1f3195812680/sY4cXW.png"
                            alt="QR Code"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    if (donated) {
        return (
            <div className="text-center h-screen bg-blue-100 border border-blue-400 text-blue-700 px-4 pb-3 rounded relative">
                <h1 className="mt-4 font-bold">Đóng góp đã được ghi lại!</h1>
                <p>Cảm ơn bạn đã đóng góp!!!</p>
                <div className="mt-4">
                    <button
                        onClick={Redirect}
                        className="w-2/5 px-4 py-2 tracking-wide text-white bg-blue-500 rounded-md hover:bg-blue-400"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-gray-900 h-screen">
            <div className="flex justify-center">
                <div className="flex items-start w-full max-w-lg px-6 mx-auto">
                    <div className="flex-1 mt-2">
                        <h2 className="pt-6 text-4xl font-bold text-center  text-white">ĐÓNG GÓP</h2>
                        {msg === "fieldEmpty" && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded">
                                <strong>Không thành công! </strong>
                                <span>Một số thông tin chưa điền!</span>
                            </div>
                        )}
                        {msg === "DonationFail" && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded">
                                <strong>Không thành công! </strong>
                                <span>Đóng góp không thành công: {err}</span>
                            </div>
                        )}
                        <form onSubmit={HandleSubmit}>
                            <label
                                htmlFor="amount"
                                className="pt-2 block mb-1 text-sm text-gray-200"
                            >
                                Số tiền ủng hộ:
                            </label>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                name="amount"
                                id="amount"
                                className="block w-full px-4 pb-2 mt-1 border rounded-md focus:ring-blue-400"
                            />
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {["cash", "bank", "payment"].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setMethod(type)}
                                        className={`cursor-pointer p-6 border rounded-lg shadow ${method === type ? "border-blue-500" : "border-blue-300"
                                            }`}
                                    >
                                        <h2 className="text-white text-sm font-bold">{type.toUpperCase()}</h2>
                                    </div>
                                ))}
                            </div>
                            <PaymentDetails method={method} />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-4 py-2 tracking-wide text-white rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-400"
                                    }`}
                            >
                                {isSubmitting ? "Processing..." : "Xác nhận đóng góp"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
