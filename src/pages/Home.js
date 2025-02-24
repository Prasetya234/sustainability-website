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
import {
  FaInfo,
  FaRegNewspaper,
  FaRegUserCircle,
  FaTasks,
  FaUsers,
} from "react-icons/fa";
import { RiSurveyLine } from "react-icons/ri";
import { FiActivity } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { IoBook } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";

const Home = () => {
  return (
    <Container className="pt-3">
      <Row className="justify-content-center">
        <Col className="mb-3 text-center" xs={10} md={9}>
          <Card className="border-0 shadow">
            <Card.Body className="rounded">
              <Row className="m-2 mb-3 border rounded shadow-sm">
                <Col sm={12} md={5} lg={2} className="border-end">
                  <figure className="p-2 pt-4">
                    <img
                      src={logos}
                      alt="logo"
                      className="logo"
                      // style={{ width: "300px", height: "200px" }}
                    ></img>
                  </figure>
                </Col>
                <Col
                  sm={12}
                  md={7}
                  lg={9}
                  className="ps-0 ps-md-4 pt-0 pt-md-4"
                >
                  <h4 className="text text-start pt-3">GBVH</h4>
                  <p className="text-start">
                    (Gender-based violence and harassment) is a conflict
                    management software designed to provide a holistic and
                    user-friendly solution.
                  </p>
                </Col>
              </Row>
              <Row className="mx-1 ">
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div className="bg-info bg-opacity-25 p-5 rounded-top-2">
                      <FaRegNewspaper size={40} color="#3498DB" />
                    </div>
                    <div className="fs-5 text-center p-2">News</div>
                  </div>
                </Col>
                <Col>
                  <div className="rounded-bottom-2 shadow">
                    <div
                      className="p-5 rounded-top-2"
                      style={{ backgroundColor: "#f5b0b0" }}
                    >
                      <RiSurveyLine size={40} color="#fc6f6f" />
                    </div>
                    <div className="fs-5 text-center p-2">Survey</div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div className="bg-success bg-opacity-25 p-5 rounded-top-2">
                      <FiActivity size={40} color="#6fc746" />
                    </div>
                    <div className="fs-5 text-center p-2 ">Activity Center</div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div
                      className=" p-5 rounded-top-2"
                      style={{ backgroundColor: "#a8c7f0" }}
                    >
                      <FaTasks size={40} color="#6ca7f5" />
                    </div>
                    <div className="fs-5 text-center p-2 ">Task</div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div
                      className=" p-5 rounded-top-2"
                      style={{ backgroundColor: "#cebdf0" }}
                    >
                      <FaRegUserCircle size={40} color="#b89af5" />
                    </div>
                    <div className="fs-5 text-center p-2 ">Personal Info</div>
                  </div>
                </Col>
              </Row>
              <Row className="mx-1 mt-3">
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div
                      className="p-5 rounded-top-2"
                      style={{ backgroundColor: "#f7e623" }}
                    >
                      <FaInfo size={40} color="#e6ca4e" />
                    </div>
                    <div className="fs-5 text-center p-2">Company Info</div>
                  </div>
                </Col>
                <Col>
                  <div className="rounded-bottom-2 shadow">
                    <div
                      className="p-5 rounded-top-2"
                      style={{ backgroundColor: "#a9f59f" }}
                    >
                      <PiExam size={40} color="#57cc47" />
                    </div>
                    <div className="fs-5 text-center p-2">Exam</div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div
                      className="p-5 rounded-top-2"
                      style={{ backgroundColor: "#f5b0b0" }}
                    >
                      <IoBook size={40} color="#fc6f6f" />
                    </div>
                    <div className="fs-5 text-center p-2 ">Learning System</div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div
                      className=" p-5 rounded-top-2"
                      style={{ backgroundColor: "#99e9f7" }}
                    >
                      <VscFeedback size={40} color="#3ab8cf" />
                    </div>
                    <div className="fs-5 text-center p-2 ">Feedback</div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow rounded-bottom-2">
                    <div
                      className=" p-5 rounded-top-2"
                      style={{ backgroundColor: "#edb9d1" }}
                    >
                      <FaUsers size={40} color="#d64588" />
                    </div>
                    <div className="fs-5 text-center p-2 ">Users</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="mb-3 text-center" xs={10} md={9}>
          <Card className="border-0 shadow">
            <Card.Body className="rounded">
              <Row>
                <Col>
                  <div className="border rounded-2 p-2 fs-6">Help Center</div>
                </Col>
                <Col>
                  <div className="border rounded-2 p-2 fs-6">Download GBVH App</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
