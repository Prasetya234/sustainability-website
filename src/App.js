import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "./partial/MainLayout";
import LoadingPage from "./pages/LoadingPage";
import ProtectedRouter from "./auth/ProtectedRouter";
// import ComingSoon from "./pages/ComingSoon";
import jwt_decode from "jwt-decode";
import GuestRouter from "./auth/GuestRouter";

const Login = React.lazy(() => import("./pages/Login"));
const Content = React.lazy(() => import("./pages/Content"));
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
const Library = React.lazy(() => import("./pages/Library"));
const Exam = React.lazy(() => import("./pages/Exam"));
const ExamAnswer = React.lazy(() => import("./pages/ExamAnswer"));
const Class = React.lazy(() => import("./pages/Class"));
const ClassCategory = React.lazy(() => import("./pages/ClassCategory"));
const Certificate = React.lazy(() => import("./pages/Certificate"));
const CertificateTemplate = React.lazy(() => import("./pages/CertificateTemplate"));
const TermPrivacyPolicy = React.lazy(() => import("./pages/TermPrivacyPolicy"));
const Vote = React.lazy(() => import("./pages/Vote"));
const VoteDetail = React.lazy(() => import("./pages/VoteDetail"));
const GrievanceResponse = React.lazy(() => import("./pages/GrievanceResponse"));
const Cuti = React.lazy(() => import("./pages/Cuti"));
const NewsCategory = React.lazy(() => import("./pages/NewsCategory"));
const NewsContent = React.lazy(() => import("./pages/NewsContent"));
const Investigation = React.lazy(() => import("./pages/Investigation"));
const Banner = React.lazy(() => import("./pages/Banner"));
const Analytic = React.lazy(() => import("./pages/Analytic"));
const AnalyticNews = React.lazy(() => import("./pages/analytic/News"));
const AnalyticSurvey = React.lazy(() => import("./pages/analytic/Survey"));
const AnalyticTask = React.lazy(() => import("./pages/analytic/Task"));
const AnalyticLearning = React.lazy(() => import("./pages/analytic/Learning"));
const AnalyticPersonalInfo = React.lazy(() => import("./pages/analytic/PersonalInfo"));
const AnalyticGrievance = React.lazy(() => import("./pages/analytic/Grievance"));

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
      <Route path="/login" element={
       <GuestRouter>
         <Login />
       </GuestRouter>    
       } />
      <Route
        path="/content"
        element={
          <Suspense fallback={<LoadingPage />}>
            <Content />
          </Suspense>
        }
      />

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
        <Route path="library" element={<Library />} />
        <Route path="exam" element={<Exam />} />
        <Route path="exam-answer" element={<ExamAnswer />} />
        <Route path="class" element={<Class />} />
        <Route path="class-category" element={<ClassCategory />} />
        <Route path="term-privacy-policy" element={<TermPrivacyPolicy />} />
        <Route path="cuti" element={<Cuti />} />
        <Route path="news-category" element={<NewsCategory />} />
        <Route path="news" element={<NewsContent />} />
        <Route path="survey" element={<Vote />} />
        <Route path="survey/:id" element={<VoteDetail />} />
        <Route path="investigation" element={<Investigation />} />
        <Route path="certificate-template" element={<CertificateTemplate />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="banner" element={<Banner />} />
        <Route path="analytic" element={<Analytic />} />
        <Route path="analytic-news" element={<AnalyticNews />} />
        <Route path="analytic-survey" element={<AnalyticSurvey />} />
        <Route path="analytic-task" element={<AnalyticTask />} />
        <Route path="analytic-pembelajaran" element={<AnalyticLearning />} />
        <Route path="analytic-info-pribadi" element={<AnalyticPersonalInfo />} />
        <Route path="analytic-grivance" element={<AnalyticGrievance />} />

        <Route path="*" element={<NoRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
