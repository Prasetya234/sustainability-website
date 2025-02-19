import axios from "../axios/axios.js";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";

const PortalPayslip = async() => {
    

    return (
        <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2">
                <Card className="border-0 ">
                    <Card.Header>
                        <Button variant={"primary"} size="sm" ><FaPlus/> ADD </Button>&nbsp; &nbsp;
                        <Button variant={"success"} size="sm" ><FaFileImport/> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                        <Button variant={"danger"} size="sm" ><FaTrash/> DELETE IN BATCH </Button>
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        
                    </Card.Body>
                </Card>
            </Col>
            <Col>

            </Col>
        </Row>
    )
}

export default PortalPayslip;