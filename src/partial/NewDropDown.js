import { Dropdown } from "react-bootstrap";
import '../styles/NewDropDown.css'; // import CSS file

const NewDropDown = ({
  label,
  items,
  dropdownId,
  activeDropdown,
  setActiveDropdown,
}) => {
  const handleMouseEnter = () => {
    setActiveDropdown(dropdownId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <Dropdown
      className="custom-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      show={activeDropdown === dropdownId}
    >
      <span className="dropdown-label">{label}</span>
      <Dropdown.Menu className="dropdown-menu">
        {items.map((item, index) => (
          <Dropdown.Item key={index} onClick={item.actExe}>
            {item.actionLable}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NewDropDown;
