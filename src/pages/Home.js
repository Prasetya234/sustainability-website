import React, { useContext } from "react";
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
import '../styles/Home.css'
import { AuthContext } from "../auth/AuthProvider";

const Home = () => {
    const { handleNavigation } =
      useContext(AuthContext);
  return (
    <Container className="pt-3">
      <Row className="justify-content-center">
        <Col className="mb-3 text-center" xs={10} md={9}>
          <Card className="border-0 shadow">
            <Card.Body className="rounded home">
              <Row className="m-2 mb-xl-3 border rounded shadow-sm">
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
                  className="ps-4 pt-0 pt-md-4 text-center text-md-start"
                >
                  <h4 className="text pt-3">Sustainability System</h4>
                  <p className="text">
                    (Gender-based violence and harassment) is a conflict
                    management software designed to provide a holistic and
                    user-friendly solution.
                  </p>
                </Col>
              </Row>
              <Row className="mx-1 ">
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons" onClick={(e) => handleNavigation('news')}>
                    <div className="bg-info bg-opacity-25 p-3 p-xl-5 rounded-top-2">
                      <FaRegNewspaper size={40} color="#3498DB" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">News</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="rounded-bottom-2 shadow icons" onClick={(e) => handleNavigation('survey')}>
                    <div
                      className="p-3 p-xl-5 rounded-top-2"
                      style={{ backgroundColor: "#f5b0b0" }}
                    >
                      <RiSurveyLine size={40} color="#fc6f6f" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Survey</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons" onClick={(e) => handleNavigation('analytic')}>
                    <div className="bg-success bg-opacity-25 p-3 p-xl-5  rounded-top-2">
                      <FiActivity size={40} color="#6fc746" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Activity Center</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons" onClick={(e) => handleNavigation('library')}>
                    <div
                      className=" p-3 p-xl-5 rounded-top-2"
                      style={{ backgroundColor: "#a8c7f0" }}
                    >
                      <FaTasks size={40} color="#6ca7f5" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center ">Library</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons"
                  onClick={(e) => handleNavigation('payslip')}
                  >
                    <div
                      className=" p-3 p-xl-5 rounded-top-2"
                      style={{ backgroundColor: "#cebdf0" }}
                    >
                      <FaRegUserCircle size={40} color="#b89af5" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Personal Info</div>
                  </div>
                </Col>
                <Col className="d-block d-lg-none mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons">
                    <div
                      className="p-3 p-xl-5  rounded-top-2"
                      style={{ backgroundColor: "#f7e623" }}
                    >
                      <FaInfo size={40} color="#e6ca4e" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Company Info</div>
                  </div>
                </Col>
              </Row>
              <Row className="mx-1 mt-3">
                <Col className="mb-3 mb-lg-2 mb-xl-0 d-none d-lg-block" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons">
                    <div
                      className="p-3 p-xl-5  rounded-top-2"
                      style={{ backgroundColor: "#f7e623" }}
                    >
                      <FaInfo size={40} color="#e6ca4e" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Company Info</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="rounded-bottom-2 shadow icons" onClick={(e) => handleNavigation('exam')}>
                    <div
                      className="p-3 p-xl-5  rounded-top-2"
                      style={{ backgroundColor: "#a9f59f" }}
                    >
                      <PiExam size={40} color="#57cc47" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Exam</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons" onClick={(e) => handleNavigation('class')}>
                    <div
                      className="p-3 p-xl-5  rounded-top-2"
                      style={{ backgroundColor: "#f5b0b0" }}
                    >
                      <IoBook size={40} color="#fc6f6f" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center ">Learning System</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons"
                  onClick={(e) => handleNavigation('grievance')}
                  >
                    <div
                      className=" p-3 p-xl-5  rounded-top-2"
                      style={{ backgroundColor: "#99e9f7" }}
                    >
                      <VscFeedback size={40} color="#3ab8cf" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Grievance</div>
                  </div>
                </Col>
                <Col className="mb-3 mb-lg-2 mb-xl-0" xs={4} md={3} xl>
                  <div className="shadow rounded-bottom-2 icons"
                  onClick={(e) => handleNavigation('emp-management')}
                  >
                    <div
                      className="p-3 p-xl-5  rounded-top-2"
                      style={{ backgroundColor: "#edb9d1" }}
                    >
                      <FaUsers size={40} color="#d64588" />
                    </div>
                    <div className="font-icons text-center p-2 align-content-center">Users</div>
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
                <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                  <div className="border rounded-2 p-2 font-icons btn-home align-content-center">Help Center</div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="border rounded-2 p-2 font-icons btn-home align-content-center">Download Sustainability System App</div>
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
