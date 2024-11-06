import ReactLoading from "react-loading";
import { Row, Col } from "react-bootstrap";

const LoadingPage = () => {
  return (
    <div>
      <Row className="m-0 justify-content-center vh-100">
        <Col sm={1} className="m-auto align-content-center text-center">
          <ReactLoading type="bars" color="#0086FF" height={100} width={100} />
        </Col>
      </Row>
    </div>
  );
};

export default LoadingPage;
