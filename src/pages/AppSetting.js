import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Nav, Row } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { AuthContext } from "../auth/AuthProvider";
const initialObj = {
  THEME_NAME: '',
  THEME_DESCRIPTION: ''
}
const AppSetting = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;
  const [tabs, setTabs] = useState("menu");
  const [menuApp, setMenuApp] = useState([]);
  const [themesSelect, setThemseSelect] = useState("default");
  const [themes, setThemes] = useState([]);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [showMdlTheme, setShowMdlTheme] = useState(false);
  const [validated, setValidated] = useState(false);
  const [objNewTheme, setObjNewTheme] = useState(initialObj);

  function handleSelTabs(e) {
    setTabs(e);
  }

  async function getMenuApp(idPerusahaan) {
    await axios
      .get(`/appsetting/menu-app/${idPerusahaan}`)
      .then((res) => {
        if (res.status === 200) {
          setMenuApp(res.data.data);
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get mobile menu", {
          autoClose: 2500,
        });
      });
  }

  async function getThemes(idPerusahaan) {
    await axios
      .get(`/appsetting/themes/${idPerusahaan}`)
      .then((res) => {
        if (res.status === 200) {
          setThemes(res.data.data);
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get themes menu", {
          autoClose: 2500,
        });
      });
  }

  useEffect(() => {
    getMenuApp(idPerusahaan);
    getThemes(idPerusahaan);
  }, [idPerusahaan]);

  function hdlSelTheme(e) {
    setThemseSelect(e);
  }

  function openMdlThemes() {
    setShowMdlTheme(true);
  }
  function hdlCLsMdlTheme() {
    setShowMdlTheme(false);
    setObjNewTheme(initialObj)
    setValidated(false)
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      
    }else{
      const dataPost = {
        ...objNewTheme,
        ID_PERUSAHAAN: idPerusahaan
      }
      await axios
      .post(`/appsetting/themes`, dataPost)
      .then((res) => {
        if (res.status === 200) {
          getThemes(idPerusahaan);
          hdlCLsMdlTheme()
          toast.success(res.data.message, {autoClose: 2000})
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get themes menu", {
          autoClose: 2500,
        });
      });    }

  };

  function hdlChgFormTheme(e){
    const {name, value} = e.target
    
    if(name === 'THEME_NAME' && value.length === 25) return;
    if(name === 'THEME_DESCRIPTION' && value.length === 50) return;
    setObjNewTheme((prev) => ({ ...prev, [name]: value }));
  }
  return (
    <div>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row>
              <Col sm={4} className="ms-2 border rounded-2 shadow-sm pt-1">
                <div className="fw-bold my-2 border-bottom pb-1">
                  List Of Theme
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openMdlThemes("Primary")}
                  >
                    Create Theme
                  </Button>
                </div>
                <div className="mt-2">
                    {themes?.map((thm) => {
                      const isSelected = themesSelect === thm.THEME_ID;
                      const isHovered = hoveredTheme === thm.THEME_ID;

                      return (
                        <div
                          key={thm.THEME_ID}
                          className={`p-2 border mt-2 rounded-3 ${
                            isSelected ? "bg-primary text-light" : ""
                          }`}
                          onMouseEnter={() => setHoveredTheme(thm.THEME_ID)}
                          onMouseLeave={() => setHoveredTheme(null)}
                          id={thm.THEME_ID}
                          style={{
                            backgroundColor:
                              isHovered && !isSelected ? "#007bff" : "",
                            color: isHovered && !isSelected ? "white" : "",
                            cursor: "pointer",
                            transition: "background-color 0.3s, color 0.3s",
                          }}
                          onClick={(e) => hdlSelTheme(thm.THEME_ID)}
                        >
                          <Row>
                            <Col className="align-content-center">
                              <div className="fs-6">{thm.THEME_NAME}</div>
                              <div>{thm.THEME_DESCRIPTION}</div>
                            </Col>
                            <Col
                              sm={4}
                              className="align-content-center text-end"
                            >
                              <Button
                                size="sm"
                                className="me-1"
                                variant={
                                  isHovered || isSelected
                                    ? "outline-light"
                                    : "outline-secondary"
                                }
                                onClick={(e) => {
                                  e.stopPropagation(); // Hindari trigger onClick parent
                                  console.log("Edit");
                                }}
                              >
                                <MdEditSquare size={14} />
                              </Button>
                              <Button
                                size="sm"
                                className="me-1"
                                variant={
                                  isHovered || isSelected
                                    ? "outline-light"
                                    : "outline-secondary"
                                }
                                onClick={(e) => {
                                  e.stopPropagation(); // Hindari trigger onClick parent
                                  console.log("Delete");
                                }}
                              >
                                <MdDelete size={14} />
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                </div>
              </Col>
              <Col className="border rounded-2 shadow-sm ms-2 pt-1 pb-2">
                <Nav variant="tabs" activeKey={tabs} onSelect={handleSelTabs}>
                  <Nav.Item>
                    <Nav.Link eventKey="menu">App Menu</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="icon">Management Icon</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Row className="mt-3">
                  <Col sm={8}>
                    {menuApp
                      ?.filter((item) => !item.MENU_GROUP)
                      .map((menu, i) => (
                        <Fragment key={i}>
                          <div className={`fw-bold ${i !== 0 ? "pt-4" : ""}`}>
                            {menu.MENU_MODUL}
                          </div>
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
                                        style={{
                                          height: "30px",
                                          width: "30px",
                                        }}
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
              </Col>
            </Row>
          </CardShadow>
        </Col>
      </Row>
      <Modal size="sm" show={showMdlTheme} onHide={hdlCLsMdlTheme}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Create New Theme</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="thmename">
                <Form.Label>Theme Name*</Form.Label>
                <Form.Control required type="text" name="THEME_NAME" value={objNewTheme.THEME_NAME} onChange={hdlChgFormTheme} />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="thmedesc">
                <Form.Label>Theme Description</Form.Label>
                <Form.Control as="textarea" name="THEME_DESCRIPTION" value={objNewTheme.THEME_DESCRIPTION} onChange={hdlChgFormTheme}/>
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button size="sm" variant="secondary" onClick={hdlCLsMdlTheme}>
              Close
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AppSetting;
