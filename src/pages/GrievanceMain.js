import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Form } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";


const GrievanceMain = () => {
    const [ Periode, setPeriode ]               = useState({ StartDate: moment().format('YYYY-MM-DD'), EndDate: moment().format('YYYY-MM-DD')});
    const [ dataGrievance, setDataGrievance ]   = useState([]);

    const getDataGrievance = async(start, end) => {
        try {
            const response = await axios.get(`/grievance/list/${start}/${end}`);
            if(response.status===200){
                setDataGrievance(response.data.data);
            }
        } catch(err){
            console.log(err);
        }
    }

    const selectPeriode = (event) => {
        const { name, value } = event.target;
        setPeriode({ ...Periode, [name]: value });
    }

    useEffect(() => {
        const InitDataGrievance = async() => {
            const start = moment().format('YYYY-MM-DD');
            const end   = moment().format('YYYY-MM-DD');
            await getDataGrievance(start, end);
        };
        InitDataGrievance();
    }, [])

    console.log(dataGrievance);

    return (
        <>
        <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2">
            <Card className="border-0 ">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formStartDate">
                                    <Form.Control size="sm" type="date" defaultValue={Periode.StartDate} name="StartDate" onChange={selectPeriode}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                _
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formEndDate">
                                    <Form.Control size="sm" type="date" defaultValue={Periode.EndDate} name="EndDate" onChange={selectPeriode}/>
                                </Form.Group>
                            </Col>
                        </Row>         
                    </div>
                    <div>
                        <Form.Group className="mb-3" controlId="formSearch">
                            <Form.Control type="text" placeholder="Pencarian..." name="Search"/>
                        </Form.Group>
                    </div>  
                </Card.Header>
                <Card.Body className="text rounded shadow-sm">
                    <Row>
                        <Col sm={12}>
                            <Table hover striped size="sm">
                                <thead>
                                    <tr>
                                        <th>TANGGAL POSTING</th>
                                        <th>PENGIRIM</th>
                                        <th>KATEGORI</th>
                                        <th>SUBKATEGORI</th>
                                        <th>PRIORITAS</th>
                                        <th>BATAS WAKTU PROSES</th>
                                        <th>OPSI</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </>
    )
}

export default GrievanceMain;