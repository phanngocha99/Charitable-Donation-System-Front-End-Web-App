// Import Tailwind css
import '../App.css';
import '../output.css';

// Import Hook
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
// Import Utils
import { replaceArrJS } from "../utils/arrayUtils";
import { getAuthToken, saveAuthToken, removeAuthToken } from '../utils/useToken';

export default function Auth() {
    const context = useOutletContext();
    console.log('Thông tin context Auth: ', context);
    const navigate = useNavigate();
    // Run fetchLogin only once when the component mounts
    useEffect(() => {
        if (context.auth.user.id === '') {
            fetchLogin(context);
        } else { }
    }, []);

    function fetchLogin(context) {
        fetch(`http://localhost:5000/login`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ phoneNumber: context.auth.user.phoneNumber, password: context.auth.user.password })
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.accessToken) {
                    console.log('Thông tin data - Homepage Register: ', data);
                    handleProfile(data);
                } else {
                    console.log("Login failed:", data);
                    if (data.message === "Tài khoản chưa được xác thực hoặc giấy phép kinh doanh chưa được duyệt") {
                        navigate("/notAuth/waitVerifyFromAdmin");
                    }
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
    };

    function handleProfile(data) {
        fetch(`http://localhost:5000/me`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${data.accessToken}`
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    console.log('Thông tin data - Homepage Logined: ', response);
                    context.auth.setUser(response);
                    console.log('Thông tin Context - Homepage Logined: ', context);
                    saveAuthToken(data.accessToken);
                    context.isLog.setIsLog(getAuthToken);
                    navigate("/auth/homepage");
                } else {
                    console.log("Profile load failed");
                    navigate("/notAuth/login");
                }
            })
            .catch((error) => {
                console.error('Profile fetch error:', error);
                console.log("Profile load failed");
                navigate("/notAuth/login");
            });
    }
    return (
        <div className='app'>
            <NavbarInside context={context} />
            <Outlet context={context} />
        </div>
    )
}

function handleLogout(context, event, navigate) {
    event.preventDefault();
    removeAuthToken();
    context.auth.setUser({ token: '', phoneNumber: '', email: '', role: '' });
    context.isLog.setIsLog(false);
    console.log("Logged out successfully");
    navigate("/notAuth/login");
}

// Memoize NavbarInside to prevent re-renders
const NavbarInside = React.memo(function NavbarInside({ context }) {
    const navigate = useNavigate();
    console.log("---> NavbarInside rendering ");
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button onClick={handleNavbarResponsive} type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-8 w-auto" src="https://cdn-icons-png.flaticon.com/512/15207/15207485.png" alt="Your Company" />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link to="/auth/homepage" className="cursor-pointer rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white  hover:bg-gray-700" aria-current="page">Trang chủ</Link>
                                {context.auth.user.id
                                    ? <Link to="/auth/profile" className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">
                                        Chào người dùng  <span className="text-orange-400">{context.auth.user.phoneNumber} </span>
                                        - Role:
                                        <span className="text-orange-400">
                                            {context.auth.user.role === "donor" ? " Người đóng góp"
                                                : context.auth.user.role === "charity_org" ? " Tổ chức từ thiện"
                                                    : context.auth.user.role === "recipient" ? " Người nhận hỗ trợ" : " Người quản trị"}
                                        </span>
                                    </Link>
                                    : ""
                                }

                                <div onClick={(e) => handleLogout(context, e, navigate)} className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">Đăng xuất</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div id="NavbarMobile" className="space-y-1 px-2 pb-3 pt-2 hidden">
                    <div>
                        <Link to="/auth/homepage" className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">Trang chủ</Link>
                    </div>
                    <div className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        {context.auth.user.id
                            ? <Link to="/auth/profile" aria-current="page"> Chào người dùng  <span className="text-orange-400">{context.auth.user.phoneNumber} </span>
                                - Role:
                                <span className="text-orange-400">
                                    {context.auth.user.role === "donor" ? " Người đóng góp"
                                        : context.auth.user.role === "charity_org" ? " Tổ chức từ thiện"
                                            : context.auth.user.role === "recipient" ? " Người nhận hỗ trợ" : " Người quản trị"}
                                </span></Link>
                            : ""
                        }
                    </div>
                    <div onClick={(e) => handleLogout(context, e, navigate)} className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">Đăng xuất</div>
                </div>
            </div >
        </nav >
    );
});
function handleNavbarResponsive() {
    var NavbarMobileID = document.getElementById('NavbarMobile');
    var NavbarMobilClassNameArr = NavbarMobileID.className.split(' ');
    console.log(NavbarMobilClassNameArr);
    if (NavbarMobilClassNameArr.includes("hidden")) {
        NavbarMobilClassNameArr = replaceArrJS(NavbarMobilClassNameArr, "hidden", "block")
        NavbarMobileID.className = NavbarMobilClassNameArr.join(' ');
    }
    else {
        NavbarMobilClassNameArr = replaceArrJS(NavbarMobilClassNameArr, "block", "hidden")
        NavbarMobileID.className = NavbarMobilClassNameArr.join(' ');
    }
}
