import { useContext, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../auth/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbars = ({ modalOpen, handleOpUserProfile }) => {
  const { value, mainState, dispatch, handleNavigation } = useContext(AuthContext);
  const { menus } = value;
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  let closeTimeout = null; // Variabel untuk menyimpan timer

  function findGroupMenu(menus, maxCtrId) {
    return menus?.filter(menu => !menu.MENU_GROUP && menu.MENU_CONTROL_ID < maxCtrId) || [];
  }

  function findSubGroup(menus, grpCtrlId) {
    return menus?.filter(menu => menu.MENU_SUB_KEY === 2 && menu.MENU_CONTROL_ID === grpCtrlId) || [];
  }

  const handleNavigate = (e, menu) => {
    e.stopPropagation();
    dispatch({ type: "SET_ACTIVE_MENU", payload: menu });
    const listMenuSubGrp = menus.filter(item => item.MENU_GROUP === menu.MENU_GROUP && item.MENU_SUB_KEY !== 2);
    if (listMenuSubGrp.length > 0) {
      return handleNavigation(listMenuSubGrp[0].MENU_PATH);
    } else {
      return toast.warning("You don't have access to this sub group menu");
    }
  };

  const handleMouseEnter = (menuId) => {
    clearTimeout(closeTimeout); // Hentikan timer jika ada
    setActiveDropdown(menuId);
    if(menuId === activeDropdown){
      setActiveDropdown(null)
    }
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // Beri waktu 300ms sebelum menutup dropdown
  };

  return (
    <Navbar expand="lg" sticky="top" className="shadow navbar-main">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {findGroupMenu(menus, 100).map(menu => (
              <NavDropdown
                key={menu.MENU_ID}
                title={menu.MENU_TITLE}
                id={`dropdown-${menu.MENU_ID}`}
                show={activeDropdown === menu.MENU_ID}
                onMouseEnter={() => handleMouseEnter(menu.MENU_ID)}
                onClick={() => handleMouseEnter(menu.MENU_ID)}
                onMouseLeave={handleMouseLeave}
              >
                <div onMouseEnter={() => clearTimeout(closeTimeout)} onMouseLeave={handleMouseLeave}>
                  {findSubGroup(menus, menu.MENU_CONTROL_ID).map(subGrp => (
                    <NavDropdown.Item key={subGrp.MENU_ID} onClick={(e) => handleNavigate(e, subGrp)}>
                      {subGrp.MENU_TITLE}
                    </NavDropdown.Item>
                  ))}
                </div>
              </NavDropdown>
            ))}
          </Nav>
          <Nav>
            <NavDropdown
              title={
                mainState.userImg ? (
                  <img src={mainState.userImg} alt="user" style={{ height: 26, width: 26, borderRadius: "50%" }} />
                ) : (
                  <FaRegUserCircle size={26} color="#95B1BD" />
                )
              }
              id="user-dropdown"
              align="end"
              show={showUserDropdown}
              onMouseEnter={() => setShowUserDropdown(true)}
              onClick={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <NavDropdown.Item onClick={() => handleOpUserProfile()}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={() => console.log("Settings")}>Settings</NavDropdown.Item>
              <NavDropdown.Item onClick={() => modalOpen("Logout")}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbars;
