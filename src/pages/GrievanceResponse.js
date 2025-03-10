import React, { useEffect, useState } from "react";
import { Col, Row, Form, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import axios from "../axios/axios.js";

const GrievanceResponse = () => {
    const [searchParams]                = useSearchParams();
    const [ dataHeader, setDataHeader ] = useState({});
    const [editorData, setEditorData]   = useState("");
    const grvID = searchParams.get("id");
    
    
    const getDataHeader = async(id) => {
        try {
            const response = await axios.get(`/grievance/header/${id}`);
            if(response.status===200){
                setDataHeader(response.data.data[0]);
            }
        } catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        getDataHeader(grvID);
    },[])

    console.log(dataHeader);
    return (
        <>
        <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2">
            <Card className="border-0 ">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <Row>
                            <Col lg={12}>
                                <h1>{dataHeader.GRV_TITLE || ''}</h1>
                            </Col>
                            <Col lg={12}>
                                <p>{dataHeader.GRV_DESCRIPTION || ''}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                
                            </Col>    
                        </Row>         
                    </div>
                    <div>
                        <Form.Group className="mb-3" controlId="formSearch">
                            
                        </Form.Group>
                    </div>  
                </Card.Header>
                <Card.Body className="text rounded shadow-sm">
                    <Row>
                        <Col sm={12}>
                              
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Col>  
        </Row>
        </>
    )
}

export default GrievanceResponse;