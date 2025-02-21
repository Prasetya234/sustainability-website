import { Dropdown } from "react-bootstrap";
import '../styles/NewDropDown.css'; // import CSS file
import { FaChevronDown } from "react-icons/fa";

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
      <span className="dropdown-label flex items-center text-blue-600 select-none text-primary" style={{ cursor: 'pointer'}}>
              {label} <FaChevronDown className="ml-2" /></span>
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
