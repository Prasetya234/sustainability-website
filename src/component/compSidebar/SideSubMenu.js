// import { Outlet } from "react-router-dom";

import { IoIosArrowDown } from "react-icons/io";

const SideSubMenu = ({ title, icon, idSubMenu, children }) => {
  function handleSubmenu(idComp) {
    const comp = document.getElementById(idComp);
    comp.classList.toggle("showMenu");
  }
  return (
    <div className="sub-menu" id={idSubMenu}>
      <li className="nav-link" onClick={(e) => handleSubmenu(idSubMenu)}>
        <div className="a">
          {icon}
          <div className="text nav-text">{title}</div>
        </div>
        <div className="arrow-expand">
          <IoIosArrowDown />
        </div>
      </li>
      <div className="sub-link">
        <ul>{children}</ul>
      </div>
    </div>
  );
};

export default SideSubMenu;
