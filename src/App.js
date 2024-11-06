import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./partial/MainLayout";
import LoadingPage from "./pages/LoadingPage";
import ProtectedRouter from "./auth/ProtectedRouter";
// import ComingSoon from "./pages/ComingSoon";

const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Home = React.lazy(() => import("./pages/Home"));
const UserSetup = React.lazy(() => import("./pages/UserSetup"));
const DaftarPerusahaan = React.lazy(() => import("./pages/DaftarPerusahaan"));
const NoRoute = React.lazy(() => import("./pages/NoRoute"));

function App() {
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
        <Route path="perushaan" element={<DaftarPerusahaan />} />
        <Route path="*" element={<NoRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
