import axios from '../../axios/axios';
import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from 'react-toastify';

const initialObj = {
    EMP_ID : '',
    ID_COMPANY : '',
    MASA_KERJA : '',
    HAK_CUTI : 12,
    SISA_CUTI : '',
    CUTI_1 : '',
    CUTI_2 : '',
    CUTI_3 : '',
    CUTI_4 : '',
    CUTI_5 : '',
    CUTI_6 : '',
    CUTI_7 : '',
    CUTI_8 : '',
    CUTI_9 : '',
    CUTI_10 : '',
    CUTI_11 : '',
    CUTI_12 : '',
}

const MdlAddCuti = ({show, handleClose, idPerusahaan, getDataCuti}) => {
    const [idSelected, setIdSelected] = useState([])
    const [listId, setListId] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [dataCuti, setDataCuti] = useState(initialObj)

    function hdlChgId(arr){
        if(arr.length !== 0){
            setIdSelected(arr)
            setDataCuti((prev) => {
                return {
                  ...prev,
                  EMP_ID: arr[0].EMP_ID,
                  MASA_KERJA: arr[0].MASA_KERJA,
                };
              });        
            }else{
            setDataCuti((prev) => {
                return {
                    ...prev,
                    EMP_ID: '',
                    MASA_KERJA: '',
                };
            });       
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


    const hitungSisaCuti = (data) => {
        const {
          HAK_CUTI,
          CUTI_1, CUTI_2, CUTI_3, CUTI_4, CUTI_5, CUTI_6,
          CUTI_7, CUTI_8, CUTI_9, CUTI_10, CUTI_11, CUTI_12
        } = data;
    
        if (HAK_CUTI === 0 || HAK_CUTI === '') {
          setDataCuti(prev => ({ ...prev, SISA_CUTI: 0 }));
          return;
        }
    
        const cutiTerisi = [
          CUTI_1, CUTI_2, CUTI_3, CUTI_4, CUTI_5, CUTI_6,
          CUTI_7, CUTI_8, CUTI_9, CUTI_10, CUTI_11, CUTI_12
        ].filter(val => val && val !== '').length;
    
        const sisa = HAK_CUTI - cutiTerisi;
    
        setDataCuti(prev => ({ ...prev, SISA_CUTI: sisa }));
      };

    function handleChangeData(e){
        const {name, value, type} = e.target
        if(type === 'number' && value < 0)return;
        let newData = {...dataCuti}
        if(!value){
            newData[name] = ''
        }else{
            newData[name] = value
        }
        setDataCuti(newData)
        hitungSisaCuti(newData)
    }

   
   async function saveCuti(data) {
    if(!data.EMP_ID) return;
    const dataWidPerusahaan = {...data, ID_COMPANY : idPerusahaan}

    await axios.post(`/personal/add-new-cuti`, dataWidPerusahaan)
    .then(res => {
        if(res.status === 200){
            getDataCuti(idPerusahaan)
            toast.success(res.data.message, {autoClose: 2000})
            handleClose()
        }
    }).catch(err => {
        toast.success('soomthing whrong when add new cuti', {autoClose: 2000})
    })
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
                        <Row className='mb-2'>
                            <Col sm={4}>
                            <Form.Group as={Col} controlId="sisa">
                                <Form.Label>Hak Cuti</Form.Label>
                                <Form.Control onChange={handleChangeData} name='HAK_CUTI' value={dataCuti.HAK_CUTI} size="sm" type="number" />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti1">
                                <Form.Label>Cuti 1</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_1' value={dataCuti.CUTI_1} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti2">
                                <Form.Label>Cuti 2</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_2' value={dataCuti.CUTI_2} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti3">
                                <Form.Label>Cuti 3</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_3' value={dataCuti.CUTI_3} size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti4">
                                <Form.Label>Cuti 4</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_4' value={dataCuti.CUTI_4} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti5">
                                <Form.Label>Cuti 5</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_5' value={dataCuti.CUTI_5} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti6">
                                <Form.Label>Cuti 6</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_6' value={dataCuti.CUTI_6} size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti7">
                                <Form.Label>Cuti 7</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_7' value={dataCuti.CUTI_7} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti8">
                                <Form.Label>Cuti 8</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_8' value={dataCuti.CUTI_8} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti9">
                                <Form.Label>Cuti 9</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_9' value={dataCuti.CUTI_9} size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="cuti10">
                                <Form.Label>Cuti 10</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_10' value={dataCuti.CUTI_10} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti11">
                                <Form.Label>Cuti 11</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_11' value={dataCuti.CUTI_11} size="sm" type="date" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="cuti12">
                                <Form.Label>Cuti 12</Form.Label>
                                <Form.Control onChange={handleChangeData} name='CUTI_12' value={dataCuti.CUTI_12} size="sm" type="date" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col sm={4}>
                            <Form.Group as={Col} controlId="sisa">
                                <Form.Label>Sisa Cuti</Form.Label>
                                <Form.Control  onChange={handleChangeData} name='SISA_CUTI' value={dataCuti.SISA_CUTI} size="sm" type="number" />
                            </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
    </Modal.Body>
    <Modal.Footer className="border-0">
        <Button variant="success" size="sm" onClick={() => saveCuti(dataCuti)} disabled={!dataCuti.EMP_ID}> Save</Button>
        <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
        </Button>
    </Modal.Footer>
</Modal> 
  )
}

export default MdlAddCuti