import { useContext } from "react";

import {   Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRouter = ({ children }) => {
  const { value } = useContext(AuthContext);
  const { token, menus } = value;
  const location = useLocation();

  const storedToken = localStorage.getItem("token");
  if (!token && !storedToken) {
    return <Navigate to="/" />;
  }

  const checkAccessPath = menus.some(
    (menu) => `/${menu.MENU_PATH}` === location.pathname
  );

  const arrPathAllow = ['/home', '/user-profile', '/']
  
  const checkRoute = (route) => {
    return !arrPathAllow.some(path => {
    if (route.startsWith('/survey')) {
      return true;
    }
    return path === route;
  });

  }
  
  if (!checkAccessPath && checkRoute(location.pathname)) {
    return <Navigate to="/home" />;
  }

  return children;
};


export default ProtectedRouter;
