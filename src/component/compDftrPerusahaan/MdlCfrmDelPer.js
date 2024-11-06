import React from "react";
import { Col, Row, Button, Modal } from "react-bootstrap";

const MdlCfrmDelPer = ({
  show,
  modalClose,
  perushaan,
  handleExeDelete,
  type,
}) => {
  return (
    <Modal show={show} onHide={modalClose} size="sm">
      <Modal.Body className="text-center">
        <p className="mb-0 p-0">Anda Yakin Akan Hapus Dokumen</p>
        {type ? (
          <>
            <span className="fs-5">
              {perushaan.NOMOR_DOKUMEN} - {perushaan.NAMA_PERUSAHAAN}
            </span>
            <br></br>
            <p>Dari Daftar perushaan?</p>
          </>
        ) : (
          <>
            <span className="fs-5">{perushaan.NAMA_PERUSAHAAN}</span>
            <br></br>
            <p>Dari Daftar perushaan?</p>
          </>
        )}
        <Row className="mt-3 justify-content-around">
          <Col>
            <Button size="sm" variant="secondary" onClick={modalClose}>
              Cancel
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                handleExeDelete(type ? perushaan.ID : perushaan.ID_PERUSAHAAN)
              }
            >
              Yes
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MdlCfrmDelPer;
