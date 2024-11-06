import { Row, Col, Card } from "react-bootstrap";
import imgNotFound from "../assets/404-NotFound.png";

const ComingSoon = () => {
  return (
    <div>
      <Row className="m-0">
        <Col className="ps-3 p-2">
          <Row className="justify-content-center">
            <Col className=" col-10 col-md-8 col-lg-6">
              <Card className="shadow border-0 rounded mt-5">
                <Card.Body>
                  <div className="mx-auto d-block text-center">
                    <img
                      className="img-fluid"
                      style={{ width: "18rem" }}
                      src={imgNotFound}
                      alt=""
                    />
                    <div className="mt-3 ">
                      <h2 className="fs-3">COMING SOON</h2>
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

export default ComingSoon;
