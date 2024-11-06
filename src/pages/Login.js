import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import axios from "../axios/axios.js";
import logo from "../assets/logosa.png";
import "../styles/Login.css";
import jwtDecode from "jwt-decode";
import bckg from "../assets/bglogin.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    const cekLogin = async () => {
      return await axios
        .get("/token")
        .then((response) => {
          const decode = jwtDecode(response.data.apkbAcssToken);
          if (decode.userPath) {
            return navigate(decode.userPath);
          }
          navigate("/home");
        })
        .catch((error) => {
          if (error.response) return "";
        });
    };
    cekLogin();
  }, [navigate]);

  const onChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value.toLowerCase());
  };

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const Auth = async (e) => {
    try {
      e.preventDefault();
      await axios
        .post("/login", {
          USER_NAME: username,
          USER_PASS: password,
        })
        .then((response) => {
          const decode = jwtDecode(response.data.apkbAcssToken);
          if (decode.userPath) {
            return navigate(decode.userPath);
          }
          // if (decode.userLevel === "ADM") return navigate("/sewingoutput");
          // if (decode.userLevel === "LBO") return navigate("/qc-lbo");
          navigate("/home");
        });
    } catch (error) {
      if (error.message === "Network Error")
        return setMsg(`${error.message}, Please Contact Your Administrator`);
      if (error.response) return setMsg(error.response.data.message);
    }
  };

  return (
    <section
      className="login-body"
      style={{
        height: "100vh",
        backgroundImage: `url(${bckg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="py-3 h-100 ">
        <Row className="d-flex align-items-center justify-content-center h-80 mt-5">
          <Col className="col-10 col-md-6 col-xl-4 h-100 mt-5">
            <Card className="border-0 shadow mt-5">
              <Card.Body className="rounded">
                <div className="d-block text-center mb-1">
                  <img
                    className="img-fluid"
                    style={{ width: "15rem" }}
                    src={logo}
                    alt=""
                  />
                </div>
                <h2 className="text-semarang">SEMARANG</h2>
                <h4 className="text-center text-muted fst-italic fs-6 font-weight-light">
                  Selamat Datang di CEISA 4.0 Host To Host
                </h4>
                {/* <Form> */}
                <Form onSubmit={Auth}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      className="rounded-pill ps-3"
                      name="username"
                      type="text"
                      placeholder="Username"
                      required
                      value={username}
                      onChange={onChangeUsername}
                    />
                    <Form.Label className=" ps-3 text-muted">
                      User Name
                    </Form.Label>
                  </Form.Floating>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      className="rounded-pill ps-3"
                      name="password"
                      type="password"
                      required
                      placeholder="*******"
                      value={password}
                      onChange={onChangePassword}
                      autoComplete="on"
                    />
                    <Form.Label className="ps-3 text-muted">
                      Password
                    </Form.Label>
                  </Form.Floating>
                  <div>
                    <p className="ps-3 fst-italic text-danger">{msg}</p>
                  </div>
                  <div className="d-grid align-items-center mt-3 mb-2">
                    <Button
                      className="rounded-pill"
                      variant="primary"
                      type="submit"
                    >
                      Login
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
