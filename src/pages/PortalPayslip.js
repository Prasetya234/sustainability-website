//import axios from "../axios/axios.js";
import moment from "moment";
import axios from "../axios/axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const PortalPayslip = () => {
    const [ListPayslip, setListPayslip ] = useState([]);

    
    const getDataPaySlip = async(year, month) => {
        const getData = await axios.get(`/personal/payslip/${year}/${month}`);
        if(getData.status===200){
            setListPayslip(getData.data.data);
        } else if(getData.status===500) {
            toast.warning('Cannot Load Payslip Data');
        }
    }

    useEffect(() => {
        getDataPaySlip(moment().format('YYYY'), moment().format('MM'));
    }, []);

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
                                    <th>Gross Salary</th>
                                    <th>Net Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                            { ListPayslip && ListPayslip.map((item, index ) => (
                                <tr key={index}>
                                    <th>{item.PAYSLIP_YEAR}</th>
                                    <th>{item.PAYSLIP_MONTH}</th>
                                    <th>{item.EMP_ID}</th>
                                    <th>{item.EMP_NAME}</th>
                                    <th>{item.EMP_DEPT}</th>
                                    <th>{item.EMP_COMPANY}</th>
                                    <th>{item.EMP_JOBTITLE}</th>
                                    <th>{item.EMP_BIRTHDAY}</th>
                                    <th>{item.EMP_ONBOARDING_DATE}</th>
                                    <th>{item.EMP_RESIGN_DATE}</th>
                                    <th>{item.BASIC_SALARY}</th>
                                    <th>{item.GROSS_SALARY}</th>
                                    <th>{item.NET_SALARY}</th>
                                </tr>

                                ))}
                            </tbody>
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