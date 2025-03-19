import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Nav, Row } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import { MdCheckCircle, MdDelete, MdEditSquare } from "react-icons/md";
import { AuthContext } from "../auth/AuthProvider";
import Swal from "sweetalert2";
import ModalChangeBg from "../component/appsetting/ModalChangeBg";
import MangementIcons from "../component/appsetting/MangementIcons";
import ModalUploadIco from "../component/appsetting/ModalUploadIco";
const initialObj = {
  THEME_NAME: "",
  THEME_DESCRIPTION: "",
};
const AppSetting = () => {
  const { value } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [tabs, setTabs] = useState("menu");
  const [menuApp, setMenuApp] = useState([]);
  const [themesSelect, setThemseSelect] = useState("");
  const [themes, setThemes] = useState([]);
  const [icons, setIcons] = useState([]);
  const [listBgHeader, setListBgHeader] = useState([]);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [showMdlTheme, setShowMdlTheme] = useState(false);
  const [mdlChgBg, setMdlChgBg] = useState(false);
  const [validated, setValidated] = useState(false);
  const [mdlUplIco, setMdlUplIco] = useState(false);
  const [objNewTheme, setObjNewTheme] = useState(initialObj);
  const [metodeTheme, setMethodeTheme] = useState("post");

 
  async function getMenuApp(idPerusahaan, themeId) {
    let urls = `/appsetting/menu-app/${idPerusahaan}`;
    if (themeId) {
      urls = urls + `?idTheme=${themeId}`;
    }
    await axios
      .get(urls)
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


  async function getListIcons(idPerusahaan) {
    let urls = `/appsetting/list-icons/${idPerusahaan}`;
 
    await axios
      .get(urls)
      .then((res) => {
        if (res.status === 200) {
          setIcons(res.data.data);
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get mobile menu", {
          autoClose: 2500,
        });
      });
  }


  function handleSelTabs(e) {
    if(e === 'icon'){
      getListIcons(idPerusahaan)
    }
    setTabs(e);
  }


  async function getThemes(idPerusahaan) {
    await axios
      .get(`/appsetting/themes/${idPerusahaan}`)
      .then((res) => {
        if (res.status === 200) {
          setThemes(res.data.data);
          if (!themesSelect) {
            const activeTheme = res.data.data.filter(
              (item) => item.THEME_ACTIVED === 1
            );
            if (activeTheme.length > 0) {
              setThemseSelect(activeTheme[0].THEME_ID);
            }
          }
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get themes menu", {
          autoClose: 2500,
        });
      });
  }

  useEffect(() => {
    async function getThemes1(idPerusahaan) {
      await axios
        .get(`/appsetting/themes/${idPerusahaan}`)
        .then((res) => {
          if (res.status === 200) {
            setThemes(res.data.data);
            if (!themesSelect) {
              const activeTheme = res.data.data.filter(
                (item) => item.THEME_ACTIVED === 1
              );
              if (activeTheme.length > 0) {
                setThemseSelect(activeTheme[0].THEME_ID);
              }
            }
          }
        })
        .catch((err) => {
          return toast.error("Somthing wrong when get themes menu", {
            autoClose: 2500,
          });
        });
    }
    getMenuApp(idPerusahaan);
    getThemes1(idPerusahaan);
  }, [idPerusahaan, themesSelect]);

  async function getBgHeader(idPerusahaan) {
    await axios
      .get(`/appsetting/bg-image/${idPerusahaan}`)
      .then((res) => {
        if (res.status === 200) {
          
          setListBgHeader(res.data.data);
          setMdlChgBg(true);

        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when get header background", {
          autoClose: 2500,
        });
      });
    }

  function hdlSelTheme(e, idPerusahaan) {
    setThemseSelect(e);
    getMenuApp(idPerusahaan, e);
  }

  function openMdlThemes(id) {
    setShowMdlTheme(true);
  }

  function hdlCLsMdlTheme() {
    setShowMdlTheme(false);
    setObjNewTheme(initialObj);
    setValidated(false);
    setMethodeTheme("post");
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      const dataPost = {
        ...objNewTheme,
        ID_PERUSAHAAN: idPerusahaan,
        THEME_ADD_ID: metodeTheme === "post" ? userId : null,
        THEME_MOD_ID: metodeTheme === "patch" ? userId : null,
      };

      if (metodeTheme === "post") {
        delete dataPost.THEME_MOD_ID;
      } else {
        delete dataPost.THEME_ADD_ID;
      }

      delete (await axios[metodeTheme](`/appsetting/themes`, dataPost)
        .then((res) => {
          if (res.status === 200) {
            getThemes(idPerusahaan);
            hdlCLsMdlTheme();
            toast.success(res.data.message, { autoClose: 2000 });
          }
        })
        .catch((err) => {
          return toast.error("Somthing wrong when get themes menu", {
            autoClose: 2500,
          });
        }));
    }
  };

  function hdlChgFormTheme(e) {
    const { name, value } = e.target;

    if (name === "THEME_NAME" && value.length === 25) return;
    if (name === "THEME_DESCRIPTION" && value.length === 50) return;
    setObjNewTheme((prev) => ({ ...prev, [name]: value }));
  }

  async function handleDelThme(id) {
    Swal.fire({
      text: `Are You Sure Delete Theme ?`,
      icon: "question",
      confirmButtonColor: "#2275f2",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`/appsetting/themes/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getThemes(idPerusahaan);
              toast.success(res.data.message, { autoClose: 2000 });
            }
          })
          .catch((err) => {
            return toast.error("Somthing wrong when delete themes", {
              autoClose: 2500,
            });
          });
      }
    });
  }

  function openMdledite(theme) {
    setObjNewTheme(theme);
    setShowMdlTheme(true);
    setMethodeTheme("patch");
  }

  async function handleActived(dataTheme) {
    Swal.fire({
      text: `Are You Sure Actived This Theme ?`,
      icon: "question",
      confirmButtonColor: "#2275f2",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .patch(`/appsetting/themes-actived`, dataTheme)
          .then((res) => {
            if (res.status === 200) {
              getThemes(dataTheme.ID_PERUSAHAAN);
              toast.success(res.data.message, { autoClose: 2000 });
            }
          })
          .catch((err) => {
            return toast.error("Somthing wrong when actived themes", {
              autoClose: 2500,
            });
          });
      }
    });
  }

  async function activeMenu(accessId, check, themesId) {
    const valActive = check ? 1 : 0;

    await axios
      .patch(`/appsetting/active-menu`, { accessId, valActive })
      .then((res) => {
        if (res.status === 200) {
          getMenuApp(idPerusahaan, themesId);
          //        toast.success(res.data.message, { autoClose: 2000 });
        }
      })
      .catch((err) => {
        return toast.error("Somthing wrong when actived themes", {
          autoClose: 2500,
        });
      });
  }

  function opnMdlChgBg(id) {
    getBgHeader(id)
  }
  function hdlClsMdlChgBg() {
    setMdlChgBg(false);
  }

  function pharsingImgView(listImg){
    if(!listImg) return []

    return listImg.map(item => ({
      original : item.bgUrl,
      thumbnail : item.bgUrl,
      bgId : item.BG_ID,
      headerName : item.BG_HEADER_FILE,
      themesSelect : themesSelect
    }))
  }

  function opnUplIco(){
    setMdlUplIco(true)
  }

  function hdlClsMdlUplIco(){
    setMdlUplIco(false)
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
                    onClick={() => openMdlThemes()}
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
                        onClick={(e) => hdlSelTheme(thm.THEME_ID, idPerusahaan)}
                      >
                        <Row>
                          <Col className="align-content-center">
                            <div className="fs-6">
                              {thm.THEME_NAME}{" "}
                              {thm.THEME_ACTIVED ? (
                                <span>
                                  <MdCheckCircle color="green" size={16} />
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <div>{thm.THEME_DESCRIPTION}</div>
                          </Col>
                          <Col sm={4} className="align-content-center text-end">
                            <Button
                              size="sm"
                              className="me-1"
                              disabled={!thm.THEME_ALLOW_EDIT}
                              variant={
                                isHovered || isSelected
                                  ? "outline-light"
                                  : "outline-secondary"
                              }
                              onClick={(e) => {
                                e.stopPropagation(); // Hindari trigger onClick parent
                                openMdledite(thm);
                              }}
                            >
                              <MdEditSquare size={14} />
                            </Button>
                            <Button
                              size="sm"
                              className="me-1"
                              disabled={!thm.THEME_ALLOW_DELETE}
                              variant={
                                isHovered || isSelected
                                  ? "outline-light"
                                  : "outline-secondary"
                              }
                              onClick={(e) => {
                                e.stopPropagation(); // Hindari trigger onClick parent
                                handleDelThme(thm.THEME_ID);
                              }}
                            >
                              <MdDelete size={14} />
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
                                handleActived(thm);
                              }}
                            >
                              <MdCheckCircle size={14} />
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
                    <Nav.Link eventKey="icon">Management Icons</Nav.Link>
                  </Nav.Item>
                </Nav>
                {tabs === 'menu' ? 
                <Row className="mt-3">
                  <Col sm={8}>
                    <div className="mb-3 text-center">
                      <div>Background Header App</div>
                      {themesSelect
                        ? themes
                            .filter((item) => item.THEME_ID === themesSelect)
                            .map((bg) => (
                              <div key={bg.THEME_ID } className="mb-2">
                                <Image
                                  src={bg.iconUrl}
                                  style={{
                                    height: "150px",
                                    width: "200px",
                                  }}
                                />
                              </div>
                            ))
                        : ""}
                      <div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => opnMdlChgBg(idPerusahaan)}
                        >
                          Change Or Upload
                        </Button>
                      </div>
                    </div>
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
                                    <div>
                                      <Form.Check // prettier-ignore
                                        type="switch"
                                        id={`${subMenu.MENU_ID}`}
                                        checked={subMenu.ACCESS_MOBILE}
                                        onChange={(e) =>
                                          activeMenu(
                                            subMenu.ACCESS_ID,
                                            e.target.checked,
                                            themesSelect
                                          )
                                        }
                                      />
                                    </div>
                                    <div
                                      className={`border border-1 rounded-4 py-3 mx-4 bg-opacity-25 ${
                                        subMenu.ACCESS_MOBILE
                                          ? ""
                                          : "bg-secondary"
                                      }`}
                                    >
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
                : 
                <MangementIcons menuApp={menuApp} icons={icons} setMenuApp={setMenuApp} opnUplIco={opnUplIco} getMenuApp={getMenuApp} idPerusahaan={idPerusahaan} themeId={themesSelect}/>
                }
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
                <Form.Control
                  required
                  type="text"
                  name="THEME_NAME"
                  value={objNewTheme.THEME_NAME}
                  onChange={hdlChgFormTheme}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="thmedesc">
                <Form.Label>Theme Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="THEME_DESCRIPTION"
                  value={objNewTheme.THEME_DESCRIPTION}
                  onChange={hdlChgFormTheme}
                />
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
      <ModalChangeBg listBgHeader={pharsingImgView(listBgHeader)} mdlChgBg={mdlChgBg} hdlClsMdlChgBg={hdlClsMdlChgBg} 
      refresTheme={() => getThemes(idPerusahaan)}
      refresImg={() => opnMdlChgBg(idPerusahaan)}
       />
       <ModalUploadIco mdlUplIco={mdlUplIco} hdlClsMdlUplIco={hdlClsMdlUplIco} idPerusahaan={idPerusahaan} userId={userId} getListIcons={getListIcons}/>
    </div>
  );
};

export default AppSetting;
