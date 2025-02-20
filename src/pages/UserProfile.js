import React, { useState } from "react";
import { Form,  Row, Col, Image, Offcanvas } from "react-bootstrap";
import { BiCheck } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

const UserProfile = ({ show, handleClose }) => {
  const dataUser = {
    USER_INISIAL: "EGI FIRMANSYAH",
    USER_IMAGE: null,
    USER_PASS: "EGI FIRMANSYAH",
    CONFIRM_PASS: "EGI FIRMANSYAH",
    USER_NAME: "EGI FIRMANSYAH",
    USER_EMAIL: "EGI FIRMANSYAH",
    USER_PERUSAHAAN: "EGI FIRMANSYAH",
    ID_PERUSAHAAN: "EGI FIRMANSYAH",
    USER_JOB_TITLE: "EGI FIRMANSYAH",
    USER_TEL: "EGI FIRMANSYAH",
    KODE_TEL: "EGI FIRMANSYAH",
    USER_AKTIF_STATUS: "EGI FIRMANSYAH",
    SUMMARY: "EGI FIRMANSYAH",
    BE_NAME: "EGI FIRMANSYAH",
  };
  const [colEdit, setColEdit] = useState("");
  const [edited, setEdited] = useState({});

  function onSave(params) {
    console.log({ ...params });
  }
  function onChangeData(params) {
    console.log({ ...params });
    setEdited(true); //hanya untuk hilangkan warning
  }
  return (
    <Offcanvas show={show} placement="end" onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>User Profile</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="justify-content-md-center">
          <Col className="ms-4">
            <Row>
              <Col>
                <Form.Group controlId="USER_IMAGE">
                  <Form.Label>Profile Image</Form.Label>
                  <div>
                    <Image
                      src={dataUser.USER_IMAGE}
                      roundedCircle
                      width={150}
                      height={150}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Company Name
              </Col>
              <Col>{dataUser.USER_INISIAL}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Nama
              </Col>
              <Col>{dataUser.USER_INISIAL}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Phone
              </Col>
              {colEdit !== "telp" ? (
                <Col>
                  {dataUser.USER_TEL}{" "}
                  <span
                    onClick={() => setColEdit("telp")}
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </Col>
              ) : (
                <Col>
                  <Form.Control
                    size="sm"
                    name="USER_TEL"
                    type="number"
                    value={edited.USER_TEL}
                    onChange={onChangeData}
                  />
                  <Row>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => onSave(edited, "USER_TEL")}
                    >
                      <BiCheck color="#198754" size={20} />{" "}
                      <span className="pt-1">Simpan</span>
                    </Col>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => setColEdit("")}
                    >
                      <MdOutlineCancel color="#E91E63" size={18} />{" "}
                      <span className="pt-1">Batal</span>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                email
              </Col>
              {colEdit !== "email" ? (
                <Col>
                  {dataUser.USER_EMAIL}{" "}
                  <span
                    onClick={() => setColEdit("email")}
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </Col>
              ) : (
                <Col>
                  <Form.Control
                    size="sm"
                    name="USER_EMAIL"
                    type="email"
                    value={edited.USER_EMAIL}
                    onChange={onChangeData}
                  />
                  <Row>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => onSave(edited, "USER_EMAIL")}
                    >
                      <BiCheck color="#198754" size={20} />{" "}
                      <span className="pt-1">Simpan</span>
                    </Col>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => setColEdit("")}
                    >
                      <MdOutlineCancel color="#E91E63" size={18} />{" "}
                      <span className="pt-1">Batal</span>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                User Name
              </Col>
              <Col>{dataUser.USER_NAME}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Job Title
              </Col>
              <Col>{dataUser.USER_JOB_TITLE}</Col>
            </Row>
            <Row>
              <Col xs={12} lg={5} className="fw-bold">
                Password
              </Col>
              {colEdit !== "pass" ? (
                <Col>
                  *******{" "}
                  <span
                    onClick={() => setColEdit("pass")}
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </Col>
              ) : (
                <Col>
                  <Form.Control
                    size="sm"
                    name="USER_PASS"
                    type="password"
                    value={edited.USER_TEL}
                    onChange={onChangeData}
                  />
                  <Row>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => onSave(edited, "USER_PASS")}
                    >
                      <BiCheck color="#198754" size={20} />{" "}
                      <span className="pt-1">Simpan</span>
                    </Col>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => setColEdit("")}
                    >
                      <MdOutlineCancel color="#E91E63" size={18} />{" "}
                      <span className="pt-1">Batal</span>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default UserProfile;
