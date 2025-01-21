import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import logos from "../assets/logosa.png";
import { IoIosArrowForward, IoIosArrowBack, IoIosLogOut } from "react-icons/io";
import { IoSunny, IoMoon } from "react-icons/io5";
// import { RiDashboard2Line } from "react-icons/ri";
import SideMenu from "../component/compSidebar/SideMenu";
import SideSubMenu from "../component/compSidebar/SideSubMenu";
import DynamicIcon from "./DynamicIcon";
const Sidebar = ({
  modalOpen,
  handleDark,
  handleToggle,
  handleSearchBtn,
  togel,
  dark,
}) => {
  const { value, mainState } = useContext(AuthContext);
  const menus = value.menus;

  function findSubMenu(menus, idCtrlSubMenu) {

    if (!menus) return [];
    const resMenu = menus.filter(
      (menu) =>
        menu.MENU_SUB_KEY === 3 && menu.MENU_CONTROL_ID === idCtrlSubMenu
    );

    return resMenu;
  }

  return (
    <nav className="sidebar shadow">
      <header>
        <div className="image-text">
          <span className="image">
            <img
              src={logos}
              alt="logo"
              style={{ width: "50px", height: "50px" }}
            ></img>
          </span>

          {/* <div className="text header-text">
          {togel ? null : (
            <>
              <span className="name">Production System</span>
              <span className="profession">WIP</span>
            </>
          )}
        </div> */}
        </div>
        {togel ? (
          <IoIosArrowForward className="toggle" onClick={handleToggle} />
        ) : (
          <IoIosArrowBack className="toggle" onClick={handleToggle} />
        )}
      </header>

      <div className="menu-bar">
        <div className="menu">
          {/* <li className="search-box" onClick={handleSearchBtn}>
            <IoSearch className="icon" />
            <input type="search" placeholder="Search..." />
          </li> */}
          <div className="search-box p-2 text-center">{mainState.menuActive.MENU_TITLE}</div>

          <ul className="menu-links">
            {findSubMenu(menus, mainState.menuActive.MENU_CONTROL_ID).map(
              (men, i) =>
                men.MENU_SUB_KEY === 2 ? (
                  <SideSubMenu
                    key={men.MENU_ID}
                    idSubMenu={men.MENU_ID}
                    title={men.MENU_TITLE}
                    icon={<DynamicIcon name={men.MENU_ICON} />}
                  >
                    {menus
                      .filter(
                        (menu) =>
                          menu.MENU_GROUP === men.MENU_GROUP &&
                          menu.MENU_SUB_KEY === null
                      )
                      .map((subemen, idx) => (
                        <SideMenu
                          key={subemen.MENU_ID}
                          title={subemen.MENU_TITLE}
                          link={subemen.MENU_PATH}
                          icon={<DynamicIcon name={subemen.MENU_ICON} />}
                        />
                      ))}
                  </SideSubMenu>
                ) : (
                  <SideMenu
                    key={men.MENU_ID}
                    title={men.MENU_TITLE}
                    link={men.MENU_PATH}
                    icon={<DynamicIcon name={men.MENU_ICON} />}
                  />
                )
            )}
          </ul>
        </div>

        <div className="bottom-content">
          <li>
            <div className="a" onClick={modalOpen}>
              <IoIosLogOut className="icon" />
              {togel ? null : <span className="text nav-text">Logout</span>}
            </div>
          </li>
          <li className="mode">
            <div className="moon-sun">
              {dark ? (
                <IoMoon className="icon moon" />
              ) : (
                <IoSunny className="icon sun" />
              )}
            </div>
            {togel ? null : (
              <span className="mode-text text">
                {dark ? "Ligth Mode" : "Dark Mode"}
              </span>
            )}

            <div className="toggle-switch" onClick={handleDark}>
              <span className="switch"></span>
            </div>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
