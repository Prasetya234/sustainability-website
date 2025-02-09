import React, { useContext, useState } from "react";
import { Col, Row, Button, Table, Modal, Form } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios";
import { toast } from "react-toastify";

const intialBeObj = {
  BE_ROLE_NAME: "",
  BE_STATUS: 1,
  BE_ROLE_TYPE: "",
  BE_PATH: "",
  BE_NOTE: "",
};

const UserBackendRole = () => {
  const { value } = useContext(AuthContext);
  const { userId } = value;
  const [show, setShow] = useState(false);
  const [method, setMethod] = useState("post");

  const [formData, setFormData] = useState(intialBeObj);

  function handleClose() {
    setShow(false);
  }

  function handleShow() {
    handleMethodChange("post")
    setShow(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dataPost = { ...formData, BE_ADD_ID: userId };
    // console.log(dataPost);

    await axios[method](`/backend-role`, dataPost)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message, { autoClose: 3000 });
          handleClose();
        }
      })
      .catch((err) => toast.error(err.data.message, { autoClose: 3000 }));
  }

  function handleMethodChange(chgMethod) {
    setMethod(chgMethod);
    }
  return (
    <>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row>
              <Col>
                <Button size="sm" ariant="primary" onClick={() => handleShow()}>
                  Add
                </Button>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th>Status</th>
                      <th>Note</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Larry the Bird</td>
                      <td>@twitter</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardShadow>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mx-3">
              <Form.Group
                as={Row}
                className="mb-4"
                controlId="formHorizontalEmail"
              >
                <Form.Label column sm={3} className="text-end">
                  <span className="text-danger">*</span> Role Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="BE_ROLE_NAME"
                    onChange={handleChange}
                    value={formData.BE_ROLE_NAME}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4">
                <Form.Label as="legend" column sm={3} className="text-end">
                  Status
                </Form.Label>
                <Col sm={2} className="align-content-center">
                  <Form.Check
                    type="radio"
                    label="Enable"
                    name="enable"
                    id="formEnable"
                  />
                </Col>
                <Col className="align-content-center">
                  <Form.Check
                    type="radio"
                    label="Disabled"
                    name="disabled"
                    id="formDisabled"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="roleType">
                <Form.Label column sm={3} className="text-end">
                  Role Type
                </Form.Label>
                <Col sm={9}>
                  <Form.Control type="text" placeholder="" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="path">
                <Form.Label column sm={3} className="text-end">
                  Path/Url
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="BE_PATH"
                    onChange={handleChange}
                    value={formData.BE_PATH}
                  />{" "}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="formNote">
                <Form.Label column sm={3} className="text-end">
                  Note
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="textarea"
                    row={4}
                    name="BE_NOTE"
                    onChange={handleChange}
                    value={formData.BE_NOTE}
                  />
                </Col>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              size="sm"
              className="me-2"
              variant="outline-secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UserBackendRole;
