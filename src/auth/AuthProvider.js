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
    photoProfile: "",
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
      case "SET_USER_PHOTO":
        return { ...mainState, photoProfile: action.payload };
      default:
        return mainState;
    }
  };

  const [mainState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`/token`);
        const newToken = response.data.apkbAcssToken;

        dispatch({ type: "SET_TOKEN", payload: newToken });
        localStorage.setItem("token", newToken); // Simpan token ke localStorage

        const decoded = jwt_decode(newToken);

        setToken(newToken);
        setActiveId(decoded.userId);
        setActiveUser(decoded.username);
        setExpire(decoded.exp);
        setUserInisial(decoded.userInisial);
        setUserNpwp(decoded.userNpwp);
        setUserMode(decoded.userMode);
        setUserPath(decoded.userPath);
        setIdPerusahaan(decoded.idPerusahaan);
        dispatch({ type: "GET_USER_LEVEL", payload: decoded.userLevel });

        const menuResponse = await axios.get(
          `/useraccess/menuview/${decoded.userId}`
        );

        const menusData = menuResponse.data;
        
        setMenus(menusData);
        // const checkMenuDok = menusData.filter((men) => men.MENU_MODUL === "DOCUMENT");

        // if (checkMenuDok.length > 0) {
        //   const newMenuPath = [...menusData, { MENU_PATH: "inputdokumen", MENU_DESC: "Input Dokumen" }];
        //   setMenus(newMenuPath);
        // } else {
        //   setMenus(menusData);
        // }

        dispatch({
          type: "SET_CONECTION_STATUS",
          payload: decoded.userCeisa || decoded.userPassCeisa,
        });
      } catch (error) {
        const path = window.location.pathname + window.location.search;

        // Tambahkan pengecualian agar path seperti /login dan /content tidak disimpan
  const isExcludedPath = 
    path === '/' ||
    path.startsWith('/login') ||
    path.startsWith('/content');


        if (!isExcludedPath) {
          sessionStorage.setItem('redirectAfterLogin', path);
        }

      }
    };
    refreshToken();
    // initializeAuth();
  }, [navigate, mainState.status_connect]);

  const handleNavigation = (path) => {
    const nextPath = menus.find((item) => item.MENU_PATH === path);
    if (!nextPath) return;
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

  async function getPhotoProfile(id) {
    if (id) {
      await axios
        .get(`/user/photo-profile/${id}`, { responseType: "blob" })
        .then((res) => {
          if (res.status === 200) {
            const picture = URL.createObjectURL(res.data);
            dispatch({
              type: "SET_USER_PHOTO",
              payload: picture,
            });
          }
        })
        .catch((err) => {
          return dispatch({
            type: "SET_USER_PHOTO",
            payload: null,
          });
        });
    }
  }

  useEffect(() => {
    getDataPerusahaan(idPerusahaan);
  }, [idPerusahaan]);

  useEffect(() => {
    getPhotoProfile(activeId);
  }, [activeId]);

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
    reGetPp: () => getPhotoProfile(activeId),
  };

  return (
    <AuthContext.Provider
      value={{ mainState, value, dispatch, handleNavigation }}
    >
      {children}
    </AuthContext.Provider>
  );
};
