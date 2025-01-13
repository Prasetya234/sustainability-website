import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate,  } from "react-router-dom";
import imgNotFound from "../assets/404-NotFound.png";
import useInterval from "use-interval";

const NoRoute = () => {
  const [timer, setTimer] = useState(3);
  const navigate = useNavigate();
  
  useEffect(() => {
    const lastValidURL = sessionStorage.getItem("lastValidURL");

    const timeout = setTimeout(() => {
      if (lastValidURL) {
        navigate(lastValidURL);
      } else {
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  useInterval(() => {
    if (timer !== 0) setTimer(timer - 1);
  }, 1000);

  return (
    <div>
      <Row className="m-0">
        <Col className="ps-3 p-2">
          <Row className="justify-content-center">
            <Col className="col-10 col-md-8 col-lg-6">
              <Card className="shadow border-0 rounded mt-5">
                <Card.Body>
                  <div className="mx-auto d-block text-center">
                    <img
                      className="img-fluid"
                      style={{ width: "18rem" }}
                      src={imgNotFound}
                      alt="Not Found"
                    />
                    <div className="mt-3">
                      <h2 className="fs-3">Upss!! Page Not Found</h2>
                    </div>
                    <div className="mt-3">
                      <p>Redirecting in {timer} seconds...</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default NoRoute;
