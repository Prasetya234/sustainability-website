import { useContext } from "react";

import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRouter = ({ children }) => {
  const navigate = useNavigate();
  const { value } = useContext(AuthContext);
  const { token, menus } = value;
  const location = useLocation();

  const checkAccessPath = menus.filter(
    (menu) => `/${menu.MENU_PATH}` === location.pathname
  );

  // if (!token) {
  //   return <Navigate to="/" />;
  // }
  // console.log(checkAccessPath);
  if (!checkAccessPath) {
    // return navigate(-1);
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRouter;
