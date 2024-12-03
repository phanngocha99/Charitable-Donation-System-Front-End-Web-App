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
                        <img className="h-40 w-full object-contain" src="https://media.istockphoto.com/id/948531554/vector/approved-ink-stamp.jpg?s=612x612&w=0&k=20&c=kVKJxtXo1QOxDoqTvAdxHEjuVlcRvxGN-1f6qvyimRA=" alt="" />
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
                        <img className="h-40 w-full object-cover" src="https://img.freepik.com/premium-vector/world-charity-day-observed-september-5th-is-dedicated-promoting-charitable-efforts_846499-2300.jpg?semt=ais_hybrid" alt="" />
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
                {/* Đóng góp từ thiện */}
                <Link to="/auth/DonorCampaignList" className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img className="h-40 w-full object-cover" src="https://nyegop.org/wp-content/uploads/2019/11/Donate.jpg" alt="" />
                    <div className="p-3">
                        <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                            Đóng góp từ thiện
                        </h3>
                        <p className="paragraph-normal text-gray-600">
                            Cho phép đóng góp qua nhiều hình thức (chuyển khoản ngân hàng, ví điện tử, thẻ tín dụng, tiền mặt).
                            Hiển thị đầy đủ về thông tin chi tiết và tình hình bão lũ và nhu cầu cứu trợ.
                        </p>
                    </div>
                </Link>
                {/* <!-- Control approve for Đóng góp từ thiện   --> */}
                {context.auth.user.role === "admin" && <>
                    <Link to="/auth/VerifyDonateFromAdmin" className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img className="h-40 w-full object-contain" src="https://thumbs.dreamstime.com/b/red-payment-received-stamp-sticker-white-distressed-words-43736395.jpg" alt="" />
                        <div className="p-3">
                            <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                                Phê duyệt Đóng góp từ thiện
                            </h3>
                            <p className="paragraph-normal text-gray-600">
                                Người quản trị kiểm tra và xác nhận đã nhận được đóng góp
                            </p>
                        </div>
                    </Link>
                </>}
            </div>
        </section >

    );
}

export default Homepage;