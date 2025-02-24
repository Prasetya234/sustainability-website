import React from "react";
import { Image, Modal } from "react-bootstrap";

const ViewImgProfile = ({ show, handleClose, dataImg }) => {
  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header className="border-0" closeButton>
      </Modal.Header>
      <Modal.Body className="text-center p-3 pb-5">
        <Image src={dataImg} roundedCircle width={450} height={450}/>
      </Modal.Body>
    </Modal>
  );
};

export default ViewImgProfile;
