import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import "trix/dist/trix.css";
import "trix";
import * as XLSX from "xlsx";

const initialClass = (companyId) => ({
    COMPANY_ID: companyId,
    CLASS_CATEGORY_ID: "",
    THUMBNAIL_IMG: "",
    DETAIL_IMG: "",
    NAME: "",
    DESCRIPTION: "",
    TOTAL_SESSION: "",
    WELCOME_TITLE: "Selamat Datang di Perjalanan Belajarmu!",
    WELCOME_DESCRIPTION: "",
});

const initialSession = (classId) => ({
    CLASS_ID: classId,
    SEQUENCE: "",
    NAME: "",
    DESCRIPTION: "",
    DURATION_MINUTE: "",
    MATERIAL_LINK: "",
    MINIMUM_POST_TEST_SCORE: "",
});

export default function Class() {
    const { value } = useContext(AuthContext);
    const { idPerusahaan } = value;

    const [listClasses, setListClasses] = useState([]);
    const [classFormData, setClassFormData] = useState(initialClass(idPerusahaan));
    const [modalAdd, setModalAdd] = useState(false);
    const [actType, setActType] = useState("Create");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1 });
    const [nameFilter, setNameFilter] = useState("");
    const [thumbnailImgFile, setThumbnailImgFile] = useState(null);
    const [detailImgFile, setDetailImgFile] = useState(null);
    const [classCategories, setClassCategories] = useState([]);
    const [modalSession, setModalSession] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [sessionFormData, setSessionFormData] = useState(initialSession(""));
    const [sessionActType, setSessionActType] = useState("Create");
    const [currentClassId, setCurrentClassId] = useState(null);
    const [preTestFile, setPreTestFile] = useState(null);
    const [postTestFile, setPostTestFile] = useState(null);

    const descriptionEditorRef = useRef(null);
    const welcomeDescEditorRef = useRef(null);
    const sessionDescEditorRef = useRef(null);

    // Fetch all classes
    const getClasses = async () => {
        try {
            const response = await axios.get("/class", {
                params: { companyId: idPerusahaan, name: nameFilter, page, limit },
            });
            if (response.status === 200) {
                setListClasses(response.data.data);
                setPagination(response.data.pagination || { totalPages: 1 });
            }
        } catch (error) {
            toast.error("Failed to retrieve classes", { autoClose: 3000 });
        }
    };

    // Fetch all class categories
    const getClassCategories = async () => {
        try {
            const response = await axios.get("/class-category", {
                params: { companyId: idPerusahaan },
            });
            if (response.status === 200) {
                setClassCategories(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to retrieve class categories", { autoClose: 3000 });
        }
    };

    // Fetch all sessions for a class
    const getClassSessions = async (classId) => {
        try {
            const response = await axios.get("/class-session", {
                params: { classId },
            });
            if (response.status === 200) {
                setSessions(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to retrieve sessions", { autoClose: 3000 });
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

    // Create a new class
    const createClass = async (data) => {
        try {
            let thumbnailImgUrl = data.THUMBNAIL_IMG;
            let detailImgUrl = data.DETAIL_IMG;

            if (thumbnailImgFile) {
                thumbnailImgUrl = await uploadSingleFile(thumbnailImgFile);
            }
            if (detailImgFile) {
                detailImgUrl = await uploadSingleFile(detailImgFile);
            }

            const updatedData = {
                ...data,
                THUMBNAIL_IMG: thumbnailImgUrl,
                DETAIL_IMG: detailImgUrl,
            };

            const response = await axios.post("/class", updatedData);
            if (response.status === 201) {
                toast.success("Class created successfully", { autoClose: 3000 });
                getClasses();
            }
        } catch (error) {
            toast.error("Failed to create class", { autoClose: 3000 });
        }
    };

    // Update a class
    const updateClass = async (id, data) => {
        try {
            let thumbnailImgUrl = data.THUMBNAIL_IMG;
            let detailImgUrl = data.DETAIL_IMG;

            if (thumbnailImgFile) {
                thumbnailImgUrl = await uploadSingleFile(thumbnailImgFile);
            }
            if (detailImgFile) {
                detailImgUrl = await uploadSingleFile(detailImgFile);
            }

            const updatedData = {
                ...data,
                THUMBNAIL_IMG: thumbnailImgUrl,
                DETAIL_IMG: detailImgUrl,
            };

            const response = await axios.put(`/class/${id}`, updatedData);
            if (response.status === 200) {
                toast.success("Class updated successfully", { autoClose: 3000 });
                getClasses();
            }
        } catch (error) {
            toast.error("Failed to update class", { autoClose: 3000 });
        }
    };

    // Delete a class
    const deleteClass = async (id) => {
        try {
            const response = await axios.delete(`/class/${id}`);
            if (response.status === 200) {
                toast.success("Class deleted successfully", { autoClose: 3000 });
                getClasses();
            }
        } catch (error) {
            toast.error("Failed to delete class", { autoClose: 3000 });
        }
    };

    // Create or update a session
    const saveSession = async (data) => {
        try {
            const updatedData = {
                ...data,
                SEQUENCE: Number(data.SEQUENCE),
                DURATION_MINUTE: Number(data.DURATION_MINUTE),
                MINIMUM_POST_TEST_SCORE: Number(data.MINIMUM_POST_TEST_SCORE),
            };

            const response = await axios.post("/class-session", updatedData);
            toast.success("Session saved successfully", { autoClose: 3000 });
            return response.data.data; // Return the created session
        } catch (error) {
            toast.error("Failed to save session", { autoClose: 3000 });
            throw error;
        }
    };

    // Delete a session
    const deleteSession = async (id) => {
        try {
            const response = await axios.delete(`/class-session/${id}`);
            if (response.status === 200) {
                toast.success("Session deleted successfully", { autoClose: 3000 });
                getClassSessions(currentClassId);
            }
        } catch (error) {
            toast.error("Failed to delete session", { autoClose: 3000 });
        }
    };

    // Download question template
    const downloadQuestionTemplate = () => {
        const templateData = [
            {
                Title: "Contoh soal ke 1 (single)",
                A: "ini jawaban ke 1 untuk soal 1",
                B: "ini jawaban ke 2 untuk soal 1",
                C: "",
                D: "",
                E: "",
                F: "",
                Answer: "B",
            },
            {
                Title: "Contoh soal ke 2 (multiple)",
                A: "ini jawaban ke 1 untuk soal 2",
                B: "ini jawaban ke 2 untuk soal 2",
                C: "ini jawaban ke 3 untuk soal 2",
                D: "ini jawaban ke 4 untuk soal 2",
                E: "ini jawaban ke 5 untuk soal 2",
                F: "ini jawaban ke 6 untuk soal 2",
                Answer: "A|B",
            },
        ];
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "session_question_template.xlsx");
    };

    // Fetch questions for a class
    const getSessionQuestions = async (classId, testType) => {
        try {
            const response = await axios.get(`/class-question`, {
                params: { CLASS_ID: classId, TYPE: testType },
            });
            if (response.status === 200) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            toast.error(`Failed to retrieve ${testType} questions`, { autoClose: 3000 });
            return [];
        }
    };

    // Download existing questions
    const handleDownloadQuestions = async (classId, testType) => {
        const questions = await getSessionQuestions(classId, testType);
        if (questions.length === 0) {
            toast.info(`No ${testType} questions found for this class`, { autoClose: 3000 });
            return;
        }
        const templateData = questions.map((question) => {
            const options = question.OPTION.reduce((acc, opt) => {
                acc[opt.option] = opt.description;
                return acc;
            }, { A: "", B: "", C: "", D: "", E: "", F: "" });

            return {
                Title: question.QUESTION,
                A: options.A,
                B: options.B,
                C: options.C,
                D: options.D,
                E: options.E,
                F: options.F,
                Answer: question.TRUE_ANSWER,
            };
        });

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Questions");
        XLSX.writeFile(wb, `${testType}_questions_class_${classId}.xlsx`);
    };

    // Upload questions from Excel file
    const handleQuestionFileUpload = async (classId, seq, testType, file) => {
        if (!file || !classId) {
            toast.error("Please select a file and a class", { autoClose: 3000 });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            const questions = jsonData.map((row, index) => {
                const options = [
                    { option: "A", description: row.A || "" },
                    { option: "B", description: row.B || "" },
                    { option: "C", description: row.C || "" },
                    { option: "D", description: row.D || "" },
                    { option: "E", description: row.E || "" },
                    { option: "F", description: row.F || "" },
                ].filter(opt => opt.description.trim() !== "");

                return {
                    CLASS_ID: classId,
                    TYPE: testType,
                    QUESTION: row.Title || "",
                    OPTION: options,
                    TRUE_ANSWER: row.Answer || "",
                    SEQUENCE: seq,
                    CATEGORY: row.Answer && row.Answer.split("|").length > 1 ? "CHECKBOX" : "MULTIPLE_CHOICE",
                };
            });

            try {
                const response = await axios.put(`/class-question/bulk/${classId}/${seq}?type=${testType}`, { testType, questions });
                if (response.status === 200) {
                    toast.success(`${testType} questions uploaded successfully`, { autoClose: 3000 });
                    if (testType === "PRE_TEST") setPreTestFile(null);
                    if (testType === "POST_TEST") setPostTestFile(null);
                }
            } catch (error) {
                console.log(error.response);
                
                toast.error(`Failed to upload ${testType} questions`, { autoClose: 3000 });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // Open modal for Add/Edit Class
    const handleOpenModal = (type = "Create", classData = null) => {
        if (type === "Edit" && classData) {
            setClassFormData(classData);
            setTimeout(() => {
                if (descriptionEditorRef.current && descriptionEditorRef.current.editor) {
                    descriptionEditorRef.current.editor.setSelectedRange([0, 0]);
                    descriptionEditorRef.current.editor.insertHTML(classData.DESCRIPTION ? String(classData.DESCRIPTION) : "");
                }
                if (welcomeDescEditorRef.current && welcomeDescEditorRef.current.editor) {
                    welcomeDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    welcomeDescEditorRef.current.editor.insertHTML(classData.WELCOME_DESCRIPTION ? String(classData.WELCOME_DESCRIPTION) : "");
                }
            }, 0);
            setThumbnailImgFile(null);
            setDetailImgFile(null);
        } else {
            setClassFormData(initialClass(idPerusahaan));
            setTimeout(() => {
                if (descriptionEditorRef.current && descriptionEditorRef.current.editor) {
                    descriptionEditorRef.current.editor.setSelectedRange([0, 0]);
                    descriptionEditorRef.current.editor.insertHTML("");
                }
                if (welcomeDescEditorRef.current && welcomeDescEditorRef.current.editor) {
                    welcomeDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    welcomeDescEditorRef.current.editor.insertHTML("Mulailah petualangan menemukan ilmu, kembangkan potensimu, dan raih kesuksesan. Ayo kita mulai!");
                }
            }, 0);
            setThumbnailImgFile(null);
            setDetailImgFile(null);
        }
        setActType(type);
        setModalAdd(true);
    };

    // Close modal for Class
    const hdlMdlClose = () => {
        setModalAdd(false);
        setClassFormData(initialClass(idPerusahaan));
        setTimeout(() => {
            if (descriptionEditorRef.current && descriptionEditorRef.current.editor) {
                descriptionEditorRef.current.editor.setSelectedRange([0, 0]);
                descriptionEditorRef.current.editor.insertHTML("");
            }
            if (welcomeDescEditorRef.current && welcomeDescEditorRef.current.editor) {
                welcomeDescEditorRef.current.editor.setSelectedRange([0, 0]);
                welcomeDescEditorRef.current.editor.insertHTML("");
            }
        }, 0);
        setThumbnailImgFile(null);
        setDetailImgFile(null);
    };

    // Open modal for Sessions
    const handleOpenSessionModal = (classId) => {
        setCurrentClassId(classId);
        setSessionFormData(initialSession(classId));
        getClassSessions(classId);
        setModalSession(true);
    };

    // Close modal for Sessions
    const handleCloseSessionModal = () => {
        setModalSession(false);
        setSessionFormData(initialSession(""));
        setSessions([]);
        setCurrentClassId(null);
        setPreTestFile(null);
        setPostTestFile(null);
    };

    // Open modal for Add/Edit Session
    const handleOpenSessionForm = (type = "Create", sessionData = null) => {
        if (type === "Edit" && sessionData) {
            setSessionFormData(sessionData);
            setTimeout(() => {
                if (sessionDescEditorRef.current && sessionDescEditorRef.current.editor) {
                    sessionDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    sessionDescEditorRef.current.editor.insertHTML(sessionData.DESCRIPTION ? String(sessionData.DESCRIPTION) : "");
                }
            }, 0);
        } else {
            setSessionFormData(initialSession(currentClassId));
            setTimeout(() => {
                if (sessionDescEditorRef.current && sessionDescEditorRef.current.editor) {
                    sessionDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    sessionDescEditorRef.current.editor.insertHTML("");
                }
            }, 0);
        }
        setSessionActType(type);
    };

    // Handle session form submission
    const handleSessionSubmit = async (e) => {
        e.preventDefault();
        try {
            const description = sessionDescEditorRef.current?.editor?.element.value || "";
            const updatedData = {
                ...sessionFormData,
                DESCRIPTION: description,
            };

            const session = await saveSession(updatedData);
            if (session) {
                const classId = session.CLASS_ID; // Use CLASS_ID instead of sessionId
                
                if (preTestFile) {
                    await handleQuestionFileUpload(classId, sessionFormData.SEQUENCE, "PRE_TEST", preTestFile);
                }
                if (postTestFile) {
                    await handleQuestionFileUpload(classId, sessionFormData.SEQUENCE, "POST_TEST", postTestFile);
                }
            }

            setSessionFormData(initialSession(currentClassId));
            setPreTestFile(null);
            setPostTestFile(null);
            setTimeout(() => {
                if (sessionDescEditorRef.current && sessionDescEditorRef.current.editor) {
                    sessionDescEditorRef.current.editor.setSelectedRange([0, 0]);
                    sessionDescEditorRef.current.editor.insertHTML("");
                }
            }, 0);
            getClassSessions(currentClassId);
            handleCloseSessionModal();
        } catch (error) {
            toast.error("Something went wrong", { autoClose: 3000 });
        }
    };

    // Handle form submission for Class
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const description = descriptionEditorRef.current?.editor?.element.value || "";
            const welcomeDescription = welcomeDescEditorRef.current?.editor?.element.value || "";
            const updatedData = {
                ...classFormData,
                DESCRIPTION: description,
                WELCOME_DESCRIPTION: welcomeDescription,
            };

            if (actType === "Create") {
                await createClass(updatedData);
            } else {
                await updateClass(updatedData.ID, updatedData);
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
        const { name, value } = e.target;
        if (name === "name") {
            setNameFilter(value);
        }
        setPage(1);
    };

    // Fetch classes and class categories on mount and when filters change
    useEffect(() => {
        getClasses();
        getClassCategories();
    }, [page, idPerusahaan, nameFilter]);

    return (
        <div className="container">
            {/* Header and Add Button */}
            <Row className="m-0 mt-2">
                <Col>
                    <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
                        Add Class
                    </Button>
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Filter by Name"
                        name="name"
                        value={nameFilter}
                        onChange={handleFilterChange}
                    />
                </Col>
            </Row>

            {/* Classes Table */}
            <Row className="mt-3">
                <Col>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Class Category</th>
                                <th>Total Sessions</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listClasses.map((classEntry) => {
                                const category = classCategories.find(cat => cat.id === classEntry.CLASS_CATEGORY_ID);
                                return (
                                    <tr key={classEntry.ID}>
                                        <td>{classEntry.NAME}</td>
                                        <td>{category ? category.NAME : classEntry.CLASS_CATEGORY_ID}</td>
                                        <td>{classEntry.TOTAL_SESSION}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="info"
                                                onClick={() => handleOpenModal("Edit", classEntry)}
                                            >
                                                Edit
                                            </Button>{" "}
                                            <Button
                                                size="sm"
                                                variant="info"
                                                onClick={() => handleOpenSessionModal(classEntry.ID)}
                                            >
                                                Sessions
                                            </Button>{" "}
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => {
                                                    Swal.fire({
                                                        text: `Are you sure you want to delete this class?`,
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes",
                                                        cancelButtonText: "Cancel",
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            await deleteClass(classEntry.ID);
                                                        }
                                                    });
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                    <span>Page {page} of {pagination.totalPages}</span>{" "}
                    <Button
                        size="sm"
                        disabled={page === pagination.totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </Button>
                </Col>
            </Row>

            {/* Modal for Add/Edit Class */}
            <Modal show={modalAdd} onHide={hdlMdlClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{actType === "Create" ? "Add Class" : "Edit Class"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={classFormData.COMPANY_ID}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Class Category</Form.Label>
                            <Form.Select
                                value={classFormData.CLASS_CATEGORY_ID}
                                onChange={(e) =>
                                    setClassFormData({ ...classFormData, CLASS_CATEGORY_ID: e.target.value })
                                }
                                required
                            >
                                <option value="">Select Class Category</option>
                                {classCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.NAME}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={classFormData.NAME}
                                onChange={(e) =>
                                    setClassFormData({ ...classFormData, NAME: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <trix-editor
                                ref={descriptionEditorRef}
                                style={{ height: "200px" }}
                            ></trix-editor>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Sessions</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Total Sessions"
                                value={classFormData.TOTAL_SESSION}
                                onChange={(e) =>
                                    setClassFormData({ ...classFormData, TOTAL_SESSION: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Welcome Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Welcome Title"
                                value={classFormData.WELCOME_TITLE}
                                onChange={(e) =>
                                    setClassFormData({ ...classFormData, WELCOME_TITLE: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Welcome Description</Form.Label>
                            <trix-editor
                                ref={welcomeDescEditorRef}
                                style={{ height: "200px" }}
                            ></trix-editor>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thumbnail Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnailImgFile(e.target.files[0])}
                            />
                            {actType === "Edit" && classFormData.THUMBNAIL_IMG && (
                                <Form.Text>Current image: {classFormData.THUMBNAIL_IMG}</Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Detail Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setDetailImgFile(e.target.files[0])}
                            />
                            {actType === "Edit" && classFormData.DETAIL_IMG && (
                                <Form.Text>Current image: {classFormData.DETAIL_IMG}</Form.Text>
                            )}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for Session Management */}
            <Modal show={modalSession} onHide={handleCloseSessionModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Manage Sessions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenSessionForm("Create")}
                        className="mb-3"
                    >
                        Add Session
                    </Button>{" "}
                    <Button
                        size="sm"
                        variant="success"
                        onClick={downloadQuestionTemplate}
                        className="mb-3"
                    >
                        Download Question Template
                    </Button>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Sequence</th>
                                <th>Name</th>
                                <th>Duration (min)</th>
                                <th>Min Post-Test Score</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id}>
                                    <td>{session.SEQUENCE}</td>
                                    <td>{session.NAME}</td>
                                    <td>{session.DURATION_MINUTE}</td>
                                    <td>{session.MINIMUM_POST_TEST_SCORE}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => handleOpenSessionForm("Edit", session)}
                                        >
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                Swal.fire({
                                                    text: `Are you sure you want to delete this session?`,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Yes",
                                                    cancelButtonText: "Cancel",
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        await deleteSession(session.id);
                                                    }
                                                });
                                            }}
                                        >
                                            Delete
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => handleDownloadQuestions(session.CLASS_ID, "PRE_TEST")}
                                        >
                                            Download Pre-Test
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => handleDownloadQuestions(session.CLASS_ID, "POST_TEST")}
                                        >
                                            Download Post-Test
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Session Form */}
                    {sessionActType && (
                        <Form onSubmit={handleSessionSubmit} className="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Sequence</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Sequence"
                                    value={sessionFormData.SEQUENCE}
                                    onChange={(e) =>
                                        setSessionFormData({ ...sessionFormData, SEQUENCE: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={sessionFormData.NAME}
                                    onChange={(e) =>
                                        setSessionFormData({ ...sessionFormData, NAME: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <trix-editor
                                    ref={sessionDescEditorRef}
                                    style={{ height: "200px" }}
                                ></trix-editor>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Duration"
                                    value={sessionFormData.DURATION_MINUTE}
                                    onChange={(e) =>
                                        setSessionFormData({ ...sessionFormData, DURATION_MINUTE: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Material Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Material Link"
                                    value={sessionFormData.MATERIAL_LINK}
                                    onChange={(e) =>
                                        setSessionFormData({ ...sessionFormData, MATERIAL_LINK: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Minimum Post-Test Score</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Minimum Post-Test Score"
                                    value={sessionFormData.MINIMUM_POST_TEST_SCORE}
                                    onChange={(e) =>
                                        setSessionFormData({ ...sessionFormData, MINIMUM_POST_TEST_SCORE: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Pre-Test Questions (Excel)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={(e) => setPreTestFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Post-Test Questions (Excel)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={(e) => setPostTestFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Pre test dan post test harus di isi semua saat create</Form.Label>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save Session
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}