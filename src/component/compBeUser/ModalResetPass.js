import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

const ModalResetPass = ({
  show,
  handleClose,
  setFormData,
  formData,
  errors,
  setErrors,
  validated,
  handleSubmit
}) => {

    function handleChangePass(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    
        setErrors((prevErrors) => {
          let passwordError = prevErrors.passwordError;
          let confirmPassError = prevErrors.confirmPassError;
    
          if (name === "USER_PASS") {
            passwordError = value.length < 8 ? "Password minimal 8 karakter." : "";
            confirmPassError =
              formData.CONFIRM_PASS && value !== formData.CONFIRM_PASS
                ? "Password tidak cocok."
                : "";
          }
    
          if (name === "CONFIRM_PASS") {
            confirmPassError =
              value !== formData.USER_PASS ? "Password tidak cocok." : "";
          }
    
          return { passwordError, confirmPassError };
        });
      }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className="p-3">
        <Form onSubmit={handleSubmit} noValidate validated={validated}>
          <Form.Group as={Row} className="m-4" controlId="password">
            <Form.Label column sm={3} className="text-end">
              <span className="text-danger">*</span> Password
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="password"
                name="USER_PASS"
                onChange={handleChangePass}
                value={formData.USER_PASS}
                isInvalid={!!errors.passwordError}
                required
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.passwordError}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="m-4" controlId="confirmPass">
            <Form.Label column sm={3} className="text-end">
              <span className="text-danger">*</span> Confirm Password
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="password"
                name="CONFIRM_PASS"
                onChange={handleChangePass}
                value={formData.CONFIRM_PASS}
                isInvalid={!!errors.confirmPassError}
                required
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassError}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Row>
            <Col className="text-end">
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
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalResetPass;
