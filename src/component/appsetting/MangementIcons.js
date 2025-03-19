import axios from "../../axios/axios";
import React, { Fragment, useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { toast } from "react-toastify";

const MangementIcons = ({ menuApp, icons, setMenuApp, opnUplIco, getMenuApp, idPerusahaan, themeId}) => {
  const [qryIco, setQryIco] = useState("");
  const [icoForChg, setIcoForChg] = useState({});

  function hdlSearchIco(qry, icon) {
    if (!qry) return icon;
    return icon.filter(
      (ico) =>
        ico.ICON_NAME.toLowerCase().includes(qry.toLowerCase()) ||
        ico.ICON_IMG.toLowerCase().includes(qry.toLowerCase())
    );
  }

  function hdlChgQry(e) {
    const { value } = e.target;
    setQryIco(value);
  }

  function hdlIcoSel(e) {
    setIcoForChg(e);
  }

  function handleSelIco(menus, accId, icoSelect) {
    if (!icoSelect) return;
    
    let newMenus = [...menus];
    const findIdx = newMenus.findIndex((item) => item.ACCESS_ID === accId);
    const { ICON_ID, iconImg , ICON_IMG} = icoSelect;
    newMenus[findIdx] = { ...newMenus[findIdx], ICON_ID, iconImg, ICON_IMG };
    return setMenuApp(newMenus);
  }

  function clearChange(menus) {
    const clearMenu = menus.map(({ ICON_ID, iconImg, ICON_IMG, ...rest }) => rest);
    setMenuApp(clearMenu);
  }

  function activActionChage(menus) {
    const checkChg = menus.filter((item) => item.ICON_ID);
    if (checkChg.length > 0) {
      return false;
    } else {
      return true;
    }
  }

 async function handeSaveChg(listNewMenu){
    const filterChg = listNewMenu.filter(item => item.ICON_IMG)
  
    if(filterChg.length === 0) return;
    const chgIcons = filterChg.map(item=> ({...item, MENU_IMG : item.ICON_IMG}))
    const iconList = {icons : chgIcons}
    await axios.patch('/appsetting/chg-icons', iconList)
    .then(res => {
      if(res.status === 200){
        getMenuApp(idPerusahaan, themeId)
        toast.success(res.data.message, {autoClose: 2000})
      }
    }).catch(err => {
      toast.error('Filed change Icons', {autoClose: 2000})
    })

  }
  return (
    <Row>
      <Col>
        <Row>
          <Col sm={4} className="mt-2">
            <Row>
              <Col className="text-start">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={activActionChage(menuApp)}
                  onClick={() => clearChange(menuApp)}
                >
                  Cancel
                </Button>
              </Col>
              <Col className="text-end me-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={activActionChage(menuApp)}
                  onClick={() => handeSaveChg(menuApp)}
                >
                  Save
                </Button>
              </Col>
            </Row>
            <div
              className="mt-2"
              style={{ height: "78vh", overflow: "scroll" }}
            >
              {menuApp
                ?.filter((item) => !item.MENU_GROUP)
                .map((menu, i) => (
                  <Fragment key={i}>
                    <div className={`fw-bold ${i !== 0 ? "pt-4" : ""}`}>
                      {menu.MENU_MODUL}
                    </div>
                    {menuApp
                      ?.filter(
                        (sub) =>
                          sub.MENU_MODUL === menu.MENU_MODUL &&
                          sub.MENU_GROUP !== null
                      )
                      ?.map((subMenu, idx) => (
                        <Row key={idx} className="my-2">
                          <Col>
                            <div className="text-center">
                              <div
                                className={`border border-1 rounded-4 py-3 mx-2 bg-opacity-25 ${
                                  subMenu.ACCESS_MOBILE ? "" : "bg-secondary"
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
                          <Col
                            className="justify-content-center mt-4 text-center"
                            sm={2}
                          >
                            <Button
                              size="sm"
                              variant={
                                icoForChg.ACCESS_ID === subMenu.ACCESS_ID
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => hdlIcoSel(subMenu)}
                            >
                              <HiOutlineSwitchHorizontal size={18} />
                            </Button>
                          </Col>
                          <Col>
                            {subMenu.iconImg ? (
                              <div className="text-center">
                                <div
                                  className={`border border-1 rounded-4 py-3 mx-2 bg-opacity-25 ${
                                    subMenu.ACCESS_MOBILE ? "" : "bg-secondary"
                                  }`}
                                >
                                  <Image
                                    src={subMenu.iconImg}
                                    style={{
                                      height: "30px",
                                      width: "30px",
                                    }}
                                  />
                                </div>
                                <div>{subMenu.MENU_NAME}</div>
                              </div>
                            ) : (
                              ""
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Fragment>
                ))}
            </div>
          </Col>
          <Col>
            <Row className="mt-2">
              <Col>
                <Form.Control
                  onChange={hdlChgQry}
                  type="text"
                  size="sm"
                  placeholder="search"
                />
              </Col>
              <Col className="text-end" sm={5}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => opnUplIco("Upload Icon")}
                >
                  Upload Icon
                </Button>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col style={{ height: "72vh", overflow: "scroll" }}>
                {hdlSearchIco(qryIco, icons)?.map((ico, i) => (
                  <Card
                    style={{
                      width: "auto",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center", // Agar gambar dan teks sejajar vertikal
                      gap: "10px", // Beri jarak antara gambar & teks
                      padding: "10px", // Tambahkan padding agar tampilan lebih rapi
                    }}
                    className="my-2"
                    key={i}
                  >
                    {/* Image Section */}
                    <Card.Img
                      src={ico.iconImg}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                      }}
                    />

                    {/* Text Section */}
                    <Card.Body className="d-flex flex-row justify-content-between align-items-center p-0">
                      <div>
                        <Card.Title>{ico.ICON_NAME}</Card.Title>
                        <Card.Text>{ico.ICON_IMG}</Card.Text>
                      </div>

                      {/* Button */}
                      {icoForChg.ACCESS_ID ? (
                        <Button
                          size="sm"
                          variant="primary"
                          style={{ alignSelf: "center", whiteSpace: "nowrap" }}
                          onClick={() =>
                            handleSelIco(menuApp, icoForChg.ACCESS_ID, ico)
                          }
                        >
                          Select
                        </Button>
                      ) : (
                        ""
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default MangementIcons;
