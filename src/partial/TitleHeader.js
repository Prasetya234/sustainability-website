import { useContext, useState } from "react";
// import { useState } from "react";
import { Row, Col, } from "react-bootstrap";
// import useInterval from "use-interval";
// import gifConnect from "../assets/gifConnect.gif";
// import gifDisconect from "../assets/gifDisconect.gif";

import { AuthContext } from "../auth/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TitleHeader = ({ title, modalOpen }) => {
  const { value, mainState, dispatch, handleNavigation } = useContext(AuthContext);
  const { menus } = value;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // const navigate = useNavigate();

  const handleMouseEnter = (e) => setShowDropdown(e);
  const handleMouseLeave = () => {
    setShowDropdown(false);
    // setTimeout(() => {
    // }, 200);
  };

  // let time = new Date().toLocaleTimeString("en-US", {
  //   hour12: false,
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  // const [currentTime, setCurrentTime] = useState(time);

  // const updateTime = () => {
  //   let time = new Date().toLocaleTimeString("en-US", {
  //     hour12: false,
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  //   setCurrentTime(time);
  // };

  // useInterval(() => {
  //   updateTime();
  // }, 1000);

  function findGroupMenu(menus, maxCtrId) {
    if (!menus) return [];
    const groupMenu = menus.filter(
      (menu) => !menu.MENU_GROUP && menu.MENU_CONTROL_ID < maxCtrId
    );
    return groupMenu;
  }
  function findGroupMenuSa(menus) {
    if (!menus) return [];
    const groupMenu = menus.filter(
      (menu) => !menu.MENU_GROUP && menu.MENU_CONTROL_ID === 888
    );

    return groupMenu;
  }

  function findSubGroup(menus, grpCtrlId) {
    if (!menus) return [];
    const subGroup = menus.filter(
      (menu) => menu.MENU_SUB_KEY === 2 && menu.MENU_CONTROL_ID === grpCtrlId
    );
    return subGroup;
  }

  const handleNavigate = (e, menu) => {
    e.stopPropagation();
    dispatch({
      type: "SET_ACTIVE_MENU",
      payload: menu,
    })
    
    //handling dimana ketika user klik menu group maka check dahulu apaka user memiliki akses ke sub
    const listMenuSubGrp = menus.filter(item => item.MENU_GROUP === menu.MENU_GROUP && item.MENU_SUB_KEY !== 2)
    if(listMenuSubGrp.length > 0){
      const path = listMenuSubGrp[0].MENU_PATH
      return handleNavigation(path);
    }else{
      return  toast.warning("You don't any access to this sub group menu")
    }
    
    
  };

  return (
    <Row
      className="m-0 title-header shadow "
      style={{ position: "sticky", top: 0, zIndex: 1 }}
    >
      <Col className="ps-4">
        <nav className="custom-navbar p-3 text">
          {/* <div className="nav-brand">MyBrand</div> */}
          <ul className="nav-links">
            {/* <li className="nav-item">
              <a href="#home">Home</a>
            </li> */}
            {findGroupMenu(menus, 100)?.map((menu) => (
              <li
                key={menu.MENU_ID}
                className="nav-item dropdown"
                onMouseEnter={() => handleMouseEnter(menu.MENU_ID)}
                onClick={() => handleMouseEnter(menu.MENU_ID)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="dropdown-title">
                  {menu.MENU_TITLE}
                  <i
                    className={`arrow ${
                      showDropdown === menu.MENU_ID ? "up" : "down"
                    }`}
                  >
                    <IoMdArrowDropdown />
                  </i>
                </span>
                <ul
                  className={`dropdown-menu px-3 ${
                    showDropdown === menu.MENU_ID ? "show" : ""
                  }`}
                >
                  {findSubGroup(menus, menu.MENU_CONTROL_ID)?.map((subGrp) => (
                       <li key={subGrp.MENU_ID}>
                       <div
                         className="a"
                         onClick={(e) =>
                           handleNavigate(e, subGrp)
                         }
                       >
                         {subGrp.MENU_TITLE}
                       </div>
                     </li>
                  ))}
                </ul>
              </li>
            ))}
            {mainState.userLevel === "sa"
              ? findGroupMenuSa(menus)?.map((menu) => (
                  <li
                    key={menu.MENU_ID}
                    className="nav-item dropdown"
                    onMouseEnter={() => handleMouseEnter(menu.MENU_ID)}
                    onClick={() => handleMouseEnter(menu.MENU_ID)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="dropdown-title">
                      {menu.MENU_TITLE}
                      <i
                        className={`arrow ${
                          showDropdown === menu.MENU_ID ? "up" : "down"
                        }`}
                      >
                        <IoMdArrowDropdown />
                      </i>
                    </span>
                    <ul
                      className={`dropdown-menu px-3 ${
                        showDropdown === menu.MENU_ID ? "show" : ""
                      }`}
                    >
                      {findSubGroup(menus, menu.MENU_CONTROL_ID)?.map(
                        (subGrp) => (
                          <li key={subGrp.MENU_ID}>
                            <div
                              className="a"
                              onClick={(e) =>
                                handleNavigate(e, subGrp)
                              }
                            >
                              {subGrp.MENU_TITLE}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                ))
              : ""}
          </ul>
        </nav>
      </Col>
      <Col sm={1} className=" px-0 pt-1 text-end me-2">
  <div
    className="user-dropdown"
    onMouseEnter={() => setShowUserDropdown(true)}
    onMouseLeave={() => setShowUserDropdown(false)}
  >
    <button type="button" className="btn btn-light">
      {mainState.userImg ? (
        <img
          src={mainState.userImg}
          alt="user"
          style={{ height: 26, width: 26, borderRadius: "50%" }}
        />
      ) : (
        <FaRegUserCircle size={26} color="#95B1BD" />
      )}
    </button>
    <ul className={`dropdown-menu ${showUserDropdown ? "show" : ""}`}>
      <li>
        <button className="dropdown-item" onClick={() => console.log("Profile")}>
          Profile
        </button>
      </li>
      <li>
        <button className="dropdown-item" onClick={() => console.log("Settings")}>
          Settings
        </button>
      </li>
      <li>
        <button className="dropdown-item" onClick={() => modalOpen("Logout")}>
          Logout
        </button>
      </li>
    </ul>
  </div>
</Col>

    </Row>
  );
};

export default TitleHeader;
