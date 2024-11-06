import { useContext } from "react";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import useInterval from "use-interval";
import gifConnect from "../assets/gifConnect.gif";
import gifDisconect from "../assets/gifDisconect.gif";

import { AuthContext } from "../auth/AuthProvider";

const TitleHeader = ({ title }) => {
  const { value, mainState } = useContext(AuthContext);
  const { menus } = value;

  const pathname = window.location.pathname;

  let time = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const [currentTime, setCurrentTime] = useState(time);

  const updateTime = () => {
    let time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(time);
  };

  useInterval(() => {
    updateTime();
  }, 1000);

  function findTitle(path, listMenu) {
    const findMenu = listMenu?.filter((menu) => `/${menu.MENU_PATH}` === path);
    if (findMenu) {
      return findMenu[0]?.MENU_DESC;
    }
  }

  return (
    <Row
      className="m-0 title-header shadow"
      style={{ position: "sticky", top: 0, zIndex: 1 }}
    >
      <Col className="ps-4 p-2">
        <p className="text fs-5 fw-bold mb-0">{findTitle(pathname, menus)}</p>
        {/* <p className="text fs-5 fw-bold mb-0">{title}</p> */}
      </Col>
      <Col
        sm={2}
        className="d-none d-sm-block text-center text border-start border-2 px-0"
      >
        <div className="fw-bold">{currentTime}</div>
        <div style={{ fontSize: "0.8rem" }}>
          {new Date().toLocaleString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </Col>
      <Col sm={1} className="d-none d-sm-block px-0 pt-1 text-center">
        <button
          type="button"
          className="btn btn-light"
          // onClick={handleRemoveSetting}
        >
          <img
            src={mainState.status_connect ? gifConnect : gifDisconect}
            alt="conection"
            style={{ height: 26, width: 26 }}
          ></img>
        </button>
      </Col>
    </Row>
  );
};

export default TitleHeader;
