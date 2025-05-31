import React, { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios"; // Adjust path to your axios instance
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "trix/dist/trix.css";
import "trix";

const initialLibrary = () => ({
    COVER_IMAGE: "",
    NAME: "",
    OVERVIEW: "",
    SHORT_DESCRIPTION: "",
    AUTHOR_NAME: "",
    BOOK_LINK: "",
    IS_RECOMMENDATION: false,
});

const Library = () => {
    const [listLibraries, setListLibraries] = useState([]);
    const [libraryFormData, setLibraryFormData] = useState(initialLibrary());
    const [modalAdd, setModalAdd] = useState(false);
    const [actType, setActType] = useState("Create");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1 });
    const [isRecommendation, setIsRecommendation] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [bookLinkFile, setBookLinkFile] = useState(null);

    const overviewEditorRef = useRef(null);
    const shortDescEditorRef = useRef(null);

    // Fetch all library entries
    const getLibraries = async () => {
        try {
            const response = await axios.get(`/library`, {
                params: { page, limit, isRecommendation },
            });
            if (response.status === 200) {
                setListLibraries(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            toast.error("Failed to retrieve library entries", { autoClose: 3000 });
        }
    };

    // Upload single file
    const uploadSingleFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post("/mobile/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                return response.data.data;
            }
            return "";
        } catch (error) {
            toast.error("Failed to upload file", { autoClose: 3000 });
            return "";
        }
    };

    // Create a new library entry
    const createLibrary = async (data) => {
        try {
            let coverImageUrl = data.COVER_IMAGE;
            let bookLinkUrl = data.BOOK_LINK;

            if (coverImageFile) {
                coverImageUrl = await uploadSingleFile(coverImageFile);
            }
            if (bookLinkFile) {
                bookLinkUrl = await uploadSingleFile(bookLinkFile);
            }

            const updatedData = {
                ...data,
                COVER_IMAGE: coverImageUrl,
                BOOK_LINK: bookLinkUrl,
            };

            const response = await axios.post("/library", updatedData);
            if (response.status === 201) {
                toast.success("Library entry created successfully", { autoClose: 3000 });
                getLibraries();
            }
        } catch (error) {
            toast.error("Failed to create library entry", { autoClose: 3000 });
        }
    };

    // Update a library entry
    const updateLibrary = async (id, data) => {
        try {
            let coverImageUrl = data.COVER_IMAGE;
            let bookLinkUrl = data.BOOK_LINK;

            if (coverImageFile) {
                coverImageUrl = await uploadSingleFile(coverImageFile);
            }
            if (bookLinkFile) {
                bookLinkUrl = await uploadSingleFile(bookLinkFile);
            }

            const updatedData = {
                ...data,
                COVER_IMAGE: coverImageUrl,
                BOOK_LINK: bookLinkUrl,
            };

            const response = await axios.put(`/library/${id}`, updatedData);
            if (response.status === 200) {
                toast.success("Library entry updated successfully", { autoClose: 3000 });
                getLibraries();
            }
        } catch (error) {
            toast.error("Failed to update library entry", { autoClose: 3000 });
        }
    };

    // Delete a library entry
    const deleteLibrary = async (id) => {
        try {
            const response = await axios.delete(`/library/${id}`);
            if (response.status === 200) {
                toast.success("Library entry deleted successfully", { autoClose: 3000 });
                getLibraries();
            }
        } catch (error) {
            toast.error("Failed to delete library entry", { autoClose: 3000 });
        }
    };

    // Open modal for Add/Edit
    const handleOpenModal = (type = "Create", libraryData = null) => {
        if (type === "Edit" && libraryData) {
            setLibraryFormData(libraryData);
            setTimeout(() => {
                if (overviewEditorRef.current && overviewEditorRef.current.editor) {
                    overviewEditorRef.current.editor.setSelectedRange([0, 0]);
                    overviewEditorRef.current.editor.insertHTML(libraryData.OVERVIEW ? String(libraryData.OVERVIEW) : "");
                }
                if (shortDescEditorRef.current && shortDescEditorRef.current.editor) {
                    shortDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    shortDescEditorRef.current.editor.insertHTML(libraryData.SHORT_DESCRIPTION ? String(libraryData.SHORT_DESCRIPTION) : "");
                }
            }, 0);
            setCoverImageFile(null);
            setBookLinkFile(null);
        } else {
            setLibraryFormData(initialLibrary());
            setTimeout(() => {
                if (overviewEditorRef.current && overviewEditorRef.current.editor) {
                    overviewEditorRef.current.editor.setSelectedRange([0, 0]);
                    overviewEditorRef.current.editor.insertHTML("");
                }
                if (shortDescEditorRef.current && shortDescEditorRef.current.editor) {
                    shortDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    shortDescEditorRef.current.editor.insertHTML("");
                }
            }, 0);
            setCoverImageFile(null);
            setBookLinkFile(null);
        }
        setActType(type);
        setModalAdd(true);
    };

    // Close modal
    const hdlMdlClose = () => {
        setModalAdd(false);
        setLibraryFormData(initialLibrary());
        setTimeout(() => {
            if (overviewEditorRef.current && overviewEditorRef.current.editor) {
                overviewEditorRef.current.editor.setSelectedRange([0, 0]);
                overviewEditorRef.current.editor.insertHTML("");
            }
            if (shortDescEditorRef.current && shortDescEditorRef.current.editor) {
                shortDescEditorRef.current.editor.setSelectedRange([0, 0]);
                shortDescEditorRef.current.editor.insertHTML("");
            }
        }, 0);
        setCoverImageFile(null);
        setBookLinkFile(null);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const overview = overviewEditorRef.current?.editor?.element.value || "";
            const shortDescription = shortDescEditorRef.current?.editor?.element.value || "";
            const updatedData = {
                ...libraryFormData,
                OVERVIEW: overview,
                SHORT_DESCRIPTION: shortDescription,
            };

            if (actType === "Create") {
                await createLibrary(updatedData);
            } else {
                await updateLibrary(updatedData.ID, updatedData);
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

    // Handle filter change
    const handleFilterChange = (e) => {
        setIsRecommendation(e.target.value);
        setPage(1); // Reset to first page on filter change
    };

    // Fetch libraries on mount and when page or filter changes
    useEffect(() => {
        getLibraries();
    }, [page, isRecommendation]);

    return (
        <div className="container">
            {/* Header and Add Button */}
            <Row className="m-0 mt-2">
                <Col>
                    <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
                        Add Library Entry
                    </Button>
                </Col>
                <Col>
                    <Form.Select onChange={handleFilterChange} value={isRecommendation}>
                        <option value="">All</option>
                        <option value="true">Recommended</option>
                        <option value="false">Not Recommended</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Library Table */}
            <Row className="mt-3">
                <Col>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Author</th>
                                <th>Recommendation</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listLibraries.map((library) => (
                                <tr key={library.ID}>
                                    <td>{library.NAME}</td>
                                    <td>{library.AUTHOR_NAME}</td>
                                    <td>{library.IS_RECOMMENDATION ? "Yes" : "No"}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => handleOpenModal("Edit", library)}
                                        >
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                Swal.fire({
                                                    text: `Are you sure you want to delete this library entry?`,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Yes",
                                                    cancelButtonText: "Cancel",
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        await deleteLibrary(library.ID);
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

            {/* Modal for Add/Edit Library Entry */}
            <Modal show={modalAdd} onHide={hdlMdlClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actType === "Create" ? "Add Library Entry" : "Edit Library Entry"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={libraryFormData.NAME}
                                onChange={(e) =>
                                    setLibraryFormData({ ...libraryFormData, NAME: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Overview (penjelasan kenapa buku ini di buat)</Form.Label>
                            <trix-editor
                                ref={overviewEditorRef}
                                style={{ height: "200px" }}
                            ></trix-editor>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Description</Form.Label>
                            <trix-editor
                                ref={shortDescEditorRef}
                                style={{ height: "200px" }}
                            ></trix-editor>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Author Name"
                                value={libraryFormData.AUTHOR_NAME}
                                onChange={(e) =>
                                    setLibraryFormData({
                                        ...libraryFormData,
                                        AUTHOR_NAME: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Book File</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf,.epub"
                                onChange={(e) => setBookLinkFile(e.target.files[0])}
                            />
                            {actType === "Edit" && libraryFormData.BOOK_LINK && (
                                <Form.Text>Current file: {libraryFormData.BOOK_LINK}</Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cover Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCoverImageFile(e.target.files[0])}
                            />
                            {actType === "Edit" && libraryFormData.COVER_IMAGE && (
                                <Form.Text>Current image: {libraryFormData.COVER_IMAGE}</Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Recommended"
                                checked={libraryFormData.IS_RECOMMENDATION}
                                onChange={(e) =>
                                    setLibraryFormData({
                                        ...libraryFormData,
                                        IS_RECOMMENDATION: e.target.checked,
                                    })
                                }
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
};

export default Library;