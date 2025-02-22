import React, { useEffect, useState } from "react";
import { Form, Row, Col, Image, Offcanvas, Button } from "react-bootstrap";
import { BiCheck, BiPencil } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "../axios/axios.js";
import { toast } from "react-toastify";
import noPhoto from "../assets/image/userphoto.jpeg";
import '../styles/AvatarEdit.css'
import MdlUploadUserImg from "../partial/MdlUploadUserImg.js";
import ViewImgProfile from "../partial/ViewImgProfile.js";

const UserProfile = ({ show, handleClose, dataUser, getDataUser, userId, idPerusahaan, photoProfile, reGetPp }) => {
  const [colEdit, setColEdit] = useState("");
  const [edited, setEdited] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [userImg, setUserImg] = useState(noPhoto);

  const [errors, setErrors] = useState({
    currentPasswordError: "",
    passwordError: "",
    confirmPassError: "",
  });

  useEffect(() => {
    if(photoProfile){
      setUserImg(photoProfile)
    }
  }, [photoProfile])
  

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(value);
  };

  function onChangeData(e) {
    const { value, name } = e.target;
    if (name === "USER_TEL") {
      if (value.length < 14) {
        setEdited({ USER_TEL: e.target.value });
      }
    } else {
      if (name === "USER_EMAIL") {
        setIsValidEmail(value === "" || validateEmail(value));
      }

      if (value !== "") {
        setEdited({ [name]: e.target.value });
      } else {
        setEdited({});
      }
    }
  }

  async function onSave(value, key) {
    if (value[key] && value[key] !== "") {
      let urlSave = "user/selft/";
      if (key === "USER_PASS") {
        urlSave = "user/";
      }
      await axios.patch(urlSave + userId, value).then((res) => {
        toast.success("User Update", { autoClose: 2000 });
        getDataUser(userId);
        setEdited({});
        setColEdit("");
      });
    } else {
      toast.error("Tidak ada data yang diisi");
    }
  }

  function hdlColEdit(colName, objEdit) {
    setColEdit(colName);
    setEdited(objEdit);
  }

  function handleChangePass(e) {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      let passwordError = prevErrors.passwordError;
      let confirmPassError = prevErrors.confirmPassError;

      if (name === "USER_PASS") {
        passwordError =
          value.length < 8 ? "Password must be at least 8 characters long" : "";
        confirmPassError =
          edited.CONFIRM_PASS && value !== edited.CONFIRM_PASS
            ? "Passwords do not match"
            : "";
      }

      if (name === "CONFIRM_PASS") {
        confirmPassError =
          value !== edited.USER_PASS ? "Passwords do not match" : "";
      }

      return { passwordError, confirmPassError };
    });
  }

  async function onSavePass(data) {
    const { CURRENT_PASS, USER_PASS, CONFIRM_PASS } = data;
    if (!CURRENT_PASS || !USER_PASS || !CONFIRM_PASS) {
      return setErrors({
        currentPasswordError: "Required Please Input",
        passwordError: "Required Please Input",
        confirmPassError: "Required Please Input",
      });
    } else {
      setErrors({
        currentPasswordError: "",
        passwordError: "",
        confirmPassError: "",
      });

      const newUpdatePass = {
        CURRENT_PASS,
        USER_PASS,
        USER_ID: userId,
      };
      await axios
        .post(`/user/selft-update-pass`, newUpdatePass)
        .then((res) => {
          if (res.status === 200) {
            toast.success("User Update", { autoClose: 2000 });
            getDataUser(userId);
            setEdited({});
            setColEdit("");
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            return setErrors({
              currentPasswordError: "Password Incorrect",
            });
          } else {
            return toast.error("Error when update data user", {
              autoClose: 3000,
            });
          }
        });
    }
  }

  function openMdlEditImg(){
    setShowUpload(true)
  }

  function clsMdlUpload(){
    setShowUpload(false)
    reGetPp()
  }
  
  return (
    <>
    <Offcanvas show={show} placement="end" onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>User Profile</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="justify-content-md-center">
          <Col className="ms-4">
            <Row className="mb-4">
              <Col className="text-center">
                <Form.Group controlId="USER_IMAGE">
                  {/* <Form.Label>Profile Image</Form.Label> */}
                  <div className="avatar-container">
                    <Image
                      src={userImg}
                      roundedCircle
                      width={150}
                      height={150}
                      style={{cursor: 'pointer'}}
                      onClick={() => setShowImg(true)}
                    />
                    {/* Edit Button */}
                    <Button
                      variant="dark"
                      className="edit-button"
                      onClick={openMdlEditImg}
                    >
                      <BiPencil size={16} />
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Company Name
              </Col>
              <Col>{dataUser?.NAMA_PERUSAHAAN}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                User Name
              </Col>
              <Col>{dataUser?.USER_NAME}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Nama
              </Col>
              <Col>{dataUser?.USER_INISIAL}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Job Title
              </Col>
              <Col>{dataUser?.USER_JOB_TITLE}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Role
              </Col>
              <Col>{dataUser?.BE_ROLE_NAME}</Col>
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Phone
              </Col>
              {colEdit !== "telp" ? (
                <Col>
                  {dataUser?.KODE_TEL}
                  {dataUser?.USER_TEL}{" "}
                  <span
                    onClick={() =>
                      hdlColEdit("telp", {
                        KODE_TEL: dataUser?.KODE_TEL,
                        USER_TEL: dataUser?.USER_TEL,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </Col>
              ) : (
                <Col>
                  <Form.Select
                    aria-label="select phone code"
                    className="mb-2"
                    size="sm"
                    name="KODE_TEL"
                    value={edited?.KODE_TEL}
                    onChange={onChangeData}
                  >
                    <option value="+62">Indonesia (+62)</option>
                    <option value="+1">US (+1)</option>
                    <option value="+84">Korea (+84)</option>
                  </Form.Select>
                  <Form.Control
                    size="sm"
                    name="USER_TEL"
                    className="mb-2"
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
                      <span className="pt-1">Save</span>
                    </Col>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => setColEdit("")}
                    >
                      <MdOutlineCancel color="#E91E63" size={18} />{" "}
                      <span className="pt-1">Cancel</span>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
            <Row className="mb-3 mb-md-4">
              <Col xs={12} lg={5} className="fw-bold">
                Email
              </Col>
              {colEdit !== "email" ? (
                <Col>
                  {dataUser?.USER_EMAIL}{" "}
                  <span
                    onClick={() =>
                      hdlColEdit("email", { USER_EMAIL: dataUser?.USER_EMAIL })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </Col>
              ) : (
                <Col>
                  <Form.Group as={Row} className="mb-2" controlId="email">
                    <Form.Control
                      size="sm"
                      name="USER_EMAIL"
                      type="email"
                      value={edited.USER_EMAIL}
                      isInvalid={!isValidEmail}
                      onChange={onChangeData}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please input a email.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => onSave(edited, "USER_EMAIL")}
                    >
                      <BiCheck color="#198754" size={20} />{" "}
                      <span className="pt-1">Save</span>
                    </Col>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => setColEdit("")}
                    >
                      <MdOutlineCancel color="#E91E63" size={18} />{" "}
                      <span className="pt-1">Cancel</span>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>

            <Row>
              <Col xs={12} lg={5} className="fw-bold">
                Password
              </Col>
              {colEdit !== "pass" ? (
                <Col>
                  *******{" "}
                  <span
                    onClick={() =>
                      hdlColEdit("pass", {
                        CURRENT_PASS: "",
                        USER_PASS: "",
                        CONFIRM_PASS: "",
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </Col>
              ) : (
                <Col>
                  <Form.Group as={Row} className="mb-2" controlId="currentpas">
                    <Form.Control
                      size="sm"
                      name="CURRENT_PASS"
                      type="password"
                      placeholder="Current Password"
                      isInvalid={!!errors.currentPasswordError}
                      value={edited.CURRENT_PASS}
                      onChange={handleChangePass}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.currentPasswordError}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-2" controlId="password">
                    <Form.Control
                      size="sm"
                      name="USER_PASS"
                      type="password"
                      placeholder="New password"
                      isInvalid={!!errors.passwordError}
                      value={edited.USER_PASS}
                      onChange={handleChangePass}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordError}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-2" controlId="confirmPass">
                    <Form.Control
                      size="sm"
                      name="CONFIRM_PASS"
                      type="password"
                      placeholder="Confirm Password"
                      value={edited.CONFIRM_PASS}
                      isInvalid={!!errors.confirmPassError}
                      onChange={handleChangePass}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassError}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => onSavePass(edited, "USER_PASS")}
                    >
                      <BiCheck color="#198754" size={20} />{" "}
                      <span className="pt-1">Save</span>
                    </Col>
                    <Col
                      style={{ cursor: "pointer" }}
                      onClick={() => setColEdit("")}
                    >
                      <MdOutlineCancel color="#E91E63" size={18} />{" "}
                      <span className="pt-1">Cancel</span>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
    <MdlUploadUserImg show={showUpload} handleClose={clsMdlUpload} userId={userId} idPerusahaan={idPerusahaan} setUserImg={setUserImg}  />
    <ViewImgProfile show={showImg} handleClose={() => setShowImg(false)} dataImg={userImg}/>
    </>
  );
};

export default UserProfile;
