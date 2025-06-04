import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";

export default function Certificate() {
    const { value } = useContext(AuthContext);
    const { idPerusahaan } = value;

    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [certificates, setCertificates] = useState([]);

    
    const getClasses = async () => {
        try {
            const response = await axios.get("/class", {
                params: { companyId: idPerusahaan, page: 1, limit: 100 },
            });
            
            if (response.status === 200) {
                setClasses(response.data.data || []);
            }
        } catch (error) {
            toast.error("Failed to retrieve classes", { autoClose: 3000 });
        }
    };

    
    const getCertificates = async () => {
        if (!selectedClassId) {
            toast.warning("Please select a class to view certificates", { autoClose: 3000 });
            return;
        }
        try {
            const response = await axios.get("/certificate", {
                params: { CLASS_ID: selectedClassId },
            });
            if (response.status === 200) {
                setCertificates(response.data.data || []);
            }
        } catch (error) {
            toast.error("Failed to retrieve certificates", { autoClose: 3000 });
            setCertificates([]);
        }
    };

    
    useEffect(() => {
        getClasses();
    }, [idPerusahaan]);

    
    useEffect(() => {
        if (selectedClassId) {
            getCertificates();
        }
    }, [selectedClassId]);

    return (
        <div className="container">
            {/* Filter Section */}
            <Row className="m-0 mt-2">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Select Class (Required)</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            <option value="">-- Select a Class --</option>
                            {classes.map((cls) => (
                                <option key={cls.ID} value={cls.ID}>
                                    {cls.NAME}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={getCertificates}
                        disabled={!selectedClassId}
                    >
                        Fetch Certificates
                    </Button>
                </Col>
            </Row>

            {/* Certificates Table */}
            <Row className="mt-3">
                <Col>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Class Category</th>
                                <th>Employee ID</th>
                                <th>Certificate Link</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No certificates found for the selected class
                                    </td>
                                </tr>
                            ) : (
                                certificates.map((certificate) => (
                                    <tr key={certificate.ID}>
                                        <td>{certificate.CLASS?.CLASS_NAME || "N/A"}</td>
                                        <td>{certificate.CLASS?.CLASS_CATEGORY_NAME || "N/A"}</td>
                                        <td>{certificate.EMP_ID || "N/A"}</td>
                                        <td>
                                            {certificate.LINK_CERTIFICATE ? (
                                                <a
                                                    href={certificate.LINK_CERTIFICATE}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Certificate
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td>
                                            {certificate.CREATED_AT
                                                ? new Date(certificate.CREATED_AT).toLocaleString()
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {certificate.UPDATED_AT
                                                ? new Date(certificate.UPDATED_AT).toLocaleString()
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}