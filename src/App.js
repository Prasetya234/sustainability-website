import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "./partial/MainLayout";
import LoadingPage from "./pages/LoadingPage";
import ProtectedRouter from "./auth/ProtectedRouter";
// import ComingSoon from "./pages/ComingSoon";
import jwt_decode from "jwt-decode";

const Login = React.lazy(() => import("./pages/Login"));
// const Register = React.lazy(() => import("./pages/Register"));
const UserBackendRole = React.lazy(() => import("./pages/UserBackendRole"));
const BackendUsers = React.lazy(() => import("./pages/BackendUsers"));
const Home = React.lazy(() => import("./pages/Home"));
const UserSetup = React.lazy(() => import("./pages/UserSetup"));
const DaftarPerusahaan = React.lazy(() => import("./pages/DaftarPerusahaan"));
const NoRoute = React.lazy(() => import("./pages/NoRoute"));
const EmpManagement = React.lazy(() => import("./pages/EmpManagement"));
const PortalPayslip = React.lazy(() => import("./pages/PortalPayslip"));
const PortalTHR = React.lazy(() => import("./pages/PortalTHR"));
const AppSetting = React.lazy(() => import("./pages/AppSetting"));
const GrievanceMain = React.lazy(() => import("./pages/GrievanceMain"));
const GrievanceCategory = React.lazy(() => import("./pages/GrievanceCategory"));
const Faq = React.lazy(() => import("./pages/Faq"));
const Exam = React.lazy(() => import("./pages/Exam"));
const ExamAnswer = React.lazy(() => import("./pages/ExamAnswer"));
const TermPrivacyPolicy = React.lazy(() => import("./pages/TermPrivacyPolicy"));
const Vote = React.lazy(() => import("./pages/Vote"));
const VoteDetail = React.lazy(() => import("./pages/VoteDetail"));
const GrievanceResponse = React.lazy(() => import("./pages/GrievanceResponse"));
const Cuti = React.lazy(() => import("./pages/Cuti"));
const NewsCategory = React.lazy(() => import("./pages/NewsCategory"));
const NewsContent = React.lazy(() => import("./pages/NewsContent"));


function App() {
  const location = useLocation();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = jwt_decode(storedToken);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
      }
    }
  }, []);


  useEffect(() => {
    const currentPath = location.pathname;
    const validPaths = [ "/home", "/account", "/register", "/perushaan" ];

    if (validPaths.includes(currentPath)) {
      sessionStorage.setItem("lastValidURL", currentPath);
    }
  }, [location]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        element={
          <ProtectedRouter>
            <Suspense fallback={<LoadingPage />}>
              <MainLayout />
            </Suspense>
          </ProtectedRouter>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="account" element={<UserSetup />} />
        {/* <Route path="register" element={<Register />} /> */}
        <Route path="register" element={<BackendUsers />} />
        <Route path="backend-user" element={<UserBackendRole />} />
        <Route path="company" element={<DaftarPerusahaan />} />
        <Route path="emp-management" element={<EmpManagement />} />
        <Route path="payslip" element={<PortalPayslip />} />
        <Route path="thr" element={<PortalTHR />} />
        <Route path="appsetting" element={<AppSetting />} />
        <Route path="grievance" element={<GrievanceMain />} />
        <Route path="grievance-category" element={<GrievanceCategory />} />
        <Route path="grievance-response" element={<GrievanceResponse />} />
        <Route path="faq" element={<Faq />} />
        <Route path="exam" element={<Exam />} />
        <Route path="exam-answer" element={<ExamAnswer />} />
        <Route path="term-privacy-policy" element={<TermPrivacyPolicy />} />
        <Route path="cuti" element={<Cuti />} />
        <Route path="news-category" element={<NewsCategory />} />
        <Route path="news" element={<NewsContent />} />
        <Route path="survey" element={<Vote />} />
        <Route path="survey/:id" element={<VoteDetail />} />
        <Route path="*" element={<NoRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
