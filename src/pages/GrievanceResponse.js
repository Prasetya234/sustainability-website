import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Form, Card, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import axios from "../axios/axios.js";
import moment from "moment";
import { AuthContext } from "../auth/AuthProvider.js";
import { toast } from "react-toastify";


const GrievanceResponse = () => {
    const { value }                     = useContext(AuthContext);
    const [searchParams]                = useSearchParams();
    const [ dataHeader, setDataHeader ] = useState({ GRV_TITLE: "" });
    const [ dataRespon, setDataRespon ] = useState([]);
    const grvID                         = searchParams.get("id");
    const [messages, setMessages ]      = useState({ GRV_MESSAGES:"" });
    const maxChars = 1000; 
    const IDUser                        = value.userId;
    

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

    const getDataRespon = async(id) => {
        try {
            const response = await axios.get(`/grievance/respon/${id}`);
            if(response.status===200){
                setDataRespon(response.data.data);
            }
        } catch(err){
            console.error(err);
        }
    }

    const ocMessages = (event) => {
        const { name, value } = event.target;
        setMessages((prevData) => ({
            ...prevData,
            [name]: value,
            GRV_ID: grvID,
            GRV_RESPON_BY: IDUser
        }));
    }

    const submitMessages = async()=> {
        try {
            const action = await axios.post('/grievance/respon', { dataRespon: messages });
            if(action.status === 200){
                getDataHeader(grvID);
                getDataRespon(grvID);
                setMessages({ GRV_MESSAGES:"" });
            }
        } catch(err){
            toast.warning('Gagal Posting Respon!');
        }
    }

    useEffect(() => {
        getDataHeader(grvID);
        getDataRespon(grvID);
    },[])

    console.log(messages);

    return (
        <>
        <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2">
                <Card className="border-0 ">
                    <Card.Header className="align-items-center">
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                    <h1>{dataHeader.GRV_TITLE}</h1>
                                    <p>{dataHeader.GRV_DESCRIPTION}</p>
                                    <p style={{textDecoration:'overline'}}>Dilaporkan pada { moment(dataHeader.GRV_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss') || ''} oleh { dataHeader.GRV_SUBMIT_NAME}</p>
                                </Card>
                                <br/>
                            </Col>
                        </Row>
                        {dataRespon && dataRespon.map((item, index) => 
                            <Row key={index}>
                            <Col sm={12} md={12} lg={12}>
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                    <p>{item.GRV_MESSAGES || ''}</p>
                                    <p style={{textDecoration:'overline'}}>Direspon pada { moment(item.GRV_RESPON_DATE).format('DD-MM-YYYY HH:mm:ss') || ''} oleh <i>{ item.GRV_RESPON_NAME || ''}</i></p>
                                </Card>
                                <br/>
                            </Col>
                        </Row>
                        )}   
                </Card.Header>
                <Card.Body className="text rounded">
                    <Row>
                        <Col sm={12}>
                        <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }}>
                                <Form>
                                    <Form.Group controlId="tweetText">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Balas..."
                                        value={messages.GRV_MESSAGES}
                                        name="GRV_MESSAGES"
                                        onChange={ocMessages}
                                        maxLength={maxChars}
                                        className="mb-2"
                                    />
                                    </Form.Group>
                                    <div className="d-flex justify-content-between align-items-center">
                                    <small className={(messages.GRV_MESSAGES).length === maxChars ? "text-danger" : "text-muted"}>
                                        {messages.GRV_MESSAGES.length}/{maxChars}
                                    </small>
                                    <Button
                                        variant="primary"
                                        disabled={messages.GRV_MESSAGES.trim().length === 0}
                                        onClick={submitMessages}
                                    >
                                        Post
                                    </Button>
                                    </div>
                                </Form>
                            </Card>
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