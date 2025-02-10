import { useState } from "react";
import { motion } from "framer-motion";

import { FaChevronDown } from "react-icons/fa";

const DropdownCus = ({ label, items, dropdownId, activeDropdown, setActiveDropdown  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const isOpen = activeDropdown === dropdownId || isHovered;
    
    return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setActiveDropdown(dropdownId)}
      onClick={() => setActiveDropdown(dropdownId)}
      onMouseLeave={() => {
        setTimeout(() => {
          if (!isHovered) {
            setActiveDropdown(null);
          }
        }, 200); // Small delay to ensure dropdown stays open when moving to menu
      }}    >
      <div className="flex items-center text-blue-600 select-none text-primary" style={{ cursor: 'pointer'}}>
        {label} <FaChevronDown className="ml-2" />
      </div>
      <motion.ul
        initial={{ opacity: 0, y: -10 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`absolute ps-0 py-2 mt-2 w-48 bg-white shadow-lg rounded overflow-hidden z-50 list-none ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ position: "absolute", listStyle: "none" ,  pointerEvents: isOpen ? 'auto' : 'none' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveDropdown(null);
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-blue-200 cursor-pointer transition-colors"
            style={{cursor: 'pointer'}}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#bfdbfe")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={item.actExe}
          >
            {item.actionLable}
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default DropdownCus;
