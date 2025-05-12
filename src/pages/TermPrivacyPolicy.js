import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import "trix/dist/trix.css";
import "trix";


const initialPrivacyPolicy = (companyId) => ({
  COMPANY_ID: companyId, 
  DESCRIPTION: "",
  CATEGORY: "", 
});

const PrivacyPolicy = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [listPolicies, setListPolicies] = useState([]);
  const [policyFormData, setPolicyFormData] = useState(initialPrivacyPolicy(idPerusahaan));
  const [modalAdd, setModalAdd] = useState(false);
  const [actType, setActType] = useState("Create");

  
  const categories = [
    { name: "Privacy Policy", value: "PRIVACY_POLICY" },
    { name: "Term About APP", value: "TERM_APP" },
  ];

  
  const editorRef = useRef(null);

  
  const getPolicies = async () => {
    try {
      const response = await axios.get(`/term-privacy-policy?companyId=${idPerusahaan}`);
      if (response.status === 200) {
        setListPolicies(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to retrieve Privacy Policies", { autoClose: 3000 });
    }
  };

  
  const createPolicy = async (data) => {
    try {
      const response = await axios.post("/term-privacy-policy", data);
      if (response.status === 201) {
        toast.success("Privacy Policy created successfully", { autoClose: 3000 });
        getPolicies();
      }
    } catch (error) {
      toast.error("Failed to create Privacy Policy", { autoClose: 3000 });
    }
  };

  
  const updatePolicy = async (id, data) => {
    try {
      const response = await axios.put(`/term-privacy-policy/${id}`, data);
      if (response.status === 200) {
        toast.success("Privacy Policy updated successfully", { autoClose: 3000 });
        getPolicies();
      }
    } catch (error) {
      toast.error("Failed to update Privacy Policy", { autoClose: 3000 });
    }
  };

  
  const deletePolicy = async (id) => {
    try {
      const response = await axios.delete(`/term-privacy-policy/${id}`);
      if (response.status === 200) {
        toast.success("Privacy Policy deleted successfully", { autoClose: 3000 });
        getPolicies();
      }
    } catch (error) {
      toast.error("Failed to delete Privacy Policy", { autoClose: 3000 });
    }
  };

  
  const handleOpenModal = (type = "Create", policyData = null) => {
    try {
      console.log(editorRef.current);
      
    if (type === "Edit" && policyData) {
      setPolicyFormData(policyData);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.editor.loadHTML(policyData.DESCRIPTION || ""); 
        }
      }, 0); 
    } else {
      setPolicyFormData(initialPrivacyPolicy(idPerusahaan));
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.editor.loadHTML(""); 
        }
      }, 0);
    }
    setActType(type);
    setModalAdd(true);
    } catch (err) {
      console.log(err);
       
    }
  };

  
  const hdlMdlClose = () => {
    setModalAdd(false);
    setPolicyFormData(initialPrivacyPolicy(idPerusahaan));
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.editor.loadHTML(""); 
      }
    }, 0);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const description = editorRef.current?.value || "";
      const updatedData = { ...policyFormData, DESCRIPTION: description };

      if (actType === "Create") {
        await createPolicy(updatedData);
      } else {
        await updatePolicy(updatedData.ID, updatedData);
      }
      hdlMdlClose();
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 3000 });
    }
  };

  
  useEffect(() => {
    getPolicies();
  }, []);

  return (
    <div className="container">
      {/* Header and Add Button */}
      <Row className="m-0 mt-2">
        <Col>
          <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
            Add Privacy Policy
          </Button>
        </Col>
      </Row>

      {/* Privacy Policy Table */}
      <Row className="mt-3">
        <Col>
          <Table responsive hover className="text-muted">
            <thead>
              <tr>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listPolicies.map((policy) => (
                <tr key={policy.ID}>
                  <td>{policy.CATEGORY}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleOpenModal("Edit", policy)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        Swal.fire({
                          text: `Are you sure you want to delete this Privacy Policy?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "Cancel",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await deletePolicy(policy.ID);
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

      {/* Modal for Add/Edit Privacy Policy */}
      <Modal show={modalAdd} onHide={hdlMdlClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actType === "Create" ? "Add Privacy Policy" : "Edit Privacy Policy"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <input
                id="trixInput"
                type="hidden"
                value={policyFormData.DESCRIPTION}
                onChange={(e) =>
                  setPolicyFormData({ ...policyFormData, DESCRIPTION: e.target.value })
                }
              />
              <trix-editor ref={editorRef} input="trixInput" style={{ height: "200px" }}></trix-editor>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={policyFormData.CATEGORY}
                onChange={(e) =>
                  setPolicyFormData({ ...policyFormData, CATEGORY: e.target.value })
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

export default PrivacyPolicy;