import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import "trix/dist/trix.css";
import "trix";

const initialCertificateTemplate = (companyId) => ({
    COMPANY_ID: companyId,
    CONTENT: "",
});

export default function CertificateTemplate() {
    const { value } = useContext(AuthContext);
    const { idPerusahaan } = value;

    const [listCertificateTemplates, setListCertificateTemplates] = useState([]);
    const [certificateTemplateFormData, setCertificateTemplateFormData] = useState(initialCertificateTemplate(idPerusahaan));
    const [modalAdd, setModalAdd] = useState(false);
    const [actType, setActType] = useState("Create");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const contentEditorRef = useRef(null);

    // Fetch all certificate templates
    const getCertificateTemplates = async () => {
        try {
            const response = await axios.get("/certificate-template", {
                params: { COMPANY_ID: idPerusahaan, page, limit },
            });
            if (response.status === 200) {
                setListCertificateTemplates(response.data.data);
                setPagination(response.data.pagination || { totalPages: 1 });
            }
        } catch (error) {
            toast.error("Failed to retrieve certificate templates", { autoClose: 3000 });
        }
    };

    // Create a new certificate template
    const createCertificateTemplate = async (data) => {
        try {
            const response = await axios.post("/certificate-template", data);
            if (response.status === 201) {
                toast.success("Certificate template created successfully", { autoClose: 3000 });
                getCertificateTemplates();
            }
        } catch (error) {
            toast.error("Failed to create certificate template", { autoClose: 3000 });
        }
    };

    // Update a certificate template
    const updateCertificateTemplate = async (id, data) => {
        try {
            const response = await axios.put(`/certificate-template/${id}`, data);
            if (response.status === 200) {
                toast.success("Certificate template updated successfully", { autoClose: 3000 });
                getCertificateTemplates();
            }
        } catch (error) {
            toast.error("Failed to update certificate template", { autoClose: 3000 });
        }
    };

    // Delete a certificate template
    const deleteCertificateTemplate = async (id) => {
        try {
            const response = await axios.delete(`/certificate-template/${id}`);
            if (response.status === 200) {
                toast.success("Certificate template deleted successfully", { autoClose: 3000 });
                getCertificateTemplates();
            }
        } catch (error) {
            toast.error("Failed to delete certificate template", { autoClose: 3000 });
        }
    };

    // Open modal for Add/Edit
    const handleOpenModal = (type = "Create", certificateTemplateData = null) => {
        if (type === "Edit" && certificateTemplateData) {
            setCertificateTemplateFormData(certificateTemplateData);
            setTimeout(() => {
                if (contentEditorRef.current && contentEditorRef.current.editor) {
                    contentEditorRef.current.editor.setSelectedRange([0, 0]);
                    contentEditorRef.current.editor.insertHTML(certificateTemplateData.CONTENT || "");
                }
            }, 0);
        } else {
            setCertificateTemplateFormData(initialCertificateTemplate(idPerusahaan));
            setTimeout(() => {
                if (contentEditorRef.current && contentEditorRef.current.editor) {
                    contentEditorRef.current.editor.setSelectedRange([0, 0]);
                    contentEditorRef.current.editor.insertHTML("");
                }
            }, 0);
        }
        setActType(type);
        setModalAdd(true);
    };

    // Close modal
    const hdlMdlClose = () => {
        setModalAdd(false);
        setCertificateTemplateFormData(initialCertificateTemplate(idPerusahaan));
        setTimeout(() => {
            if (contentEditorRef.current && contentEditorRef.current.editor) {
                contentEditorRef.current.editor.setSelectedRange([0, 0]);
                contentEditorRef.current.editor.insertHTML("");
            }
        }, 0);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const content = contentEditorRef.current?.editor?.element.value || "";
            const updatedData = {
                ...certificateTemplateFormData,
                CONTENT: content,
            };

            if (actType === "Create") {
                await createCertificateTemplate(updatedData);
            } else {
                await updateCertificateTemplate(updatedData.id, updatedData);
            }
            hdlMdlClose();
        } catch (error) {
            toast.error("Something went wrong", { autoClose: 3000 });
        }
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Fetch certificate templates on mount and when page changes
    useEffect(() => {
        getCertificateTemplates();
    }, [page, idPerusahaan]);

    return (
        <div className="container">
            {/* Header and Add Button */}
            <Row className="m-0 mt-2">
                <Col>
                    <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
                        Add Certificate Template
                    </Button>
                </Col>
            </Row>

            {/* Certificate Templates Table */}
            <Row className="mt-3">
                <Col>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Company ID</th>
                                <th>Content Preview</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCertificateTemplates.map((template) => (
                                <tr key={template.id}>
                                    <td>{template.COMPANY_ID}</td>
                                    <td>(Template)</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => handleOpenModal("Edit", template)}
                                        >
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                Swal.fire({
                                                    text: `Are you sure you want to delete this certificate template?`,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Yes",
                                                    cancelButtonText: "Cancel",
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        await deleteCertificateTemplate(template.id);
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

            {/* Modal for Add/Edit Certificate Template */}
            <Modal show={modalAdd} onHide={hdlMdlClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actType === "Create" ? "Add Certificate Template" : "Edit Certificate Template"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={certificateTemplateFormData.COMPANY_ID}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Certificate Content (HTML)</Form.Label>
                            <trix-editor
                                ref={contentEditorRef}
                                style={{ minHeight: "200px", marginBottom: "40px" }}
                            ></trix-editor>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}