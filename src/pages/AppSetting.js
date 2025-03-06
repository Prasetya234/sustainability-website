import React, { Fragment, useContext, useEffect, useState } from "react";
import { Col, Image, Nav, Row } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";

const AppSetting = () => {
  const { value } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [tabs, setTabs] = useState("menu");
  const [menuApp, setMenuApp] = useState([]);

  function handleSelTabs(e) {
    setTabs(e);
  }

  async function getMenuApp(idPerusahaan) {
    await axios
      .get(`/appsetting/menu-app/${idPerusahaan}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.data);

          setMenuApp(res.data.data);
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get mobile menu", {
          autoClose: 2500,
        });
      });
  }

  useEffect(() => {
    getMenuApp(idPerusahaan);
  }, [idPerusahaan]);

  return (
    <div>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row>
              <Col>
                <Nav variant="tabs" activeKey={tabs} onSelect={handleSelTabs}>
                  <Nav.Item>
                    <Nav.Link eventKey="menu">App Menu</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="icon">Management Icon</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6}>
                {menuApp
                  ?.filter((item) => !item.MENU_GROUP)
                  .map((menu, i) => (
                    <Fragment key={i}>
                      <div className={`fw-bold ${i !== 0 ? 'pt-4' : ''}`}>{menu.MENU_MODUL}</div>
                      <Row>
                        {menuApp
                          ?.filter(
                            (sub) =>
                              sub.MENU_MODUL === menu.MENU_MODUL &&
                              sub.MENU_GROUP !== null
                          )
                          ?.map((subMenu, idx) => (
                            <Col key={idx} sm={3} className="pt-3">
                              <div className="text-center">
                                <div className="border border-1 rounded-4 py-3 mx-4 bg-secondary bg-opacity-25">
                                  <Image
                                    src={subMenu.iconUrl}
                                    style={{ height: "30px", width: "30px" }}
                                  />
                                </div>
                                <div>{subMenu.MENU_NAME}</div>
                              </div>
                            </Col>
                          ))}
                      </Row>
                    </Fragment>
                  ))}
              </Col>
            </Row>
          </CardShadow>
        </Col>
      </Row>
    </div>
  );
};

export default AppSetting;
