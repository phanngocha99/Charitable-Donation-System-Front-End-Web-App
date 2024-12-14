import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

export default function ExpenseCompaignCreate() {
    const { id } = useParams();
    const context = useOutletContext();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [expensed, setExpensed] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expenseInformation = { campaignId: id, amount, description };

    useEffect(() => {
        if (!id) {
            console.error("Invalid route parameters.");
            navigate("/auth/ExpenseCampaignList");
        }
    }, [id]);

    const validInput = (info) => {
        const { amount, description } = info;
        if (!amount || !description) {
            setMsg('fieldEmpty');
            return false;
        }
        return true;
    };

    const registerApi = async (info) => {
        if (window.confirm("Bạn xác nhận muốn chi tiêu?")) {
            setIsSubmitting(true);
            try {
                const response = await fetch("http://localhost:5000/expenses/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${context.isLog.isLog}`,
                    },
                    body: JSON.stringify(info),
                });
                const data = await response.json();

                if (response.ok) {
                    setExpensed(true);
                } else {
                    setMsg("ExpenseFail");
                    setErr(data.message);
                }
            } catch (error) {
                setMsg("ExpenseFail");
                setErr(error.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const HandleSubmit = (event) => {
        event.preventDefault();
        if (validInput(expenseInformation)) {
            setMsg('');
            registerApi(expenseInformation);
        }
    };

    const Redirect = () => {
        setExpensed(false);
        navigate(`/auth/ExpenseCompaignList`);
    };


    if (expensed) {
        return (
            <div className="text-center h-screen bg-blue-100 border border-blue-400 text-blue-700 px-4 pb-3 rounded relative">
                <h1 className="mt-4 font-bold">Chi tiêu đã được ghi lại!</h1>
                <p>Cảm ơn bạn đã ghi chú!!!</p>
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
                        <h2 className="pt-6 text-4xl font-bold text-center  text-white">CHI TIÊU</h2>
                        {msg === "fieldEmpty" && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded">
                                <strong>Không thành công! </strong>
                                <span>Một số thông tin chưa điền!</span>
                            </div>
                        )}
                        {msg === "ExpenseFail" && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded">
                                <strong>Không thành công! </strong>
                                <span>Ghi chú không thành công: {err}</span>
                            </div>
                        )}
                        <form onSubmit={HandleSubmit}>
                            <label
                                htmlFor="amount"
                                className="pt-2 block mb-1 text-sm  text-gray-200"
                            >
                                Số tiền chi tiêu:
                            </label>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                name="amount"
                                id="amount"
                                placeholder="2500000"
                                className="block w-full px-4 pb-2 mt-1 border rounded-md focus:ring-blue-400"
                            />

                            <label
                                htmlFor="amount"
                                className="pt-2 block mb-1 text-sm  text-gray-200"
                            >
                                Chi tiết:
                            </label>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Mua vật phẩm cứu trợ: 10 thùng mỳ tôm"
                                className="mb-2 block w-full px-4 pb-2 mt-1 border rounded-md focus:ring-blue-400"
                            />

                            <button
                                type="submit"
                                className={`p-2 w-full px-4 py-2 tracking-wide text-white rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-400"
                                    }`}
                            >
                                {isSubmitting ? "Processing..." : "Xác nhận chi tiêu"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
