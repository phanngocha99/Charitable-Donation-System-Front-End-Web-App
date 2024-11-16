// Import Hook
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import Component/Context
import { useOutletContext } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { getAuthToken } from "../utils/useToken";

function VerifyOtp() {
    console.log("-----> VerifyOTP rendering ")
    const navigate = useNavigate();
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const [otp, setOTP] = useState('');
    const [msgPhone, setMsgPhone] = useState('');
    const [msgOTP, setMsgOTP] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    const HandleSendOTP = (event) => {
        event.preventDefault();
        setMsgPhone("inprogress");
        // sendOtpApi(phoneNumber);

        // Test: 
        setMsgPhone("ok");

    }

    const HandleVerifyOTP = (event) => {
        event.preventDefault();
        setMsgOTP("inprogress");
        // verifyOtpApi(otp);

        // Test: 
        setMsgOTP("ok");
        setTimeout(() => {
            context.auth.setUser({
                id: context.auth.user.id,
                firstName: context.auth.user.firstName,
                lastName: context.auth.user.lastName,
                phoneNumber: context.auth.user.phoneNumber,
                email: context.auth.user.email,
                password: context.auth.user.password,
                role: context.auth.user.role,
                isVerified: true,
                birthDate: context.auth.user.birthDate,
                token: context.auth.user.token,
            });
            if (context.auth.user.token !== "") {
                context.isLog.setIsLog(getAuthToken());
                navigate("/auth");
            } else {
                if (context.auth.user.role == "charity_org") {
                    console.log('Auth user:', context.auth.user);
                    console.log('Org info:', context.org.org);
                    registerOrgApi(context.auth.user, context.org.org);
                } else {
                    registerApi(context.auth);
                }
            }
        }, 1000);
    }

    function registerOrgApi(userInformation, orgInformation) {
        const requestBody = {
            phoneNumber: userInformation.phoneNumber,
            organizationName: orgInformation.organizationName,
            licenseDocument: orgInformation.licenseDocument,
        };

        fetch(`http://localhost:5000/register/charity-org`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(requestBody)
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.message === "Charity organization registered successfully") {
                    console.log('Org Registered but Not Verified');
                    registerApi(context.auth);
                } else {
                    console.log('Org Registered Fail:', data.message);
                }
            })
            .catch((error) => {
                console.error('Org Registered Fail - Error:', error);
            });
    }
    function sendOtpApi(phoneNumber) {
        fetch(`http://localhost:5000/sendOTP?phone=${phoneNumber}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                console.log('OTP Created')
                setMsgPhone("ok");
            })
            .catch((error) => {
                console.error('Error:', error);
                setMsgPhone("fail");
            });
    }

    function verifyOtpApi(otp) {
        fetch(`http://localhost:5000/verifyOTP?otp=${otp}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                console.log('OTP Verified')
                setMsgOTP("ok");
                context.auth.setUser({
                    id: context.auth.user.id,
                    firstName: context.auth.user.firstName,
                    lastName: context.auth.user.lastName,
                    phoneNumber: context.auth.user.phoneNumber,
                    email: context.auth.user.email,
                    password: context.auth.user.password,
                    role: context.auth.user.role,
                    isVerified: true,
                    birthDate: context.auth.user.birthDate,
                    token: context.auth.user.token,
                });
                context.isLog.setIsLog(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                setMsgOTP("fail");
            });
    }

    function registerApi(auth) {
        fetch(`http://localhost:5000/registerVerifiedUser`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(auth.user)
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.status === 200) {
                    console.log('User Registered is Verified');
                    console.log("--> Auth rendering ")
                    navigate('/auth');
                } else {
                    console.log('User Verified Fail:', data.message);
                    setMsg('UserVerifiedFail');
                    setErr(data.message);
                }
            })
            .catch((error) => {
                console.error('User Verified Fail - Error:', error);
                setMsg('UserVerifiedFail');
                setErr(error);
            });
    }

    return (
        <div className="flex flex-1 flex-col  justify-center space-y-5 max-w-md mx-auto mt-24 ">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">NHẬP MÃ OTP</h2>
            </div>
            <div className="flex flex-col max-w-md space-y-5">
                <button onClick={HandleSendOTP} className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-blue-700 text-white">
                    {msgPhone === ""
                        ? "XÁC NHẬN SẼ GỬI OTP"
                        : msgPhone === "inprogress"
                            ? "OTP ĐANG ĐƯỢC GỬI"
                            : msgPhone === "ok"
                                ? "OTP ĐÃ GỬI THÀNH CÔNG"
                                : "OTP GỬI KHÔNG THÀNH CÔNG"
                    }
                </button>
                {msgPhone === "fail"
                    ? <a className="flex flex-col space-y-2 text-center text-blue-500" href="/VerifyOTP"> Gửi OTP lại !</a>
                    : ""
                }
                {msgPhone === "ok"
                    ? <div className="flex flex-col space-y-2 text-center">
                        <input value={otp}
                            onChange={(e) => setOTP(e.target.value)} type="text" placeholder="OTP"
                            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal" />
                        <button onClick={HandleVerifyOTP} className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                            {msgOTP === ""
                                ? "XÁC NHẬN OTP"
                                : msgOTP === "inprogress"
                                    ? "OTP CODE ĐANG ĐƯỢC GỬI"
                                    : msgOTP === "ok"
                                        ? "OTP ĐÃ ĐƯỢC XÁC NHẬN THÀNH CÔNG"
                                        : "OTP ĐÃ ĐƯỢC XÁC NHẬN KHÔNG THÀNH CÔNG"
                            }
                        </button>
                    </div>
                    : ""
                }
            </div>
            {msg === "UserVerifiedFail"
                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Không thành công! </strong>
                    <span className="block sm:inline">Xác thực không thành công: {err}</span>
                </div>
                : ""
            }
            <Outlet context={context} />
        </div>
    );
}
export default VerifyOtp;