import React from 'react'
import axios from '../../axios/axios';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { toast } from 'react-toastify';

const MdlNewsCat = ({show, handleClose, newCatData, setNewCatData, userId, idPerusahaan, getNewsCategory}) => {
    function chgData(e){
        const {name, value} = e.target;
        
        if(name !== 'NEWS_CAT_ACTIVE'){
        setNewCatData(prev => {
            return {...prev, [name]: value};
        });}else{            
            setNewCatData(prev => {
                return {...prev, [name]: value ? 1 : 0};
            });
        }
    }
    

    async function submitNewCat(data) {
        if(!data.NEWS_CAT_NAME) return;
        const dataPost = {...data, ID_COMPANY : idPerusahaan, NEWS_CAT_ADD_ID : userId}
        
        await axios.post('/news/category', dataPost)
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {autoClose : 2000})
                getNewsCategory(idPerusahaan)
                handleClose()
            }
            if(res.status === 202){
                toast.error(res.data.message, {autoClose : 2000})
            }
        }).catch(err => {
            console.log(err)
            toast.error('Somthing whrong when add new categor y', {autoClose: 2000})
        })
    }
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header className='border-0' closeButton>
             <Modal.Title>New News Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className="mb-3" controlId="catName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" required name='NEWS_CAT_NAME'  value={newCatData.NEW_CAT_NAME}  onChange={chgData}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="catDesc">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3}  name='NEWS_CAT_DESC' value={newCatData.NEW_CAT_DESC} onChange={chgData}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="activecat">
                            <Form.Check value={newCatData.NEWS_CAT_ACTIVE} type="checkbox" label="Check for enable" name='NEWS_CAT_ACTIVE' onChange={chgData}/>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer  className='border-0'>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => submitNewCat(newCatData)}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default MdlNewsCat