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
      default:
        return mainState;
    }
  };

  const [mainState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const refreshToken = async () => {
      return await axios
        .get(`/token`)
        .then((response) => {
          setToken(response.data.apkbAcssToken);
          // const token = "eyJhsw5c";
          // const decoded = jwt_decode(token);
          const decoded = jwt_decode(response.data.apkbAcssToken);

          setActiveId(decoded.userId);
          setActiveUser(decoded.username);
          setExpire(decoded.exp);
          setUserInisial(decoded.userInisial);
          setUserNpwp(decoded.userNpwp);
          // setUserCeisa(decoded.userCeisa);
          // setUserPassCeisa(decoded.userPassCeisa);
          setUserMode(decoded.userMode);
          setUserPath(decoded.userPath);
          setIdPerusahaan(decoded.idPerusahaan);
          dispatch({ type: "GET_USER_LEVEL", payload: decoded.userLevel });

          axios
            .get(`/useraccess/menuview/${decoded.userId}`)
            .then((response) => {
              if (response.status === 400) return navigate("/home");
              const checkMenuDok = response.data.filter(
                (men) => men.MENU_MODUL === "DOCUMENT"
              );

              if (checkMenuDok.length > 0) {
                const newMenuPath = [
                  ...response.data,
                  { MENU_PATH: "inputdokumen", MENU_DESC: "Input Dokumen" },
                ];
                setMenus(newMenuPath);
              } else {
                setMenus(response.data);
              }
            });

          if (decoded.userCeisa || decoded.userPassCeisa) {
            dispatch({ type: "SET_CONECTION_STATUS", payload: true });
          } else {
            dispatch({ type: "SET_CONECTION_STATUS", payload: false });
          }
        })
        .catch((error) => {
          if (error.response) return navigate("/");
        });
    };
    refreshToken();
  }, [navigate, mainState.status_connect]);

  // async function refreshTokenCeisa() {
  //   if (!userCeisa || !userPassCeisa)
  //     return toast.success("User Password Ceisa 4.0 belum di setting", {
  //       autoClose: 3000,
  //     });
  //   const dataUSerCeisa = {
  //     username: userCeisa,
  //     password: userPassCeisa,
  //   };

  //   Axios.post(
  //     `https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login`,
  //     dataUSerCeisa
  //   )
  //     .then((res) => {
  //       if (res.data.status === "success") {
  //         const { access_token, expires_in, refresh_token } = res.data.item;
  //         dispatch({ type: "SET_TOKEN", payload: access_token });
  //         dispatch({ type: "SET_REFTOKEN", payload: refresh_token });
  //         dispatch({ type: "SET_EXPIRED", payload: expires_in });
  //         dispatch({ type: "SET_CONECTION_STATUS", payload: true });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       dispatch({ type: "SET_CONECTION_STATUS", payload: false });
  //     });
  // }

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
        .catch((err) => console.log(err.data));
    }
  }

  useEffect(() => {
    getDataPerusahaan(idPerusahaan);
  }, [idPerusahaan]);

  const loadingOn = () => {
    dispatch({ type: "LAUNCH_LOADING", payload: true });
  };
  const loadingOff = () => {
    dispatch({ type: "LAUNCH_LOADING", payload: false });
  };

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
    loadingOn: loadingOn,
    loadingOff: loadingOff,
  };

  return (
    <AuthContext.Provider value={{ mainState, value, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
