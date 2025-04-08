import axios from '../../axios/axios';
import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from 'react-toastify';


const MdlAddCuti = ({show, handleClose, idPerusahaan}) => {
    const [idSelected, setIdSelected] = useState([])
    const [listId, setListId] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    function hdlChgId(arr){
        setIdSelected(arr)
        if(arr.length === 0){
            setIdSelected([])
        }
    }

    async function getListEmp(nikOrNama, idPerusahaan) {
        setIsLoading(true);
        await axios
            .get(`/personal/cuti-emp/${idPerusahaan}/${nikOrNama}`)
            .then((res) => {
                if (res.status === 200) {
                    setListId(res.data.data);                    
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                setIsLoading(false);
                return toast.error(err.data.message, { autoClose: 2000 });
            });
        setIsLoading(false);
    }

  return (
    <Modal show={show}>
    <Modal.Header className="bg-success text-mute bg-opacity-50">
        <Modal.Title>Add New Cuti</Modal.Title>
    </Modal.Header>
    <Modal.Body>
            <Row>
                <Col>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="id">
                                <Form.Label>ID - Full Name</Form.Label>
                                <AsyncTypeahead
                                    clearButton
                                    filterBy={()=> true}
                                    id="idemp"
                                    labelKey="empLabel"
                                    minLength={5}
                                    isLoading={isLoading}
                                    onChange={hdlChgId}
                                    onSearch={(qry) => getListEmp(qry, idPerusahaan)}
                                    options={listId}
                                    required
                                />
                               </Form.Group>

                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="dept">
                                <Form.Label>Department</Form.Label>
                                <Form.Control disabled type="text" value={idSelected[0]?.EMP_DEPARTMENT || ''}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="bagian">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control disabled type="text" value={idSelected[0]?.EMP_JOB_TITLE || ''}/>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="tanggalMasuk">
                                <Form.Label>Tanggal Masuk</Form.Label>
                                <Form.Control disabled type="date" value={idSelected[0]?.EMP_ONBOARDINGDATE || ''}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="tanggalKeluar">
                                <Form.Label>Tanggal Keluar</Form.Label>
                                <Form.Control disabled type="date" value={idSelected[0]?.EMP_RESIGN_DATE || ''} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="masaKerja">
                                <Form.Label>Masa Kerja</Form.Label>
                                <Form.Control disabled type="text" value={idSelected[0]?.MASA_KERJA || ''}/>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti1">
                                <Form.Label>Cuti 1</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti2">
                                <Form.Label>Cuti 2</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti3">
                                <Form.Label>Cuti 3</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti4">
                                <Form.Label>Cuti 4</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti5">
                                <Form.Label>Cuti 5</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti6">
                                <Form.Label>Cuti 6</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti7">
                                <Form.Label>Cuti 7</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti8">
                                <Form.Label>Cuti 8</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti9">
                                <Form.Label>Cuti 9</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti10">
                                <Form.Label>Cuti 10</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti11">
                                <Form.Label>Cuti 11</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti12">
                                <Form.Label>Cuti 12</Form.Label>
                                <Form.Control size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col sm={4}>
                            <Form.Group as={Col} controlId="sisa">
                                <Form.Label>Sisa Cuti</Form.Label>
                                <Form.Control size="sm" type="number" />
                            </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
    </Modal.Body>
    <Modal.Footer className="border-0">
        {/* <Button variant="success" size="sm" onClick={() => submitCutti(dataExlCuti)} disabled={dataExlCuti.length===0 ? true:false}><FaUpload/> Upload</Button> */}
        <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
        </Button>
    </Modal.Footer>
</Modal> 
  )
}

export default MdlAddCuti