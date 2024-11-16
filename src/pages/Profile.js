import { useOutletContext } from "react-router-dom";



export default function Profile() {
    console.log("---> Profile rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    return (

        <section className=" dark:bg-gray-900 h-screen max-w-full flex text-white">
            <div className="mt-2 mx-auto ">
                <div className="mt-2 card flex-direction-column max-w-lg border  rounded-lg p-6 ">
                    <div className="mt-2 flex justify-center">
                        <img className=" mt-2 align-middle items-center rounded-full" src=" https://tailwindflex.com/public/images/user.png" />
                    </div>
                    <div className="mt-2 flex-direction-column justify-center">
                        <p className="mt-2 font-bold text-center">Số điện thoại:  <span className="text-orange-400">{context.auth.user.phoneNumber} </span ></p>
                        <h3 className="mt-2 font-bold text-center">Mã số người dùng: <span className="text-orange-400">{context.auth.user.id}</span > </h3>
                        <p className="mt-2 font-bold text-center ">Email :  <span className="text-orange-400">{context.auth.user.email}</span></p>
                        <div className="mt-2 items-center border rounded-lg border-orange-400 text-center">
                            Vai trò: {context.auth.user.role === "donor" ? "Người đóng góp"
                                : context.auth.user.role === "charity_org" ? "Tổ chức từ thiện"
                                    : context.auth.user.role === "recipient" ? "Người nhận hỗ trợ" : "Người quản trị"}
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );

}