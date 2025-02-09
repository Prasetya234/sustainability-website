import { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/App.css";
import axios from "../axios/axios";
import "axios-progress-bar/dist/nprogress.css";
import "react-toastify/dist/ReactToastify.css";

// import { GiHamburgerMenu } from "react-icons/gi";
import { Modal, Button, ModalBody, Row, Col } from "react-bootstrap";
import { VscSignOut } from "react-icons/vsc";
import { IconContext } from "react-icons";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";

// import { Message } from "./Message";
import { AuthContext } from "../auth/AuthProvider";
import TitleHeader from "./TitleHeader";

const MainLayout = () => {
  const { value, dispatch } = useContext(AuthContext);
  const { userId, userMode, menus } = value;
  const navigate = useNavigate();
  const [togel, setTogel] = useState(false);
  const [dark, setDark] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);

  const modalClose = () => setModalLogout(false);
  const modalOpen = () => setModalLogout(true);

  async function handleDark() {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    setDark(dark ? false : true);
    const status = {
      USER_DARK_MODE: body.classList.value === "dark" ? "Y" : "N",
    };
    await axios.patch(`user/mode/${userId}`, status);
  }

  function handleToggle() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("closed");
    const subMenu = document.querySelectorAll(".sub-menu");

    if (togel) {
      subMenu.forEach((sub) => {
        sub.classList.remove("showMenu");
      });
    }

    setTogel(togel ? false : true);
  }

  function handleSearchBtn() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("closed");
    setTogel(false);
  }

  function handleSubmenu(idComp) {
    const comp = document.getElementById(idComp);
    comp.classList.toggle("showMenu");
  }

  // function handleBurgerBtn() {
  //   const sidebar = document.querySelector(".sidebar");
  //   sidebar.classList.toggle("showInMd");
  // }

  const logout = async () => {
    await axios
      .delete("/logout")
      .then(() => {
        const body = document.querySelector("body");
        const darkstat = body.classList.value.indexOf("dark");
        if (darkstat > -1) body.classList.remove("dark");
        dispatch({ type: "SET_CONECTION_STATUS", payload: false });
        localStorage.removeItem("token"); // Hapus token dari localStorage
        navigate("/");
      })
      .catch((error) => {
        toast.error("Error Get Data Shift");
      });
  };

  useEffect(() => {
    const body = document.querySelector("body");
    if (userMode === "Y") body.classList.add("dark");
    if (userMode === "N") body.classList.remove("dark");
  }, [userMode]);

  const pathname = window.location.pathname;

  function findTitle(path, listMenu) {   
    const findMenu = listMenu?.filter((menu) => `/${menu.MENU_PATH}` === path && ![1,2].includes(menu.MENU_SUB_KEY));
    if (findMenu) {
      document.title = findMenu[0]?.MENU_TITLE;

      return findMenu[0]?.MENU_TITLE;
    } else {
      document.title = "GBVH";
    }
  }

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");
    
    if(pathname === '/home'){
      sidebar.classList.add("main-menu");
      main.classList.add("main-menu");
    }else{
      sidebar.classList.remove("main-menu");
      main.classList.remove("main-menu");
    }
  }, [pathname])
  

  return (
    <div className="App">
      <Sidebar
        togel={togel}
        dark={dark}
        modalOpen={modalOpen}
        handleDark={handleDark}
        handleToggle={handleToggle}
        handleSearchBtn={handleSearchBtn}
        handleSubmenu={handleSubmenu}
      />

      {/* <div className="header-burger">
        <div className="icon-burger">
          <GiHamburgerMenu onClick={handleBurgerBtn} />
        </div>
      </div> */}

      <div className="main me-0">
        <ToastContainer />
        <TitleHeader />
        <div className="ps-4 pt-4 text-muted fs-5">
          {findTitle(pathname, menus)}
        </div>
        <Outlet />
      </div>

      <Modal
        show={modalLogout}
        onHide={modalClose}
        size="sm"
        centered
        backdropClassName="modallogut-backdrop"
      >
        <ModalBody className="modal-logut">
          <IconContext.Provider value={{ color: "#e3012f" }}>
            <div>
              <VscSignOut size={60} />
            </div>
          </IconContext.Provider>
          <p className="modal-title fs-5 mb-3">Anda yakin akan logout?</p>
          {/* <p>Do you really want Logout ?</p> */}
          <Row className=" justify-content-around">
            <Col>
              <Button variant="secondary" onClick={modalClose}>
                Batal
              </Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={logout}>
                Ya
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <footer>
        {/* <small>
          © {new Date().getFullYear()} Copyright - Asosiasi Pengusaha Kawasan
          Berikat (Semarang)
        </small> */}
        <small>© {new Date().getFullYear()} Copyright - Ontide Corporate</small>
        <br />
      </footer>
    </div>
  );
};

export default MainLayout;
