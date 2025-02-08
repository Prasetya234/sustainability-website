import React from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const CardListAuth = ({ menuAcces, findValue, arrView, handleCheckbox , handleChecModule}) => {
  return (
    <div>
      <Accordion>
        {menuAcces
          .filter((moduls) => moduls.MENU_SUB_KEY === 1)
          .map((modul, idx) => (
            <Accordion.Item eventKey={modul.MENU_ID} key={idx}>
              <Accordion.Header>
                <Row style={{ width: "50%" }}>
                  <Col sm={6}>{modul.MENU_TITLE}</Col>
                  <Col>
                    {findValue(menuAcces, arrView, modul.MENU_ID) ? (
                      <FaCheckCircle size={16} color="#00cf37"  style={{cursor: 'pointer'}} onClick={() => handleChecModule(modul.MENU_ID)} />
                    ) : (
                      <FaCheckCircle size={16} color="#d2d4d2"  style={{cursor: 'pointer'}} onClick={() => handleChecModule(modul.MENU_ID)} />
                    )}
                  </Col>
                </Row>
              </Accordion.Header>
              <Accordion.Body>
                {menuAcces
                  .filter(
                    (men) =>
                      men.MENU_MODUL === modul.MENU_MODUL &&
                      men.MENU_SUB_KEY !== null &&
                      men.MENU_SUB_KEY === 2
                  )
                  .map((menus, index) => (
                    <div key={index} className="px-lg-5 mb-2">
                      <Row className="border-bottom bg-info bg-opacity-10">
                        <Col sm={10}>{menus.MENU_TITLE}</Col>
                        <Col className="text-end ms-1" sm={1}>
                          <Form.Check // prettier-ignore
                            size="xl"
                            className="fs-5 ms-1"
                            type="switch"
                            checked={findValue(
                              menuAcces,
                              arrView,
                              menus.MENU_ID
                            )}
                            id={`${menus.MENU_ID}`}
                            label=""
                            onChange={(e) => handleCheckbox(e, menus.MENU_ID)}
                          />
                        </Col>
                      </Row>
                      {menuAcces
                        .filter(
                          (sub) =>
                            sub.MENU_CONTROL_ID === modul.MENU_CONTROL_ID &&
                            sub.MENU_GROUP === menus.MENU_GROUP &&
                            sub.MENU_SUB_KEY === 3
                        )
                        .map((menu, ind) => (
                          <div key={ind}>
                            <Row className="border-bottom border-start ms-3 py-1">
                              <Col sm={10}>{menu.MENU_TITLE}</Col>
                              <Col className="text-end" sm={2}>
                                <Form.Check // prettier-ignore
                                  size="xl"
                                  className="fs-5 ms-1"
                                  checked={findValue(
                                    menuAcces,
                                    arrView,
                                    menu.MENU_ID
                                  )}
                                  type="switch"
                                  id={`${menu.MENU_ID}`}
                                  onChange={(e) =>
                                    handleCheckbox(e, menu.MENU_ID)
                                  }
                                  label=""
                                />
                              </Col>
                            </Row>
                            {menuAcces
                              .filter(
                                (sub) =>
                                  sub.MENU_CONTROL_ID ===
                                    modul.MENU_CONTROL_ID &&
                                  sub.MENU_GROUP === menus.MENU_GROUP &&
                                  sub.MENU_GROUP_SUB === menu.MENU_GROUP_SUB &&
                                  sub.MENU_SUB_KEY === 4
                              )
                              .map((menusub, ind) => (
                                <Row
                                  className="border-bottom border-start ms-5 py-1"
                                  key={ind}
                                >
                                  <Col sm={10}>{menusub.MENU_TITLE}</Col>
                                  <Col className="text-end" sm={2}>
                                    {findValue(
                                      menuAcces,
                                      arrView,
                                      menusub.MENU_ID
                                    )}
                                    <Form.Check // prettier-ignore
                                      size="xl"
                                      className="fs-5"
                                      type="switch"
                                      checked={findValue(
                                        menuAcces,
                                        arrView,
                                        menusub.MENU_ID
                                      )}
                                      id={`${menusub.MENU_ID}`}
                                      onChange={(e) =>
                                        handleCheckbox(e, menusub.MENU_ID)
                                      }
                                      label=""
                                    />
                                  </Col>
                                </Row>
                              ))}
                          </div>
                        ))}
                    </div>
                  ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default CardListAuth;
