import { Button, Col, Form, Modal, Row } from "react-bootstrap";

import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const ModalAddUser = ({
  show,
  handleClose,
  actType,
  handleSubmit,
  listRole,
  listPerushaan,
  perusahaan,
  setPerusahaan,
  disabledPerusahaan,
  formData,
  setFormData,
  validated,
  isValidEmail,
  setIsValidEmail,
  errors,
  setErrors,
  validateEmail,
}) => {
  function handlePerusahaan(e) {
    setPerusahaan(e);

    // setPerushaan(e);
    // if (e.length > 0) {
    //   const { ID_PERUSAHAAN } = e[0];
    //   setIdPerusahaan(ID_PERUSAHAAN);
    // } else {
    //   setIdPerusahaan("");
    // }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "USER_NAME") {
      newValue = value.replace(/\s/g, ""); // Menghapus semua spasi
    }

    if (name === "USER_TEL" && value.length > 12) return;

    if (name === "USER_EMAIL") {
      setIsValidEmail(value === "" || validateEmail(value));
    }
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: newValue,
      };
    });
  }

  function handleStatus(value) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        USER_AKTIF_STATUS: value,
      };
    });
  }

  function handleChangePass(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // let passwordError = "";
    // let confirmPassError = "";

    if (name === "USER_EMAIL") {
      setIsValidEmail(value === "" || validateEmail(value));
    }

    setErrors((prevErrors) => {
      let passwordError = prevErrors.passwordError;
      let confirmPassError = prevErrors.confirmPassError;

      if (name === "USER_PASS") {
        passwordError = value.length < 8 ? "Password must be at least 8 characters long" : "";
        confirmPassError =
          formData.CONFIRM_PASS && value !== formData.CONFIRM_PASS
            ? "Passwords do not match"
            : "";
      }

      if (name === "CONFIRM_PASS") {
        confirmPassError =
          value !== formData.USER_PASS ? "Passwords do not match" : "";
      }

      return { passwordError, confirmPassError };
    });
  }

  return (
    <Modal show={show} size="lg" onHide={handleClose}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>{actType}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Modal.Body>
          <div className="ms-2 pe-5 me-5">
            <Form.Group as={Row} className="mb-3" controlId="forPerusahaan">
              <Form.Label className="text text-end" size="sm" column sm={3}>
                Perusahaan
              </Form.Label>
              <Col sm={9}>
                <Typeahead
                  clearButton
                  id="perusahaan"
                  labelKey="name"
                  onChange={handlePerusahaan}
                  options={listPerushaan}
                  selected={perusahaan}
                  disabled={disabledPerusahaan}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="Username">
              <Form.Label column sm={3} className="text-end">
                <span className="text-danger">*</span> Username
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="USER_NAME"
                  onChange={handleChange}
                  value={formData.USER_NAME}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please input a username.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {actType === "Create" ? (
              <>
                <Form.Group as={Row} className="mb-4" controlId="password">
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

                <Form.Group as={Row} className="mb-4" controlId="confirmPass">
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
              </>
            ) : (
              ""
            )}

            <Form.Group as={Row} className="mb-4" controlId="fullName">
              <Form.Label column sm={3} className="text-end">
                <span className="text-danger">*</span> Full Name
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="USER_INISIAL"
                  onChange={handleChange}
                  value={formData.USER_INISIAL}
                  required
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
                  checked={formData.USER_AKTIF_STATUS}
                  id="formEnable"
                  onChange={() => handleStatus(1)}
                />
              </Col>
              <Col className="align-content-center">
                <Form.Check
                  type="radio"
                  label="Disabled"
                  name="disabled"
                  checked={!formData.USER_AKTIF_STATUS}
                  onChange={() => handleStatus(0)}
                  id="formDisabled"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="email">
              <Form.Label column sm={3} className="text-end">
                <span className="text-danger">*</span> Email
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="email"
                  name="USER_EMAIL"
                  onChange={handleChange}
                  value={formData.USER_EMAIL}
                  isInvalid={!isValidEmail}
                  required
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please input a email.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="jobtite">
              <Form.Label column sm={3} className="text-end">
               Job Title
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="USER_JOB_TITLE"
                  onChange={handleChange}
                  value={formData.USER_JOB_TITLE}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4">
              <Form.Label column sm={3} className="text-end">
                Phone
              </Form.Label>
              <Col sm={4}>
                <Form.Select
                  aria-label="select phone code"
                  name="KODE_TEL"
                  onChange={handleChange}
                  value={formData.KODE_TEL}
                >
                  <option value="+62">Indonesia (+62)</option>
                  <option value="+1">US (+1)</option>
                  <option value="+84">Korea (+84)</option>
                </Form.Select>
              </Col>
              <Col sm={5}>
                <Form.Control
                  type="number"
                  name="USER_TEL"
                  onChange={handleChange}
                  value={formData.USER_TEL}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="summary">
              <Form.Label column sm={3} className="text-end">
                Summary
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  row={4}
                  name="SUMMARY"
                  onChange={handleChange}
                  value={formData.SUMMARY}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="roleType">
              <Form.Label column sm={3} className="text-end">
                Role Type
              </Form.Label>
              <Col sm={9}>
                <Form.Select
                  aria-label="Default select role"
                  name="BE_ID"
                  value={formData.BE_ID}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  {listRole?.map((item) => (
                    <option key={item.BE_ID} value={item.BE_ID}>
                      {item.BE_ROLE_NAME}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please select role.
                </Form.Control.Feedback>
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
  );
};

export default ModalAddUser;
