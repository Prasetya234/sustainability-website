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

  
  if (!checkAccessPath && location.pathname !== "/" & location.pathname !== "/home") {
    return <Navigate to="/home" />;
  }

  return children;
};


export default ProtectedRouter;
