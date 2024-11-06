import React from "react";
// import {
//   FcComboChart,
//   FcDeployment,
//   FcInspection,
//   FcCalendar,
// } from "react-icons/fc";
// import { MdContentCut } from "react-icons/md";
// import { IconContext } from "react-icons";
// import { GiSewingMachine } from "react-icons/gi";
import { Container, Row, Col, Card } from "react-bootstrap";
import logos from "../assets/logosa.png";

const Home = () => {
  return (
    <Container className="pt-5">
      {/* <Row className="mt-3 mb-2 mb-md-0">
        <Col>
          <div className="text-secondary fw-bold fst-italic text">
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </Col>
      </Row> */}

      <Row className="justify-content-center my-2">
        <Col className="mb-3 text-center" xs={10} sm={8} md={6}>
          <Card className="border-0 shadow">
            <Card.Body className="rounded">
              <figure className="ps-2">
                <img
                  src={logos}
                  alt="logo"
                  className="logo"
                  // style={{ width: "300px", height: "200px" }}
                ></img>
              </figure>
              {/* <Image
                                src={logos}
                               
                                alt="apkb"
                            /> */}
              {/* <h2 className="text-center" style={{ color: "#0085FE" }}>
                Semarang
              </h2> */}
              <h4 className="text text-center">CEISA 4.0 Host To Host</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <h4 className="text text-center">CEISA 4.0 Host To Host</h4>
        </Col>
      </Row> */}
    </Container>
  );
};

export default Home;
