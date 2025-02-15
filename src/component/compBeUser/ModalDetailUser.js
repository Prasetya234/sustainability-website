import moment from "moment";
import React from "react";
import { Button, Modal, Table } from "react-bootstrap";

const ModalDetailUser = ({ show, handleClose, dataUser }) => {
  return (
    <Modal show={show} size="lg" onHide={handleClose}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Detail</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table bordered responsive hover className="text-muted">
          <tbody>
            <tr style={{height: '60px'}} className="align-middle">
              <td className="bg-secondary bg-opacity-10">Username</td>
              <td>{dataUser.USER_NAME}</td>
              <td className="bg-secondary bg-opacity-10">Full Name</td>
              <td>{dataUser.USER_INISIAL}</td>
            </tr>
            <tr style={{height: '60px'}} className="align-middle">
              <td className="bg-secondary bg-opacity-10">Role Name</td>
              <td>{dataUser.BE_NAME}</td>
              <td className="bg-secondary bg-opacity-10">Status</td>
              <td>{dataUser.USER_AKTIF_STATUS ? 'Enabled' : 'Disabled'}</td>
            </tr>
            <tr style={{height: '60px'}} className="align-middle">
              <td className="bg-secondary bg-opacity-10">Email</td>
              <td>{dataUser.USER_EMAIL}</td>
              <td className="bg-secondary bg-opacity-10">Phone</td>
              <td>
                {dataUser.KODE_TEL} {dataUser.USER_TEL}
              </td>
            </tr>
            <tr style={{height: '60px'}} className="align-middle">
              <td className="bg-secondary bg-opacity-10">Summary</td>
              <td colSpan={3}>{dataUser.SUMMARY}</td>
            </tr>
            <tr style={{height: '60px'}} className="align-middle">
              <td className="bg-secondary bg-opacity-10">Time Created</td>
              <td>{dataUser.USER_ADD_DATE ? moment(dataUser.USER_ADD_DATE).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
              <td className="bg-secondary bg-opacity-10">Time Updated</td>
              <td>{dataUser.USER_MOD_DATE ? moment(dataUser.USER_ADD_DATE).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          size="sm"
          className="me-2"
          variant="primary"
          onClick={handleClose}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetailUser;
