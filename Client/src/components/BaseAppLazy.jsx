import React, { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// React.lazy() is used to dynamically import a component when it's rendered.
lazy(() => import("../App.css"));
const Layout = lazy(() => import("../Layout"));
const DashBoard = lazy(() => import("./dashboard/DashBoard"));
const ViewSubmission = lazy(() => import("./dashboard/ViewSubmission"));
const AddSubmission = lazy(() => import("./dashboard/AddSubmission"));
const AnalyticReport = lazy(() => import("./dashboard/AnalyticReport"));
const Login = lazy(() => import("./login/Login"));
const SignUp = lazy(() => import("./signup/SignUp"));
const Preloader = lazy(() => import("./preloader/Preloader"));
// const Logout = lazy(() => import("./logout/Logout"));
const Profile = lazy(() => import("./profile/Profile"));
const Verification = lazy(() => import("./signup/Verification"));
const ForgotPassword = lazy(() => import("./login/ForgotPassword"));
const AssignReviewer = lazy(() => import("./editor/AssignReviewer"));
const ProtectedRoute = lazy(() => import("../utils/ProtectedRoute"));
const ReviewArticles = lazy(() => import("./reviewer/ReviewArticles"));
const AddReviewer = lazy(() => import("./editor/AddReviewer"));
const ViewArticles = lazy(() => import("./editor/ViewArticles"));
const AcceptedArticles = lazy(() => import("./editor/AcceptedArticles"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const AddEditor = lazy(() => import("./admin/AddEditor"));
const GuestRoute = lazy(() => import("../utils/GuestRoute"));
const ErrorElement = lazy(() => import("./ErrorElement"));
// const DocViewer = lazy(() => import("./fileviewer/DOCViewer"));
import Loading from "../utils/Loading";
const ViewJournalArticle = lazy(() => import("./journal/ViewJournalArticle"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loading />}>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                path: '/',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Preloader />
                    </Suspense>
                ),
            },
            {
                element: (
                    <Suspense fallback={<Loading />}>
                        <ProtectedRoute />
                    </Suspense>
                ),
                children: [
                    {
                        path: "dashboard",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <DashBoard />
                            </Suspense>
                        ),
                        children: [
                            {
                                path: "profile",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <Profile />
                                    </Suspense>
                                ),
                                errorElement: <ErrorElement />,
                            },
                            {
                                path: "assign-reviewer",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AssignReviewer />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "add-submission/:journalId?",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AddSubmission />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "analytical-report",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AnalyticReport />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "review-article",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ReviewArticles />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "view-articles",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ViewArticles />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "add-reviewer",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AddReviewer />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "accepted-articles",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AcceptedArticles />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "view-submission/:articleId?",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ViewSubmission />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "view-journal-article/:articleId?",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ViewJournalArticle />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        path: "add-editor",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <AddEditor />
                            </Suspense>
                        ),
                    },

                ],
            },
        ],
    },
    {
        element: (
            <Suspense fallback={<Loading />}>
                <GuestRoute />
            </Suspense>
        ),
        children: [
            {
                path: "/login",
                element: (
                    <Suspense fallback={<Loading />}>
                        <Login />
                    </Suspense>
                ),
                children: [
                    {
                        path: "forgot-password",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ForgotPassword />
                            </Suspense>
                        ),
                    },
                    {
                        path: "verify-email",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <Verification />
                            </Suspense>
                        ),
                    }
                ],
            },
            {
                path: "/sign-up",
                element: (
                    <Suspense fallback={<Loading />}>
                        <SignUp />
                    </Suspense>
                ),
                children: [
                    {
                        path: "verify-email",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <Verification />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
    {
        path: "/*",
        element: (
            <Suspense fallback={<Loading />}>
                <PageNotFound />
            </Suspense>
        ),
    },
]);

function BaseAppLazy() {
    return (
        <RouterProvider router={router} />
    );
}

export default BaseAppLazy;