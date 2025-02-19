//import axios from "../axios/axios.js";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";

const PortalPayslip = () => {
    

    return (
        <Row className="mx-0 mt-3">
            <Col sm={12} className="ps-3 p-2">
                <Card className="border-0 ">
                    <Card.Header>
                        <Button variant={"primary"} size="sm" ><FaPlus/> ADD </Button>&nbsp; &nbsp;
                        <Button variant={"success"} size="sm" ><FaFileImport/> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                        <Button variant={"danger"} size="sm" ><FaTrash/> DELETE IN BATCH </Button>
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Year / Month</th>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Salary</th>
                                    
                                </tr>
                            </thead>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
            <Col>

            </Col>
        </Row>
    )
}

export default PortalPayslip;