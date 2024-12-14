import { createBrowserRouter } from "react-router-dom";
// Import Pages
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtp from "./pages/VerifyOtp";
import Auth from "./pages/Auth";
import Homepage from "./pages/Homepage";
import NotAuth from "./pages/NotAuth";
import Profile from "./pages/Profile";
import WaitVerifyFromAdmin from "./pages/WaitVerifyFromAdmin";
import VerifyFromAdmin from "./pages/VerifyFromAdmin";
import CharityCampaign from "./pages/CharityCampaign";
import CharityCampaignCreate from "./pages/CharityCampaignCreate";
import CharityCampaignsEdit from "./pages/CharityCampaignEdit";
import DonorCampaignList from "./pages/DonorCampaignList";
import DonorCampaignDetail from "./pages/DonorCampaignDetail";
import DonorCampaignCreate from "./pages/DonorCampaignCreate";
import VerifyDonateFromAdmin from "./pages/VerifyDonateFromAdmin";
import ExpenseCompaignCreate from "./pages/ExpenseCompaignCreate";
import ExpenseCampaignList from "./pages/ExpenseCampaignList";
import ReportCampaignList from "./pages/ReportCampaignList";
import ReportCampaign from "./pages/ReportCampaign";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/notAuth",
                element: <NotAuth />,
                children: [
                    {
                        path: "/notAuth/login",
                        element: <LoginPage />,
                    },
                    {
                        path: "/notAuth/register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "/notAuth/verifyOtp",
                        element: <VerifyOtp />,
                    },
                    {
                        path: "/notAuth/waitVerifyFromAdmin",
                        element: <WaitVerifyFromAdmin />,
                    },
                ]
            },
            {
                path: "/auth",
                element: <Auth />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "/auth/homepage",
                        element: <Homepage />,
                    },
                    {
                        path: "/auth/profile",
                        element: <Profile />,
                    },
                    {
                        path: "/auth/verifyFromAdmin",
                        element: <VerifyFromAdmin />,
                    },
                    {
                        path: "/auth/charityCampaign",
                        element: <CharityCampaign />,
                    },
                    {
                        path: "/auth/charityCampaign/create",
                        element: <CharityCampaignCreate />,
                    },
                    {
                        path: "/auth/charityCampaign/:id",
                        element: <CharityCampaignsEdit />,
                    },
                    {
                        path: "/auth/DonorCampaignList",
                        element: <DonorCampaignList />,
                    },
                    {
                        path: "/auth/DonorCampaignDetail/:id",
                        element: <DonorCampaignDetail />,
                    },
                    {
                        path: "/auth/DonorCampaign/create/:id/:locateID",
                        element: <DonorCampaignCreate />,
                    }, {
                        path: "/auth/VerifyDonateFromAdmin",
                        element: <VerifyDonateFromAdmin />,
                    },
                    {
                        path: "/auth/ExpenseCompaignList",
                        element: <ExpenseCampaignList />,
                    },
                    {
                        path: "/auth/ExpenseCompaignCreate/:id",
                        element: <ExpenseCompaignCreate />,
                    },
                    {
                        path: "/auth/ReportCompaignList",
                        element: <ReportCampaignList />,
                    },
                    {
                        path: "/auth/ReportCampaign/:campaignId/:charityOrgId",
                        element: <ReportCampaign />,
                    },

                ]
            },
        ]
    },


]);

export default router