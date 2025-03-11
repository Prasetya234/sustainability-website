import React, { useState, useRef } from 'react';
import { Button, Col, Modal, Nav, Row } from 'react-bootstrap';

const ModalChangeBg = ({ mdlChgBg, hdlClsMdlChgBg }) => {
  const [activeTab, setActiveTab] = useState('chg');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      setSelectedImage(URL.createObjectURL(file));
    } else {
      alert('Please select a valid PNG file.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveUpload = () => {
    if (selectedImage) {
      console.log('Image saved:', selectedImage);
      alert('Background image saved successfully!');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    fileInputRef.current.value = null;
  };

  return (
    <Modal size="lg" show={mdlChgBg} onHide={hdlClsMdlChgBg}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Change Background</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
          <Nav.Item>
            <Nav.Link eventKey="chg">Change Bg</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="upload">Upload</Nav.Link>
          </Nav.Item>
        </Nav>
        <Row className="mt-3">
          {activeTab === 'upload' && (
            <Col className="text-center">
              <input
                type="file"
                accept="image/png"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {!selectedImage && (
              <Button variant="primary" size="sm" onClick={handleUploadClick}>
                Upload New Background
              </Button>

              )}
              {selectedImage && (
                <div className="mt-3">
                  <img src={selectedImage} alt="Preview" style={{ maxWidth: '450px', height: '350px' }} />
                  <div className="mt-2">
                    <Button variant="success" size="sm" className="me-2" onClick={handleSaveUpload}>
                      Save Upload
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleRemoveImage}>
                      Remove 
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button size="sm" variant="secondary" onClick={hdlClsMdlChgBg}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChangeBg;
