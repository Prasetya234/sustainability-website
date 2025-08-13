import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Form, Button, Modal } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../auth/AuthProvider.js";
import { toast } from "react-toastify";

const MasterPicListMain = () => {
  const { value } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [dataMasterPicList, setDataMasterPicList] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [selectedPic, setSelectedPic] = useState(null);
  const [modalAddEdit, setModalAddEdit] = useState(false);
  const [formData, setFormData] = useState({
    TITLE: "",
    DESCRIPTION: "",
    MEMBER_LIST_ID: [],
  });

  const getAllMasterPicLists = async () => {
    try {
      const { data } = await axios.get("/investigation/pic-list");
      setDataMasterPicList(data.data);
    } catch (err) {
      toast.error("Error fetching Master PIC Lists.");
    }
  };

  const getListUser = async (companyId) => {
    try {
      const response = await axios.get(`/user?id_perusahaan=${companyId}`);
      if (response.status === 200) {
        setListUser(response.data);
      }
    } catch (err) {
      toast.error("Error fetching user list.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberChange = (e, userId) => {
    const { checked } = e.target;
    setFormData((prev) => {
      const memberIds = [...prev.MEMBER_LIST_ID];
      if (checked) {
        if (!memberIds.includes(userId)) memberIds.push(userId);
      } else {
        const index = memberIds.indexOf(userId);
        if (index !== -1) memberIds.splice(index, 1);
      }
      return { ...prev, MEMBER_LIST_ID: memberIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, MEMBER_LIST_ID: formData.MEMBER_LIST_ID };
      if (selectedPic) {
        await axios.put(`/investigation/pic-list/${selectedPic.ID}`, payload);
        toast.success("Master PIC List updated successfully.");
      } else {
        await axios.post("/investigation/pic-list", payload);
        toast.success("Master PIC List created successfully.");
      }
      setModalAddEdit(false);
      setSelectedPic(null);
      setFormData({ TITLE: "", DESCRIPTION: "", MEMBER_LIST_ID: [] });
      getAllMasterPicLists();
    } catch (err) {
      toast.error("Error saving Master PIC List.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/investigation/pic-list/${id}`);
      toast.success("Master PIC List deleted successfully.");
      getAllMasterPicLists();
    } catch (err) {
      toast.error("Error deleting Master PIC List.");
    }
  };

  const handleEdit = (pic) => {
    setSelectedPic(pic);
    setFormData({
      TITLE: pic.TITLE,
      DESCRIPTION: pic.DESCRIPTION,
      MEMBER_LIST_ID: pic.MEMBER_LIST.map((member) => member.USER_ID),
    });
    setModalAddEdit(true);
  };

  useEffect(() => {
    getAllMasterPicLists();
    if (idPerusahaan) getListUser(idPerusahaan);
  }, [idPerusahaan]);

  return (
    <Row className="mx-0 mt-3">
      <Col className="ps-3 p-2">
        <Card className="border-0">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5>Master PIC List</h5>
            </div>
            <div>
              <Button variant="primary" size="sm" onClick={() => { setModalAddEdit(true); setSelectedPic(null); setFormData({ TITLE: "", DESCRIPTION: "", MEMBER_LIST_ID: [] }); }} className="me-2">
                <FaPlus /> Add
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="text rounded shadow-sm">
            <Row>
              <Col sm={12}>
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Title</th>
                      <th style={{ width: "30%" }}>Description</th>
                      <th style={{ width: "30%" }}>Members</th>
                      <th style={{ width: "20%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataMasterPicList.map((item) => (
                      <tr key={item.ID}>
                        <td className="py-3">{item.TITLE}</td>
                        <td className="py-3">{item.DESCRIPTION}</td>
                        <td className="py-3">
                          {item.MEMBER_LIST.map((member) => member.USER_NAME).join(", ")}
                        </td>
                        <td className="py-3">
                          <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="me-2">
                            <FaEdit /> Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(item.ID)}>
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={modalAddEdit} onHide={() => { setModalAddEdit(false); setSelectedPic(null); setFormData({ TITLE: "", DESCRIPTION: "", MEMBER_LIST_ID: [] }); }} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPic ? "Edit Master PIC List" : "Add Master PIC List"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="mx-4">
            <Row>
              <Col sm={12} className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control type="text" name="TITLE" value={formData.TITLE} onChange={handleInputChange} required />
              </Col>
              <Col sm={12} className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} name="DESCRIPTION" value={formData.DESCRIPTION} onChange={handleInputChange} />
              </Col>
              <Col sm={12}>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Full Name</th>
                      <th>Username Backend</th>
                      <th>Username Aplikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listUser.map((user) => {
                      const isChecked = formData.MEMBER_LIST_ID.includes(user.USER_ID);
                      return (
                        <tr key={user.USER_ID}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              id={`checkuser-${user.USER_ID}`}
                              checked={isChecked}
                              onChange={(e) => handleMemberChange(e, user.USER_ID)}
                            />
                          </td>
                          <td>{user.USER_INISIAL || "N/A"}</td>
                          <td>{user.USER_NAME || "N/A"}</td>
                          <td>
                            <Form.Control
                              size="sm"
                              type="text"
                              name="EMP_USERNAME"
                              value={formData.MEMBER_LIST_ID.includes(user.USER_ID) ? user.USER_NAME : ""}
                              onChange={(e) => handleMemberChange(e, user.USER_ID)}
                              disabled={!isChecked}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setModalAddEdit(false); setSelectedPic(null); setFormData({ TITLE: "", DESCRIPTION: "", MEMBER_LIST_ID: [] }); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedPic ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Row>
  );
};

export default MasterPicListMain;