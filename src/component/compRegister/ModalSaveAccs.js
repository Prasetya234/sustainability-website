import { Modal, Button } from "react-bootstrap";
import axios from "../../axios/axios";
import { toast } from "react-toastify";

const ModalSaveAccs = ({ showModalAccs, handleCloseAccs, arrNewMenu }) => {
  const saveResultAcc = () => {
    arrNewMenu.map(async (menu, i) => {
      await axios
        .post(`/useraccess/${menu.USER_ID}/${menu.MENU_ID}`, menu)
        .then((res) => {
          if (i + 1 === arrNewMenu.length)
            return toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error('Somthing Wrong When Save User', {autoClose: 2000});
        });
    });

    handleCloseAccs();
  };

  return (
    <>
      <Modal
        show={showModalAccs}
        onHide={handleCloseAccs}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>Save Setting User Access?</Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleCloseAccs}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={() => saveResultAcc()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalSaveAccs;
