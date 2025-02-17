import React, { useState, createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

// import axios from 'axios';
import jwt_decode from "jwt-decode";
import axios from "../axios/axios.js";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState("");
  const [activeId, setActiveId] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [userInisial, setUserInisial] = useState("");
  // const [userCeisa, setUserCeisa] = useState("");
  const [userNpwp, setUserNpwp] = useState("");
  // const [userPassCeisa, setUserPassCeisa] = useState("");
  const [userMode, setUserMode] = useState("");
  const [userPath, setUserPath] = useState("");
  const [idPerusahaan, setIdPerusahaan] = useState("");
  const [menus, setMenus] = useState([]);

  const initialState = {
    spin: false,
    status_connect: false,
    access_token: "",
    refresh_token: "",
    expireToken: "",
    dataPerusahaan: {},
    userLevel: "",
    menuActive: {},
  };
  const reducer = (mainState, action) => {
    switch (action.type) {
      case "LAUNCH_LOADING":
        return { ...mainState, spin: action.payload };
      case "SET_TOKEN":
        return { ...mainState, access_token: action.payload };
      case "SET_REFTOKEN":
        return { ...mainState, refresh_token: action.payload };
      case "SET_EXPIRED":
        return { ...mainState, expireToken: action.payload };
      case "SET_CONECTION_STATUS":
        return { ...mainState, status_connect: action.payload };
      case "GET_DATA_PERUSAHAAN":
        return { ...mainState, dataPerusahaan: action.payload.data };
      case "GET_USER_LEVEL":
        return { ...mainState, userLevel: action.payload };
      case "SET_ACTIVE_MENU":
        return { ...mainState, menuActive: action.payload };
      default:
        return mainState;
    }
  };

  const [mainState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
  //   const initializeAuth = async () => {
  //     const savedToken = localStorage.getItem("token");
  
  //     if (savedToken) {
  //       try {
  //         const decoded = jwt_decode(savedToken);
  // console.log(decoded);
  
  //         // Jika token sudah expired, lakukan refresh
  //         if (decoded.exp * 1000 < Date.now()) {
  //           localStorage.removeItem("token");
  //           await refreshToken();
  //         } else {
  //           // Set state langsung dari token yang ada
  //           setToken(savedToken);
  //           setActiveId(decoded.userId);
  //           setActiveUser(decoded.username);
  //           setExpire(decoded.exp);
  //           setUserInisial(decoded.userInisial);
  //           setUserNpwp(decoded.userNpwp);
  //           setUserMode(decoded.userMode);
  //           setUserPath(decoded.userPath);
  //           setIdPerusahaan(decoded.idPerusahaan);
  //           dispatch({ type: "GET_USER_LEVEL", payload: decoded.userLevel });
  //         }
  //       } catch (error) {
  //         console.error("Error decoding token:", error);
  //         localStorage.removeItem("token");
  //       }
  //     } else {
  //       // Jika token tidak ada, panggil fungsi refreshToken
  //       await refreshToken();
  //     }
  //   };
  
    const refreshToken = async () => {
      try {
        const response = await axios.get(`/token`);
        const newToken = response.data.apkbAcssToken;
        const decoded = jwt_decode(newToken);
  
        setToken(newToken);
        localStorage.setItem("token", newToken); // Simpan token ke localStorage
        setActiveId(decoded.userId);
        setActiveUser(decoded.username);
        setExpire(decoded.exp);
        setUserInisial(decoded.userInisial);
        setUserNpwp(decoded.userNpwp);
        setUserMode(decoded.userMode);
        setUserPath(decoded.userPath);
        setIdPerusahaan(decoded.idPerusahaan);
        dispatch({ type: "GET_USER_LEVEL", payload: decoded.userLevel });
  
        const menuResponse = await axios.get(`/useraccess/menuview/${decoded.userId}`);
        const menusData = menuResponse.data;
        
          setMenus(menusData);
        // const checkMenuDok = menusData.filter((men) => men.MENU_MODUL === "DOCUMENT");
  
        // if (checkMenuDok.length > 0) {
        //   const newMenuPath = [...menusData, { MENU_PATH: "inputdokumen", MENU_DESC: "Input Dokumen" }];
        //   setMenus(newMenuPath);
        // } else {
        //   setMenus(menusData);
        // }
  
        dispatch({ type: "SET_CONECTION_STATUS", payload: decoded.userCeisa || decoded.userPassCeisa });
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/");
      }
    };
    refreshToken()
    // initializeAuth();
  }, [navigate, mainState.status_connect]);

  const handleNavigation = (path) => {
    const nextPath =  menus.find(item => item.MENU_PATH === path)
    if(!nextPath) return;
    // Path yang akan diakses
    navigate(path);
  };
  
  //handle delete
  async function getDataPerusahaan(id) {
    if (id) {
      await axios
        .get(`/perusahaan/${id}`)
        .then((res) => {
          if (res.status) {
            dispatch({
              type: "GET_DATA_PERUSAHAAN",
              payload: { data: res.data.data[0] },
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    getDataPerusahaan(idPerusahaan);
  }, [idPerusahaan]);



  const value = {
    token: token,
    userId: activeId,
    username: activeUser,
    expire: expire,
    userInisial: userInisial,
    // userCeisa: userCeisa,
    // userPassCeisa: userPassCeisa,
    menus: menus,
    userMode: userMode,
    userPath: userPath,
    userNpwp: userNpwp,
    idPerusahaan: idPerusahaan,
  };

  return (
    <AuthContext.Provider value={{ mainState, value, dispatch, handleNavigation }}>
      {children}
    </AuthContext.Provider>
  );
};
