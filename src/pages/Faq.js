import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";


const initialFaq = (companyId) => ({
  COMPANY_ID: companyId, 
  TITLE: "",
  DESCRIPTION: "", 
  CATEGORY: "GENERAL", 
});

const Faq = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [listFaqs, setListFaqs] = useState([]);
  const [faqFormData, setFaqFormData] = useState(initialFaq(idPerusahaan)); 
  const [modalAdd, setModalAdd] = useState(false);
  const [actType, setActType] = useState("Create");

  
  const editorRef = useRef(null);

  
  const categories = [{ name: "General", value: "GENERAL" }];

  
  const getFaqs = async () => {
    try {
      const response = await axios.get(`/faq?companyId=${idPerusahaan}`);
      if (response.status === 200) {
        setListFaqs(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to retrieve FAQs", { autoClose: 3000 });
    }
  };

  
  const createFaq = async (data) => {
    try {
      const response = await axios.post("/faq", data);
      if (response.status === 201) {
        toast.success("FAQ created successfully", { autoClose: 3000 });
        getFaqs();
      }
    } catch (error) {
      toast.error("Failed to create FAQ", { autoClose: 3000 });
    }
  };

  
  const updateFaq = async (id, data) => {
    try {
      const response = await axios.put(`/faq/${id}`, data);
      if (response.status === 200) {
        toast.success("FAQ updated successfully", { autoClose: 3000 });
        getFaqs();
      }
    } catch (error) {
      toast.error("Failed to update FAQ", { autoClose: 3000 });
    }
  };

  
  const deleteFaq = async (id) => {
    try {
      const response = await axios.delete(`/faq/${id}`);
      if (response.status === 200) {
        toast.success("FAQ deleted successfully", { autoClose: 3000 });
        getFaqs();
      }
    } catch (error) {
      toast.error("Failed to delete FAQ", { autoClose: 3000 });
    }
  };

  
  const handleOpenModal = (type = "Create", faqData = null) => {
    if (type === "Edit" && faqData) {
      setFaqFormData(faqData);
      if (editorRef.current) {
        editorRef.current.value = faqData.DESCRIPTION; 
      }
    } else {
      setFaqFormData(initialFaq(idPerusahaan));
      if (editorRef.current) {
        editorRef.current.value = ""; 
      }
    }
    setActType(type);
    setModalAdd(true);
  };

  
  const hdlMdlClose = () => {
    setModalAdd(false);
    setFaqFormData(initialFaq(idPerusahaan));
    if (editorRef.current) {
      editorRef.current.value = ""; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const description = editorRef.current?.value || "";
      const updatedData = { ...faqFormData, DESCRIPTION: description };

      if (actType === "Create") {
        await createFaq(updatedData);
      } else {
        await updateFaq(updatedData.ID, updatedData);
      }
      hdlMdlClose();
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 3000 });
    }
  };

  
  useEffect(() => {
    getFaqs();
  }, []);

  return (
    <div className="container">
      {/* Header and Add Button */}
      <Row className="m-0 mt-2">
        <Col>
          <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
            Add FAQ
          </Button>
        </Col>
      </Row>

      {/* FAQ Table */}
      <Row className="mt-3">
        <Col>
          <Table responsive hover className="text-muted">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listFaqs.map((faq) => (
                <tr key={faq.ID}>
                  <td>{faq.TITLE}</td>
                  <td>{faq.CATEGORY}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleOpenModal("Edit", faq)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        Swal.fire({
                          text: `Are you sure you want to delete this FAQ?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "Cancel",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await deleteFaq(faq.ID);
                          }
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal for Add/Edit FAQ */}
      <Modal show={modalAdd} onHide={hdlMdlClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actType === "Create" ? "Add FAQ" : "Edit FAQ"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={faqFormData.TITLE}
                onChange={(e) =>
                  setFaqFormData({ ...faqFormData, TITLE: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <input
                id="trixInput"
                type="hidden"
                value={faqFormData.DESCRIPTION}
                onChange={(e) =>
                  setFaqFormData({ ...faqFormData, DESCRIPTION: e.target.value })
                }
              />
              <trix-editor ref={editorRef} style={{ height: "200px" }} input="trixInput"></trix-editor>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={faqFormData.CATEGORY}
                onChange={(e) =>
                  setFaqFormData({ ...faqFormData, CATEGORY: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Faq;