import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

function Homepage() {
    console.log("---> Homepage rendering ")
    const context = useOutletContext();
    console.log('Thông tin context: ', context);
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
                {/*  */}
                <Link to="/auth/profile" className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img className="h-40 w-full object-cover" src="https://images.unsplash.com/photo-1523289217630-0dd16184af8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8d29tZW4lMjBlbXBvd2VybWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="" />
                    <div className="p-3">
                        <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                            Các tài khoản đăng ký dưới vai trò tổ chức từ thiện đang đợi phê duyệt
                        </h3>
                        <p className="paragraph-normal text-gray-600">
                            Happy Women's Day 2022: Read on to know all about the history and significance...
                        </p>
                    </div>
                </Link>
                <Link to="/auth/profile" className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img className="h-40 w-full object-cover" src="https://images.unsplash.com/photo-1523289217630-0dd16184af8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8d29tZW4lMjBlbXBvd2VybWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="" />
                    <div className="p-3">
                        <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                            International Women's Day 2022: Date, history, significance, theme this year
                        </h3>
                        <p className="paragraph-normal text-gray-600">
                            Happy Women's Day 2022: Read on to know all about the history and significance...
                        </p>
                    </div>
                </Link>

            </div>
        </section>

    );
}

export default Homepage;