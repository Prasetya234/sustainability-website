import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { BiCheck } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "../axios/axios.js";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const UserSetup = () => {
  const { value, dispatch } = useContext(AuthContext);
  const { userId } = value;
  const [username, setUsername] = useState(""); //user ceisa
  const [password, setPassword] = useState(""); //user ceisa
  const [dataUser, setDataUser] = useState({}); //user apkb
  const [colEdit, setColEdit] = useState("");
  const [msg, setMsg] = useState("");
  const [edited, setEdited] = useState({});

  const onChangeUsername = (e) => {
    setMsg("");
    const value = e.target.value;
    setUsername(value.toLowerCase());
  };

  const onChangePassword = (e) => {
    setMsg("");
    const value = e.target.value;
    setPassword(value);
  };

  const Auth = async (e) => {
    e.preventDefault();
    const dataCeisa = { USER_CEISA: username, USER_PASS_CEISA: password };
    axios
      .patch(`/user/ceisa-user/${userId}`, dataCeisa)
      .then((res) => {
        setUsername("");
        setPassword("");
        dispatch({ type: "SET_CONECTION_STATUS", payload: true });
        return toast.success("User save dan terkoneksi", { autoClose: 4000 });
      })
      .catch((err) => {
        dispatch({ type: "SET_CONECTION_STATUS", payload: false });
        const errmsg =
          err.response.data.message ||
          "terdapat error saat set data user ceisa";
        return toast.error(errmsg);
      });
  };

  const getDataUser = async (idUser) => {
    await axios
      .get(`/user/${idUser}`)
      .then((res) => {
        if (res.status === 200) {
          setDataUser(res.data);
        }
      })
      .catch((err) => {
        toast.error("Gagal saat ambil data user");
      });
  };

  useEffect(() => {
    getDataUser(userId);
  }, [userId]);

  function onChangeData(e) {
    const { value, name } = e.target;
    if (name === "USER_TEL") {
      if (value.length < 14) {
        setEdited({ USER_TEL: e.target.value });
      }
    } else {
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
        toast.success("User Update");
        getDataUser(userId);
        setEdited({});
        setColEdit("");
      });
    } else {
      toast.error("Tidak ada data yang diisi");
    }
  }

  return (
    <Row className="m-0 pt-1 pt-md-2 text">
      <Col sm={12} md={6} className="p-2">
        <div
          style={{ height: "86vh" }}
          className="p-3 body-card shadow rounded"
        >
          <div className="bg-primary mb-3 shadow text-center bg-opacity-75 p-2 fw-bold">
            DATA ACCOUNT PERUSAHAAN
          </div>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={5}>
              <div className="fw-bold">NPWP</div>
              <div>{dataUser.USER_NPWP}</div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">NIB</div>
              <div>{dataUser.USER_NIB}</div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">Nama Perusahaan</div>
              <div>{dataUser.USER_PERUSAHAAN}</div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">Alamat Perusahaan</div>
              <div>{dataUser.USER_ALAMAT}</div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">Divis</div>
              <div>{dataUser.USER_DIVISI}</div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={5}>
              <div className="fw-bold">Nama</div>
              <div>{dataUser.USER_INISIAL}</div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">Phone</div>
              {colEdit !== "telp" ? (
                <div>
                  {dataUser.USER_TEL}{" "}
                  <span
                    onClick={() => setColEdit("telp")}
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">email</div>
              {colEdit !== "email" ? (
                <div>
                  {dataUser.USER_EMAIL}{" "}
                  <span
                    onClick={() => setColEdit("email")}
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">User Name</div>
              <div>{dataUser.USER_NAME}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} md={4}>
              <div className="fw-bold">Password</div>
              {colEdit !== "pass" ? (
                <div>
                  *******{" "}
                  <span
                    onClick={() => setColEdit("pass")}
                    style={{ cursor: "pointer" }}
                  >
                    <AiOutlineEdit color="#0086FF" size={18} />
                  </span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </Col>
          </Row>
        </div>
      </Col>
      <Col className="p-2">
        <div
          style={{ height: "86vh" }}
          className="p-3 body-card shadow rounded"
        >
          <div className="bg-primary mb-3 shadow text-center bg-opacity-75 p-2 fw-bold">
            SETUP USER CEISA 4.0
          </div>
          <Row className="justify-content-center">
            <Col sm={6} className="pt-4">
              <Form onSubmit={Auth}>
                <Form.Group className="mb-3">
                  <Form.Label className="text">User Name</Form.Label>
                  <Form.Control
                    name="username"
                    type="text"
                    placeholder="email atau username"
                    required
                    value={username}
                    onChange={onChangeUsername}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text">Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    required
                    placeholder="*******"
                    value={password}
                    onChange={onChangePassword}
                    autoComplete="on"
                  />
                </Form.Group>
                <div>
                  <p className="ps-3 fst-italic text-danger">{msg}</p>
                </div>
                <div className="d-grid align-items-center mt-3 mb-2">
                  <Button className="rounded-" variant="primary" type="submit">
                    Save
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default UserSetup;
