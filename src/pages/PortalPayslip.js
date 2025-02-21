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
                            <thead className="text-center">
                                <tr>
                                    <th>Year</th>
                                    <th>Month</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Departemen</th>
                                    <th>Company</th>
                                    <th>Job Title</th>
                                    <th>Status</th>
                                    <th>Birthday</th>
                                    <th>Onboarding Date</th>
                                    <th>Resign Date</th>
                                    <th>Basic Salary</th>
                                    <th>Prorate Salary</th>
                                    <th>Grading Allowance</th>
                                    <th>Work Length Allowance</th>
                                    <th>Job Title Allowance</th>
                                    <th>Non-Fixed Allowance</th>
                                    <th>Skill Allowance</th>
                                    <th>Working Day Total</th>
                                    <th>Working Hour Total</th>
                                    <th>Total Hour OT 1</th>
                                    <th>Total Hour OT 2</th>
                                    <th>OT Holiday</th>
                                    <th>OT Work Day 1</th>
                                    <th>OT Work Day 2</th>
                                    <th>OT Holiday</th>
                                    <th>Attendance Premi</th>
                                    <th>Eating Cost</th>
                                    <th>Menstrual Allowance</th>
                                    <th>Transport Allowance</th>
                                    <th>Reward Target</th>
                                    <th>Shift Allowance</th>
                                    <th>Absentee</th>
                                    <th>Gross Salary</th>
                                    <th>Union</th>
                                    <th>PPh / Tax</th>
                                    <th>Jamsostek</th>
                                    <th>Net Salary</th>
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