import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from 'react';

function Homepage() {
    console.log("---> Homepage rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
    console.log('Thông tin role: ', context.auth.user.role);

    return (
        <section className="h-screen w-screen p-8">
            <div className="cursor-pointer grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 my-10">
                {/* <!-- Control approve for Tổ chức từ thiện   --> */}
                {context.auth.user.role === "admin" && <>
                    <Link to="/auth/verifyFromAdmin" className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img className="h-40 w-full object-cover" src="https://cdn.prod.website-files.com/65f7525a84038dee300662fc/65fa9c6eb8274c86619b0649_Approval%20in%20Principle.png" alt="" />
                        <div className="p-3">
                            <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                                Phê duyệt Tổ chức từ thiện
                            </h3>
                            <p className="paragraph-normal text-gray-600">
                                Các tài khoản đăng ký dưới vai trò tổ chức từ thiện đang đợi phê duyệt
                            </p>
                        </div>
                    </Link>
                </>}
                {/* <!-- Control for Tạo vùng cần hỗ trợ   --> */}
                {(context.auth.user.role === "charity_org" || context.auth.user.role === "admin") && (
                    <Link to="/auth/charityCampaign" className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img className="h-40 w-full object-cover" src="https://img.freepik.com/premium-psd/charity-template-design_23-2150377798.jpg" alt="" />
                        <div className="p-3">
                            <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                                Quản lý chiến dịch cứu trợ
                            </h3>
                            <p className="paragraph-normal text-gray-600">
                                Tạo và quản lý các chiến dịch cứu trợ(mô tả mục tiêu, thời gian, ngân sách dự kiến).
                            </p>
                        </div>
                    </Link>
                )}
            </div>
        </section >

    );
}

export default Homepage;