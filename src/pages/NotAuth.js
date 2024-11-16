// Import Tailwind css
import '../App.css';
import '../output.css';
// Import Hook
import { Link, Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

// Import Utils
import { replaceArrJS } from "../utils/arrayUtils";

export default function NotAuth() {
    const context = useOutletContext();
    return (
        <div className='app'>
            <NavbarPublic />
            <Outlet context={context} />
        </div>
    )
}

function NavbarPublic() {
    console.log("---> NavbarPublic rendering ")
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
                                <Link to='/notAuth/login' className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">Đăng Nhập</Link>
                                <Link to='/notAuth/register' className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Đăng Ký</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div id="NavbarMobile" className="space-y-1 px-2 pb-3 pt-2 hidden">
                    <Link to='/notAuth/login' className="cursor-pointer block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Đăng Nhập</Link>
                    <Link to='/notAuth/register' className="cursor-pointer block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Đăng Ký</Link>
                </div>
            </div >
        </nav >
    )
}
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
