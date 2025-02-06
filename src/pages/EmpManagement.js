import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Table, Pagination, Form, Modal } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash, FaSave } from "react-icons/fa";

const EmpManagement = () => {
    // const [ ListEmp, SetListEmp ] = useState([]);
    const [ ItemPagination, setItemPagination ]     = useState([]);
    const [ ModalAddEmp, setModalAddEmp ]           = useState(false);
    const [ ModalImportBatch, setModalImportBatch ] = useState(false);
    const [ ModalDeleteBatch, setModalDeleteBatch ] = useState(false);

    const ConfigPagination = () => {
        let active = 10;
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active}>
                {number}
                </Pagination.Item>,
            );
        }
        setItemPagination(items);
    }

    const OpenModalAddEmp = () => {
        setModalAddEmp(true);
    }

    const OpenModalImportBatch = () => {
        setModalImportBatch(true);
    }

    const OpenModalDeleteBatch = () => {
        setModalDeleteBatch(true);
    }

    const CloseModalAddEmp = () => {
        setModalAddEmp(false);
    }

    const CloseModalImportBatch = () => {
        setModalImportBatch(false);
    }

    const CloseModalDeleteBatch = () => {
        setModalDeleteBatch(false);
    }

    useEffect(() => {
        ConfigPagination();
    }, []);


    return (
        <>
        <Row className="mx-0 mt-3">
        <Col className="ps-3 p-2">
          <Card className="border-0 ">
            <Card.Header>
                <Button variant={"primary"} size="sm" onClick={OpenModalAddEmp}><FaPlus/> ADD </Button>&nbsp; &nbsp;
                <Button variant={"success"} size="sm" onClick={OpenModalImportBatch}><FaFileImport/> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                <Button variant={"danger"} size="sm" onClick={OpenModalDeleteBatch}><FaTrash/> DELETE IN BATCH </Button>
            </Card.Header>
            <Card.Body className="text rounded shadow-sm">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Status</th>
                            <th>Active</th>
                            <th>Username</th>
                            <th>Employee ID</th>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>Department</th>
                            <th>Last Update</th>
                            <th>Action</th>    
                        </tr>    
                    </thead>
                    <tbody>
                        <tr>
                            <td>Avatar</td>
                            <td>Status</td>
                            <td>Active</td>
                            <td>Username</td>
                            <td>Employee ID</td>
                            <td>Full Name</td>
                            <td>Gender</td>
                            <td>Department</td>
                            <td>Last Update</td>
                            <td>Action</td>

                        </tr>    
                    </tbody>    
                </Table>
                <Pagination>{ItemPagination}</Pagination>
                <br />

            </Card.Body>
            </Card>
        </Col>
    </Row>

    <Modal show={ModalAddEmp} size="xl" onHide={CloseModalAddEmp}>
        <Form>    
            <Modal.Header className="bg-primary text-white" closeButton>
            <Modal.Title>Add New Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Employee ID</Form.Label>
                                <Form.Control type="text" name="EmpID"/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="EmpUsername"/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>* Password</Form.Label>
                                <Form.Control type="password" name="EmpPassword" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>* Confirm Password</Form.Label>
                                <Form.Control type="password" name="EmpConfirmPassword" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" name="EmpFullName" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select name="EmpGender">
                                    <option value={"M"} selected>Male</option>
                                    <option value={"F"}>Female</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Birthday</Form.Label>
                                <Form.Control type="date" name="EmpBirthday" />
                            </Form.Group>

                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Onboarding Date</Form.Label>
                                <Form.Control type="date" name="EmpBirthday" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="EmpEmail" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Labor Type</Form.Label>
                                <Form.Control type="text" name="EmpLaborType" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Department</Form.Label>
                                <Form.Control type="text" name="EmpDepartment" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control type="text" name="EmpJobTitle" />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Emp Address</Form.Label>
                                <Form.Control type="text" name="EmpAddress" />
                            </Form.Group>
                        </Col>
                    </Row>
                
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" size="sm"><FaSave/> Save</Button>
            </Modal.Footer>
        </Form>
      </Modal>
    
      <Modal show={ModalImportBatch} size="sm" onHide={CloseModalImportBatch}>
        <Form>    
            <Modal.Header className="bg-success text-white" closeButton>
                <Modal.Title>User Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <a href="/template/employee_import_template.xlsx" download>Download Template</a>
                        </Col>
                        <Col sm={12} md={12} lg={12}>  
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" name="EmpImportFile" />
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" size="sm"><FaSave/> Save</Button>
            </Modal.Footer>
            </Form>
        </Modal>

      <Modal show={ModalDeleteBatch} size="sm" onHide={CloseModalDeleteBatch}>
        <Form>    
            <Modal.Header className="bg-danger text-white" closeButton>
                <Modal.Title>Delete Batch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <p>
                                You will delete all inactive users.<br/>This operation will not affect the historical data of users in the statistics.<br/>Please be careful.
                            </p>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" size="sm"><FaSave/> Save</Button>
            </Modal.Footer>
            </Form>
        </Modal>
        
        </>
    )
}

export default EmpManagement;