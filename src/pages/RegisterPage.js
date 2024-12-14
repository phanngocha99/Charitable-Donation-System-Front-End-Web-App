// Import Hook
import React from "react";
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function RegisterPage() {
    console.log("---> RegisterPage rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setbirthDate] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [token, setToken] = useState('');
    const [id, setId] = useState('');
    const [licenseDocument, setLicenseDocument] = useState('');
    const [organizationName, setOrganizationName] = useState('');


    function HandleSubmit(event) {
        event.preventDefault();
        // Data of User
        const userInformation = { id, firstName, lastName, phoneNumber, email, password, role, isVerified: false, birthDate, token };
        console.log('Thông tin đăng ký - Register: ', userInformation);
        const orgInformation = { userPhone: userInformation.phoneNumber, organizationName, licenseDocument };

        // Example usage
        if (validInput(userInformation, orgInformation)) {
            setMsg("");
            console.log("All fields are filled!");
            context.auth.setUser(userInformation);
            context.org.setOrg(orgInformation);
            registerApi(userInformation);
        } else {
            console.log("Some fields are invalid!");
        }
    };

    function validInput(userInformation) {
        const { firstName, lastName, birthDate, phoneNumber, email, password, role } = userInformation;
        if (
            !firstName ||
            !lastName ||
            !birthDate ||
            !phoneNumber ||
            !email ||
            !password ||
            !role ||
            role === '--Chọn--'
        ) {
            setMsg('fieldEmpty');
            return false;
        }
        if (!firstName ||
            !lastName ||
            !birthDate ||
            !phoneNumber ||
            !email ||
            !password ||
            !role ||
            role === '--Chọn--' ||
            (role === "charity_org" && (!organizationName || !licenseDocument))) {
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

    function registerApi(userInformation) {
        fetch(`http://localhost:5000/register`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userInformation)
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.status === 200) {
                    console.log('User Registered but Not Verified');
                    navigate("/notAuth/verifyOtp");
                } else {
                    console.log('User Registered Fail:', data.message);
                    setMsg('UserRegisteredFail');
                    setErr(data.message);
                }
            })
            .catch((error) => {
                console.error('User Registered Fail - Error:', error);
                setMsg('UserRegisteredFail');
                setErr(error);
            });
    }



    return (
        <div>
            <div className=" bg-gray-900">
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

                    <div className="bg-gray-900 flex items-start w-full max-w-md px-6 mx-auto lg:w-2/6">
                        <div className="flex-1 mt-2">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-center  text-white">ĐĂNG KÝ</h2>
                            </div>
                            {msg === "fieldEmpty"
                                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded relative" role="alert">
                                    <strong className="font-bold">Không thành công! </strong>
                                    <span className="block sm:inline">Một số thông tin chưa điền!</span>
                                </div>
                                : ""
                            }
                            {msg === "invalidPassword"
                                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded relative" role="alert">
                                    <strong className="font-bold">Không thành công! </strong>
                                    <span className="block sm:inline">Mật khẩu không hợp lệ!</span>
                                </div>
                                : ""
                            }
                            {msg === "UserRegisteredFail"
                                ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded relative" role="alert">
                                    <strong className="font-bold">Không thành công! </strong>
                                    <span className="block sm:inline">Đăng ký không thành công: {err}</span>
                                </div>
                                : ""
                            }
                            <div className="mt-2">
                                <form>
                                    <div>
                                        <label htmlFor="firstName" className="pt-2 block mb-1 text-sm  text-gray-200">Tên:</label>
                                        <input required value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)} autoComplete="current-password"
                                            type="text" name="firstName" id="firstName" placeholder="An" className="block w-full px-4 pb-2 mt-1  border  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="pt-2  block mb-1 text-sm  text-gray-200">Họ:</label>
                                        <input required value={lastName}
                                            onChange={(e) => setLastName(e.target.value)} autoComplete="current-password"
                                            type="text" name="lastName" id="lastName" placeholder="Nguyễn Văn" className="block w-full px-4 pb-2 mt-1  border  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                    </div>
                                    <div>
                                        <label htmlFor="birthDate" className="pt-2 block mb-1 text-sm  text-gray-200">Ngày tháng năm sinh:</label>
                                        <input required value={birthDate}
                                            onChange={(e) => setbirthDate(e.target.value)} autoComplete="current-password"
                                            type="date" name="birthDate" id="birthDate" className="block w-full px-4 pb-2 mt-1  border rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 [color-scheme:dark]" />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber" className="pt-2   block mb-1 text-sm  text-gray-200">Tài khoản (Số điện thoại):</label>
                                        <input required value={phoneNumber}
                                            onChange={(e) => setPhone(e.target.value)} autoComplete="current-password"
                                            type="text" name="phoneNumber" id="phoneNumber" placeholder="012345679" className="block w-full px-4 pb-2 mt-1 border  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="pt-2 block mb-1 text-sm  text-gray-200">Email:</label>
                                        <input required value={email}
                                            onChange={(e) => setEmail(e.target.value)} autoComplete="current-email"
                                            type="email" name="email" id="email" placeholder="nguyenvanan@gmail.com" className="block w-full px-4 pb-2 mt-1  border rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label htmlFor="password" className="text-sm  text-gray-200">Mật khẩu:</label>
                                        </div>

                                        <input required value={password}
                                            onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                                            type="password" name="password" id="password" placeholder="1-20 ký tự, bắt đầu bằng chữ in hoa, ít nhất 1 ký tự đặc biệt" className="block w-full px-4 pb-2 mt-1  border rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label htmlFor="role" className="text-sm  text-gray-200">Đăng ký với tư cách:</label>
                                        </div>

                                        <select
                                            onChange={(e) => setRole(e.target.value)} id="role" className="block w-full px-4 pb-2 mt-1  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                            <option>--Chọn--</option>
                                            <option value="donor">Người đóng góp</option>
                                            <option value="charity_org">Tổ chức từ thiện</option>
                                            <option value="recipient">Người nhận hỗ trợ</option>
                                            <option value="admin">Người quản trị</option>
                                        </select>
                                    </div>

                                    {role === "charity_org" &&
                                        <div>
                                            <div>
                                                <label htmlFor="organizationName" className="pt-2 block mb-1 text-sm  text-gray-200">Tên tổ chức từ thiện:</label>
                                                <input required value={organizationName}
                                                    onChange={(e) => setOrganizationName(e.target.value)} autoComplete="current-password"
                                                    type="text" name="organizationName" id="organizationName" placeholder="Chống bão Yagi" className="block w-full px-4 pb-2 mt-1  border rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                            </div>
                                            <div>
                                                <label htmlFor="licenseDocument" className="pt-2 block mb-1 text-sm  text-gray-200">Số định danh tổ chức:</label>
                                                <input required value={licenseDocument}
                                                    onChange={(e) => setLicenseDocument(e.target.value)} autoComplete="current-password"
                                                    type="text" name="licenseDocument" id="licenseDocument" placeholder="180XXXYYYY190" className="block w-full px-4 pb-2 mt-1 border  rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                            </div>
                                        </div>
                                    }

                                    <div className="mt-2">
                                        <button onClick={HandleSubmit}
                                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                            Đăng Ký
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Outlet context={context} />
        </div>
    );
}

