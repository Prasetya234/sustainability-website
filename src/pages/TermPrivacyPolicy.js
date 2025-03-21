import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";

// Initial state for Privacy Policy form
const initialPrivacyPolicy = (companyId) => ({
  COMPANY_ID: companyId, // Automatically set from idPerusahaan
  DESCRIPTION: "",
  CATEGORY: "", // Default empty for select input
});

const PrivacyPolicy = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [listPolicies, setListPolicies] = useState([]);
  const [policyFormData, setPolicyFormData] = useState(initialPrivacyPolicy(idPerusahaan));
  const [modalAdd, setModalAdd] = useState(false);
  const [actType, setActType] = useState("Create");

  // Categories options for select input
  const categories = [
    { name: "Privacy Policy", value: "PRIVACY_POLICY" },
    { name: "Term About APP", value: "TERM_APP" },
  ];

  // Ref untuk Trix Editor
  const editorRef = useRef(null);

  // Fetch all Privacy Policies
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

  // Create Privacy Policy
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

  // Update Privacy Policy
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

  // Delete Privacy Policy
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

  // Handle Open Modal
  const handleOpenModal = (type = "Create", policyData = null) => {
    if (type === "Edit" && policyData) {
      // Set the form data and Trix Editor content
      setPolicyFormData(policyData);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.editor.loadHTML(policyData.DESCRIPTION || ""); // Load HTML into Trix Editor
        }
      }, 0); // Use setTimeout to ensure the Trix Editor is ready
    } else {
      // Reset form data and Trix Editor content for "Create"
      setPolicyFormData(initialPrivacyPolicy(idPerusahaan));
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.editor.loadHTML(""); // Clear Trix Editor
        }
      }, 0);
    }
    setActType(type);
    setModalAdd(true);
  };

  // Handle Close Modal
  const hdlMdlClose = () => {
    setModalAdd(false);
    setPolicyFormData(initialPrivacyPolicy(idPerusahaan));
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.editor.loadHTML(""); // Clear Trix Editor on close
      }
    }, 0);
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ambil nilai dari Trix Editor
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

  // Load Privacy Policies on component mount
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