import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import axios from "../axios/axios.js";
import logo from "../assets/logosa.png";
import "../styles/Login.css";
import jwtDecode from "jwt-decode";
import bckg from "../assets/bg-gbvh.png";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
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
          // const decode = jwtDecode(response.data.apkbAcssToken);
          // if (decode.userPath) {
          //   return navigate(decode.userPath);
          // }
          navigate("/home");
        })
        .catch((error) => {
          if (error.response) return "";
        });
    };
    cekLogin();
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      navigate("/home");
    }
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
      const response = await axios.post("/login", {
        USER_NAME: username,
        USER_PASS: password,
      });
      const token = response.data.apkbAcssToken;
  
      // Simpan token ke localStorage
      localStorage.setItem("token", token);
  
      // Decode token dan navigasi ke path yang sesuai
      const decoded = jwtDecode(token);
      if (decoded.userPath) {
        return navigate(decoded.userPath);
      }
      navigate("/home");
    } catch (error) {
      if (error.message === "Network Error") {
        setMsg(`${error.message}, Please Contact Your Administrator`);
      } else if (error.response) {
        setMsg(error.response.data.message);
      }
    }
  };
  
  return (
    <section className="login-body">
      {/* <Container className="py-3 h-100 "> */}
      {/* <Row className="d-flex align-items-center justify-content-center h-80 mt-5"> */}
      <Row className="m-0">
        <Col
        className="d-none d-lg-block"
          style={{
            height: "100vh",
            backgroundImage: `url(${bckg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></Col>
        <Col className="col-12 col-md-6 col-xl-3 h-100 mt-5">
          <Container className="pt-lg-5">
            {/* <Card className="border-0 shadow mt-5 p-3">
            <Card.Body className="rounded"> */}
            <div className="d-block text-center mb-1">
              <img
                className="img-fluid"
                style={{ width: "10rem" }}
                src={logo}
                alt=""
              />
            </div>
            <h2 className="text-gbvh">GBVH</h2>
            <h4 className="text-center text-muted fst-italic fs-6 font-weight-light mb-3">
              Gender Based Violence and Harassment
            </h4>
            <h2 className="text-center font-weight-light mb-3 mt-5">
              {t("Selamat Datang")}
            </h2>
            {/* <Form> */}
            <Form onSubmit={Auth} className="px-lg-3">
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
                <Form.Label className=" ps-3 text-muted">User Name</Form.Label>
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
                <Form.Label className="ps-3 text-muted">Password</Form.Label>
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
            {/* </Card.Body>
          </Card> */}
          </Container>
          {/* <footer className="bg-dark text-white mt-5"> */}
          <div
            style={{
              position: "fixed",
              bottom: 15,
              // height: "10vh",
              width: "22vw",
              // display: "flex",
              margin: "0 auto",
            }}
          >
            <Row className="d-none d-lg-flex">
              <Col
                onClick={() => changeLanguage("en")}
                className="border-end border-1 text-end"
              >
                English
              </Col>
              <Col onClick={() => changeLanguage("id")} className="text-start">
                Bahasa Indonesia
              </Col>
            </Row>
          </div>
          {/* </footer> */}
        </Col>
      </Row>
      {/* </Container> */}
    </section>
  );
};

export default Login;
