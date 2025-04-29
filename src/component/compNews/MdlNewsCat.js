import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'

const MdlNewsCat = ({show, handleClose, chgData, newCatData, submitNewCat}) => {
   
  
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
                            <Form.Control type="text" required name='NEWS_CAT_NAME'  value={newCatData.NEWS_CAT_NAME}  onChange={chgData}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="catDesc">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3}  name='NEWS_CAT_DESC' value={newCatData.NEWS_CAT_DESC} onChange={chgData}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="activecat">
                            <Form.Check checked={newCatData.NEWS_CAT_ACTIVE} type="checkbox" label="Check for enable" name='NEWS_CAT_ACTIVE' onChange={chgData}/>
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