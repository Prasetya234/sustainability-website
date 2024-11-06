import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "../../axios/axios";
import { toast } from "react-toastify";

const ModalDelete = ({ showModal, handleClose, idUserDelete, getUsers }) => {
  const deleteUser = async (id) => {
    await axios
      .patch(`/user/delete/${id}`, {
        USER_DELETE_STATUS: 1,
      })
      .then((res) => toast.success(res.data.message, { autoClose: 3000 }))
      .catch((err) => toast.error(err.response.message));
    handleClose();
    getUsers();
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>Want to delete User?</Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => deleteUser(idUserDelete)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDelete;
