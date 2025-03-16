import React, { useContext, useEffect, useState, useRef } from "react";
import { Col, Row, Form, Card, Button, Table, Modal } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import axios from "../axios/axios.js";
import moment from "moment";
import { AuthContext } from "../auth/AuthProvider.js";
import { toast } from "react-toastify";
import { FaMessage } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import "trix/dist/trix.css";
import "trix";

const GrievanceResponse = () => {
    const editorRef                     = useRef(null);
    const { value }                     = useContext(AuthContext);
    const IDUser                        = value.userId;
    const [searchParams]                = useSearchParams();
    const grvID                         = searchParams.get("id");
    const [ dataHeader, setDataHeader ] = useState({ GRV_TITLE: " " });
    const [ dataRespon, setDataRespon ] = useState([]);
    const [ ModalClose, setModalClose ] = useState(false);
    const [messages, setMessages ]      = useState({ GRV_MESSAGES:"",GRV_ID: grvID, GRV_RESPON_BY: IDUser });
    const maxChars = 1000; 
    

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

    const SignPriorityCat = (id) => {
        let status;
        switch(id){
            case 1:
                status = '🔴 TINGGI';
            break;
            case 2:
                status = '🟡 MODERATE';
            break;
            case 3:
                status = '🟢 RENDAH';
            break;
            default:
                status = '🟢 RENDAH';
            break;
        }
        return status;
    }

    const OpenModalClose = () => {
        setModalClose(true);
    }

    const CompleteGrievance = async() => {
        const action = await axios.post(`/grievance/set-close?grvid=${grvID}&by=${IDUser}`);
        if(action.status===200){
            getDataHeader(grvID);
            getDataRespon(grvID);
            toast.success("Berhasil menutup Grievance!");
            setModalClose(false);
        }
    }


    useEffect(() => {
        getDataHeader(grvID);
        getDataRespon(grvID);
    },[grvID]);

    useEffect(() => {
        const editor = editorRef.current;
        
        editor.addEventListener("trix-file-accept", (event) => {
            event.preventDefault(); // Prevent file uploads
        });
        
        editor.addEventListener("trix-change", (event) => {
            setMessages((prevData) => ({
                ...prevData,
                GRV_MESSAGES: event.target.value
            }));
        });
    
        return () => {
          editor.removeEventListener("trix-change", () => {});
          editor.removeEventListener("trix-file-accept", () => {});
        };
      }, []);

    return (
        <>
        <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2" lg={8}>
                <Card className="border-0 ">
                    <Card.Header className="align-items-center">
                        <Row>
                            <Col sm={12}>
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", maxHeight:"100%", margin: "auto" }} >
                                    <h1>{dataHeader.GRV_TITLE}</h1>
                                    <p>{dataHeader.GRV_DESCRIPTION}</p>
                                    <p style={{textDecoration:'overline'}}>Dilaporkan pada { moment(dataHeader.GRV_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss') || ''} oleh { dataHeader.GRV_SUBMIT_NAME}</p>
                                    <br/>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <br/>    
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                    <i><FaMessage /> Balas dengan respon di bawah </i>
                                </Card>
                                <br/>
                            </Col>
                        </Row>
                        {dataRespon && dataRespon.map((item, index) => 
                        <Row key={index}>
                            <Col sm={12}>
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                    {/* <p>{item.GRV_MESSAGES || ''}</p> */}
                                    <div dangerouslySetInnerHTML={{ __html: item.GRV_MESSAGES }} />
                                    <br/>
                                    <p style={{textDecoration:'overline'}}><FaReply/> Direspon pada { moment(item.GRV_RESPON_DATE).format('DD-MM-YYYY HH:mm:ss') || ''} oleh <i>{ item.GRV_RESPON_NAME || ''}</i></p>
                                </Card>
                                <br/>
                            </Col>
                        </Row>
                        )}   
                </Card.Header>
                <Card.Body className="text rounded">
                    <Row>
                        <Col sm={12}>
                        { dataHeader.GRV_STATUS!=="COMPLETE" && (
                            <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }}>
                                <Form>
                                    <Form.Group controlId="tweetText">
                                        {/* <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Balas..."
                                            value={messages.GRV_MESSAGES}
                                            name="GRV_MESSAGES"
                                            onChange={ocMessages}
                                            maxLength={maxChars}
                                            className="mb-2"
                                        /> */}
                                        <input id="trixInput" type="hidden" value={messages.GRV_MESSAGES} />
                                        <trix-editor ref={editorRef} input="trixInput"></trix-editor>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between align-items-center">
                                    <small className={(messages.GRV_MESSAGES).length === maxChars ? "text-danger" : "text-muted"}>
                                        {messages.GRV_MESSAGES.length}/{maxChars}
                                    </small>
                                    <Button variant="primary" disabled={messages.GRV_MESSAGES.trim().length === 0} onClick={submitMessages}>Post</Button>
                                    </div>
                                </Form>
                            </Card>
                        )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
        <Col className="ps-3 p-2" lg={3}>
            <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                <Table>
                    <tr>
                        <td className="py-2"><b>KATEGORI</b></td>
                        <td><b>: {dataHeader.GRV_CATEGORY_NAME}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>SUB KATEGORI</b></td>
                        <td><b>: {dataHeader.GRV_SUBCATEGORY_NAME}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>STATUS</b></td>
                        <td><b>: {dataHeader.GRV_STATUS}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>PRIORITAS</b></td>
                        <td><b>: {SignPriorityCat(dataHeader.GRV_PRIORITY)}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>BATAS WAKTU RESPON</b></td>
                        <td><b>: {moment(dataHeader.GRV_DEADLINE_PROCESS).format('DD-MM-YYYY HH:mm:ss')}</b></td>
                    </tr>
                    { dataHeader.GRV_STATUS==="COMPLETE" && (
                    <tr>
                        <td className="py-2"><b>DITUTUP OLEH / WAKTU</b></td>
                        <td><b>: {dataHeader.GRV_CLOSE_NAME}  /  {moment(dataHeader.GRV_CLOSE_DATE).format('DD-MM-YYYY HH:mm:ss')}</b></td>
                    </tr>
                    )}
                    <br/>
                    { dataHeader.GRV_STATUS!=="COMPLETE" && (
                        <tr>
                            <td>
                                <div className="d-grid gap-2">
                                    <Button variant="primary" onClick={OpenModalClose}>TUTUP GRIEVANCE</Button>
                                </div>
                            </td>
                        </tr>
                        
                    )}
                    
                </Table>
                
            </Card>
        </Col>
    </Row>

        <Modal show={ModalClose} size="sm" onHide={()=> setModalClose(false)}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title> Tutup Grievance </Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12} className="mb-3">
                            Apakah Anda yakin akan menutup Grievance ini? 
                        </Col>
                        <Col lg={12} className="d-flex-1 text-center">
                            <Button variant="danger" onClick={CompleteGrievance}>YA</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="secondary" onClick={()=> setModalClose(false)}>TIDAK</Button>     
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>

        </>
    )
}

export default GrievanceResponse;