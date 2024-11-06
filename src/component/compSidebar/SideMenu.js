import { useNavigate } from "react-router-dom";
const SideMenu = ({ title, link, icon }) => {
  const navigate = useNavigate();

  const handleNavigate = (e, link) => {
    e.stopPropagation();
    navigate(link);
  };

  return (
    <li className="nav-link">
      <div className="a" onClick={(e) => handleNavigate(e, link)}>
        <div className="icon">{icon}</div>
        <div className="text nav-text">{title}</div>
      </div>
    </li>
  );
};

export default SideMenu;
