import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";


const initalObj = {
    USER_INISIAL: '',
    USER_PASS: '',
    CONFIRM_PASS: '',
    USER_NAME: '',
    USER_EMAIL: '',
    USER_PERUSAHAAN: '',
    ID_PERUSAHAAN: '',
    USER_TEL: '+62',
    USER_LEVEL: '',
    USER_PATH: '',
    USER_AKTIF_STATUS: 1,
    USER_DELETE_STATUS: '',
    USER_ADD_ID: '',
    SUMMARY: '',
  };

const ModalAddUser = ({ show, handleClose, 
    actType, handleSubmit, listRole, listPerushaan, perusahaan, disabledPerusahaan }) => {
    const [formData, setFormData] = useState(initalObj)

    function handlePerusahaan(e) {
        console.log(e);
        
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
    
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [name]: value,
          };
        });
      }
    
      function handleStatus(value) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            BE_STATUS: value,
          };
        });
      }
  return (
    <Modal show={show} size="lg" onHide={handleClose}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>{actType}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="ms-2 me-5">
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
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="password">
              <Form.Label column sm={3} className="text-end">
                <span className="text-danger">*</span> Password
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="USER_PASS"
                  onChange={handleChange}
                  value={formData.PASSWORD}
                  required
                />
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
                  onChange={handleChange}
                  value={formData.CONFIRM_PASS}
                  required
                />
              </Col>
            </Form.Group>

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
                Email
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="USER_EMAIL"
                  onChange={handleChange}
                  value={formData.USER_EMAIL}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="phone">
              <Form.Label column sm={3} className="text-end">
                Phone
              </Form.Label>
              <Col sm={4}>
                <Form.Select aria-label="select phone code" defaultValue={'+62'}>
                  <option value="+62">+62</option>
                  <option value="+1">+1</option>
                  <option value="+84">+84</option>
                </Form.Select>
              </Col>
              <Col sm={5}>
                <Form.Control
                  type="number"
                  name="NUMBER"
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
                  name="BE_ROLE_TYPE"
                  defaultValue={3}
                  onChange={handleChange}
                >
                  {listRole?.map((item) => (
                    <option key={item.BE_ID} value={item.BE_ID}>
                      {item.BE_ROLE_NAME}
                    </option>
                  ))}
                </Form.Select>
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
