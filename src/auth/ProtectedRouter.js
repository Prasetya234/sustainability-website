import { useContext } from "react";

import {   Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRouter = ({ children }) => {
  const { value } = useContext(AuthContext);
  const { token } = value;

  const storedToken = localStorage.getItem("token");
  if (!token && !storedToken) {
    return <Navigate to="/" />;
  }

  // const checkAccessPath = menus.some(
  //   (menu) => `/${menu.MENU_PATH}` === location.pathname
  // );

  // if (!checkAccessPath && location.pathname !== "/") {
  //   return <Navigate to="/home" />;
  // }

  return children;
};


export default ProtectedRouter;
