import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "./partial/MainLayout";
import LoadingPage from "./pages/LoadingPage";
import ProtectedRouter from "./auth/ProtectedRouter";
// import ComingSoon from "./pages/ComingSoon";
import jwt_decode from "jwt-decode";

const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Home = React.lazy(() => import("./pages/Home"));
const UserSetup = React.lazy(() => import("./pages/UserSetup"));
const DaftarPerusahaan = React.lazy(() => import("./pages/DaftarPerusahaan"));
const NoRoute = React.lazy(() => import("./pages/NoRoute"));
const EmpManagement = React.lazy(() => import("./pages/EmpManagement"));


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
        <Route path="register" element={<Register />} />
        <Route path="company" element={<DaftarPerusahaan />} />
        <Route path="emp-management" element={<EmpManagement />} />
        <Route path="*" element={<NoRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
