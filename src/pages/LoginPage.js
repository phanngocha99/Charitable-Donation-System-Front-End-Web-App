// Imports Hook
import React from "react";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
// Import Utils
import { getAuthToken, saveAuthToken } from '../utils/useToken';

// Inmport Context

export default function LoginPage() {
    console.log("---> LoginPage rendering ")
    const navigate = useNavigate();
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const [msg, setMsg] = useState();
    const [err, setErr] = useState();
    const [phoneNumber, setPhoneNumeber] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [id, setId] = useState('');

    function HandleSubmit(event) {
        event.preventDefault();
        // Data of User
        const userInformation = { id, phoneNumber, password, token };
        console.log('Thông tin đăng nhập: ', userInformation);

        if (validInput(userInformation)) {
            setMsg("");
            console.log("All fields are filled!");
            // Call API to login users
            fetch(`http://localhost:5000/login`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(userInformation)
            })
                .then((data) => data.json())
                .then((data) => {
                    if (data.accessToken) {
                        console.log('Thông tin đăng nhập trả về: ', userInformation);
                        console.log('User Logined');
                        userInformation.token = data.accessToken;
                        context.auth.setUser(userInformation);
                        setMsg('UserLogined');
                        navigate("/notAuth/verifyOtp");
                    } else {
                        console.log(data);
                        setErr(data.message);
                        setMsg('UserLoginedFail');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setMsg('UserLoginedFail');
                });

        } else {
            console.log("Some fields are invalid!");
        }
    };

    function validInput(userInformation) {
        const { phoneNumber, password } = userInformation;
        if (
            !phoneNumber ||
            !password
        ) {
            setMsg('fieldEmpty');
            return false;
        }

        const passwordRegex = /^[A-Z][A-Za-z0-9!@#\$%\^\&*\)\(+=._-]{1,19}$/;
        if (!passwordRegex.test(password)) {
            setMsg('invalidPassword');
            return false;
        }
        return true; // All fields are valid (not empty)
    }

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/3 opacity-75 " style={{ backgroundImage: "url(https://img.pikbest.com/origin/10/52/78/738pIkbEsTT9Q.jpg!f305cw)" }}>
                    <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                        <div>
                            <h2 className="text-4xl font-bold text-white">QUYÊN GÓP TỪ THIỆN</h2>

                            <p className="max-w-xl mt-3 text-gray-300">Hệ thống đóng góp từ thiện vùng thiên tai lũ lụt
                                <br /> Môn Nhập môn Công Nghệ Phần Mềm
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">QUYÊN GÓP TỪ THIỆN</h2>
                            {msg === "fieldEmpty"
                                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Không thành công! </strong>
                                    <span className="block sm:inline">Một số thông tin chưa điền!</span>
                                </div>
                                : ""
                            }
                            {msg === "invalidPassword"
                                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Không thành công! </strong>
                                    <span className="block sm:inline">Mật khẩu không hợp lệ!</span>
                                </div>
                                : ""
                            }
                            {msg === "UserLoginedFail"
                                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Không thành công! </strong>
                                    <span className="block sm:inline">Đăng nhập không thành công {err}</span>
                                </div>
                                : ""
                            }
                        </div>

                        <div className="mt-8">
                            <form>
                                <div>
                                    <label htmlFor="phone" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Tài khoản (Số điện thoại):</label>
                                    <input value={phoneNumber}
                                        onChange={(e) => setPhoneNumeber(e.target.value)} autoComplete="current-password" type="text" name="phone" id="phone" placeholder="012345679" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Mật khẩu:</label>
                                    </div>

                                    <input value={password}
                                        onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" type="password" name="password" id="password" placeholder="Mật khẩu của bạn" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div className="mt-6">
                                    <button onClick={HandleSubmit}
                                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        Đăng Nhập
                                    </button>
                                </div>
                            </form>
                            <p className="mt-6 text-sm text-center text-gray-400">Chưa có tài khoản? <Link to="/notAuth/register" className="text-blue-500 focus:outline-none focus:underline hover:underline">Đăng Ký</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet context={context} />
        </div >
    );
}

