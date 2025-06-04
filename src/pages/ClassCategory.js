import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";

const initialClassCategory = (companyId) => ({
    COMPANY_ID: companyId,
    NAME: "",
});

export default function ClassCategoryManager() {
    const { value } = useContext(AuthContext);
    const { idPerusahaan } = value;

    const [listClassCategories, setListClassCategories] = useState([]);
    const [classCategoryFormData, setClassCategoryFormData] = useState(initialClassCategory(idPerusahaan));
    const [modalAdd, setModalAdd] = useState(false);
    const [actType, setActType] = useState("Create");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    // Fetch all class categories
    const getClassCategories = async () => {
        try {
            const response = await axios.get("/class-category", {
                params: { companyId: idPerusahaan, page, limit },
            });
            if (response.status === 200) {
                setListClassCategories(response.data.data);
                setPagination(response.data.pagination || { totalPages: 1 });
            }
        } catch (error) {
            toast.error("Failed to retrieve class categories", { autoClose: 3000 });
        }
    };

    // Create a new class category
    const createClassCategory = async (data) => {
        try {
            const response = await axios.post("/class-category", data);
            if (response.status === 201) {
                toast.success("Class category created successfully", { autoClose: 3000 });
                getClassCategories();
            }
        } catch (error) {
            toast.error("Failed to create class category", { autoClose: 3000 });
        }
    };

    // Update a class category
    const updateClassCategory = async (id, data) => {
        try {
            const response = await axios.put(`/class-category/${id}`, data);
            if (response.status === 200) {
                toast.success("Class category updated successfully", { autoClose: 3000 });
                getClassCategories();
            }
        } catch (error) {
            toast.error("Failed to update class category", { autoClose: 3000 });
        }
    };

    // Delete a class category
    const deleteClassCategory = async (id) => {
        try {
            const response = await axios.delete(`/class-category/${id}`);
            if (response.status === 200) {
                toast.success("Class category deleted successfully", { autoClose: 3000 });
                getClassCategories();
            }
        } catch (error) {
            toast.error("Failed to delete class category", { autoClose: 3000 });
        }
    };

    // Open modal for Add/Edit
    const handleOpenModal = (type = "Create", classCategoryData = null) => {
        if (type === "Edit" && classCategoryData) {
            setClassCategoryFormData(classCategoryData);
        } else {
            setClassCategoryFormData(initialClassCategory(idPerusahaan));
        }
        setActType(type);
        setModalAdd(true);
    };

    // Close modal
    const hdlMdlClose = () => {
        setModalAdd(false);
        setClassCategoryFormData(initialClassCategory(idPerusahaan));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (actType === "Create") {
                await createClassCategory(classCategoryFormData);
            } else {
                await updateClassCategory(classCategoryFormData.id, classCategoryFormData);
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

    // Fetch class categories on mount and when page changes
    useEffect(() => {
        getClassCategories();
    }, [page, idPerusahaan]);

    return (
        <div className="container">
            {/* Header and Add Button */}
            <Row className="m-0 mt-2">
                <Col>
                    <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
                        Add Class Category
                    </Button>
                </Col>
            </Row>

            {/* Class Categories Table */}
            <Row className="mt-3">
                <Col>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listClassCategories.map((classCategory) => (
                                <tr key={classCategory.id}>
                                    <td>{classCategory.NAME}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => handleOpenModal("Edit", classCategory)}
                                        >
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                Swal.fire({
                                                    text: `Are you sure you want to delete this class category?`,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Yes",
                                                    cancelButtonText: "Cancel",
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        await deleteClassCategory(classCategory.id);
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

            {/* Pagination */}
            <Row className="mt-3">
                <Col>
                    <Button
                        size="sm"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Previous
                    </Button>{" "}
                    <span>
                        Page {page} of {pagination.totalPages}
                    </span>{" "}
                    <Button
                        size="sm"
                        disabled={page === pagination.totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </Button>
                </Col>
            </Row>

            {/* Modal for Add/Edit Class Category */}
            <Modal show={modalAdd} onHide={hdlMdlClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actType === "Create" ? "Add Class Category" : "Edit Class Category"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={classCategoryFormData.COMPANY_ID}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={classCategoryFormData.NAME}
                                onChange={(e) =>
                                    setClassCategoryFormData({ ...classCategoryFormData, NAME: e.target.value })
                                }
                                required
                            />
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