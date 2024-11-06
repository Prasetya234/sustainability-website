import React from "react";
import { GiClothes, GiSewingMachine } from "react-icons/gi";
import { VscChecklist } from "react-icons/vsc";
import {
  FaWarehouse,
  FaRegListAlt,
  FaCog,
  FaUserCog,
  FaCut,
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { TfiLayoutListThumb, TfiRulerPencil } from "react-icons/tfi";
import { TbChecklist } from "react-icons/tb";
import { SiCodefactor } from "react-icons/si";
import { ImManWoman } from "react-icons/im";
import { BsBoxSeam, BsCalendar2Date } from "react-icons/bs";
import { BiImport } from "react-icons/bi";
import { IoHome } from "react-icons/io5";
import {
  MdDateRange,
  MdSettings,
  MdOutlineManageAccounts,
  MdOutlineQrCode2,
  MdTimer,
} from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  AiOutlineSchedule,
  AiOutlineScan,
  AiOutlineFileDone,
  AiFillDashboard,
  AiOutlineDashboard,
  AiOutlineAppstoreAdd,
} from "react-icons/ai";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImBoxAdd, ImBoxRemove } from "react-icons/im";
const DynamicIcon = ({ name }) => {
  const Icons = [
    { icond: HiBuildingOffice2, names: "HiBuildingOffice2" },
    { icond: AiFillDashboard, names: "AiFillDashboard" },
    { icond: AiOutlineDashboard, names: "AiOutlineDashboard" },
    { icond: AiOutlineAppstoreAdd, names: "AiOutlineAppstoreAdd" },
    { icond: IoHome, names: "IoHome" },
    { icond: GiClothes, names: "GiClothes" },
    { icond: FiPackage, names: "FiPackage" },
    { icond: FaWarehouse, names: "FaWarehouse" },
    { icond: FaRegListAlt, names: "FaRegListAlt" },
    { icond: MdDateRange, names: "MdDateRange" },
    { icond: VscChecklist, names: "VscChecklist" },
    { icond: GiSewingMachine, names: "GiSewingMachine" },
    { icond: SiCodefactor, names: "SiCodefactor" },
    { icond: ImManWoman, names: "ImManWoman" },
    { icond: MdSettings, names: "MdSettings" },
    { icond: MdOutlineManageAccounts, names: "MdOutlineManageAccounts" },
    { icond: HiOutlineClipboardList, names: "HiOutlineClipboardList" },
    { icond: BsBoxSeam, names: "BsBoxSeam" },
    { icond: BiImport, names: "BiImport" },
    { icond: FaCut, names: "FaCut" },
    { icond: FaCog, names: "FaCog" },
    { icond: FaUserCog, names: "FaUserCog" },
    { icond: MdOutlineQrCode2, names: "MdOutlineQrCode2" },
    { icond: AiOutlineSchedule, names: "AiOutlineSchedule" },
    { icond: TfiLayoutListThumb, names: "TfiLayoutListThumb" },
    { icond: MdTimer, names: "MdTimer" },
    { icond: BsCalendar2Date, names: "BsCalendar2Date" },
    { icond: ImBoxAdd, names: "ImBoxAdd" },
    { icond: ImBoxRemove, names: "ImBoxRemove" },
    { icond: AiOutlineScan, names: "AiOutlineScan" },
    { icond: AiOutlineFileDone, names: "AiOutlineFileDone" },
    { icond: TbChecklist, names: "TbChecklist" },
    { icond: TfiRulerPencil, names: "TfiRulerPencil" },
  ];

  const findIcon = Icons.find((ficons) => ficons.names === name);
  if (!findIcon) {
    // Return a default one
    return <GiClothes className="icon" />;
  }

  const IconComponent = findIcon.icond;
  return <IconComponent className="icon" />;
};

export default DynamicIcon;
