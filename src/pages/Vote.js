import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import "trix/dist/trix.css";
import "trix";
import { useNavigate } from "react-router-dom";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const initialSurvey = (companyId) => ({
    NAME: "",
    EMP_COMPANY: companyId,
    DESCRIPTION: "",
    START_DATE: "",
    END_DATE: "",
    CATEGORY: "",
    END_TEXT: "",
    GRV_DELETE: "N",
});

const Survey = () => {
    const navigate = useNavigate();
    const { value } = useContext(AuthContext);
    const { idPerusahaan } = value;

    const [listSurveys, setListSurveys] = useState([]);
    const [surveyFormData, setSurveyFormData] = useState(initialSurvey(idPerusahaan));
    const [modalAdd, setModalAdd] = useState(false);
    const [actType, setActType] = useState("Create");

    const categories = [
        { name: "Umum", value: "GENERAL" },
    ];

    const editorRef = useRef(null);

    const getSurveys = async () => {
        try {
            const response = await axios.get(`/survey?company=${idPerusahaan}`);
            if (response.status === 200) {
                setListSurveys(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to retrieve Surveys", { autoClose: 3000 });
        }
    };

    const createSurvey = async (data) => {
        try {
            const response = await axios.post("/survey", data);
            if (response.status === 201) {
                toast.success("Survey created successfully", { autoClose: 3000 });
                navigate("/survey")
            }
        } catch (error) {
            toast.error("Failed to create Survey", { autoClose: 3000 });
        }
    };

    const updateSurvey = async (id, data) => {
        try {
            const response = await axios.put(`/survey/${id}`, data);
            if (response.status === 200) {
                toast.success("Survey updated successfully", { autoClose: 3000 });
                getSurveys();
            }
        } catch (error) {
            toast.error("Failed to update Survey", { autoClose: 3000 });
        }
    };

    const deleteSurvey = async (id) => {
        try {
            const response = await axios.delete(`/survey/${id}`);
            if (response.status === 200) {
                toast.success("Survey deleted successfully", { autoClose: 3000 });
                getSurveys();
            }
        } catch (error) {
            toast.error("Failed to delete Survey", { autoClose: 3000 });
        }
    };

    const handleOpenModal = (type = "Create", surveyData = null) => {
        try {
            if (type === "Edit" && surveyData) {
                setSurveyFormData({
                    ...surveyData,
                    START_DATE: surveyData.START_DATE.split("T")[0], // Format for input type=date
                    END_DATE: surveyData.END_DATE.split("T")[0],
                });
                setTimeout(() => {
                    if (editorRef.current) {
                        editorRef.current.editor.loadHTML(surveyData.DESCRIPTION || "");
                    }
                }, 0);
            } else {
                setSurveyFormData(initialSurvey(idPerusahaan));
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
        setSurveyFormData(initialSurvey(idPerusahaan));
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.editor.loadHTML("");
            }
        }, 0);
    };
    const redirectRouter = (id) => {
        navigate(`/survey/${id}`);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const description = editorRef.current?.value || "";
            const updatedData = { ...surveyFormData, DESCRIPTION: description };

            if (actType === "Create") {
                await createSurvey(updatedData);
            } else {
                await updateSurvey(updatedData.ID, updatedData);
            }
            getSurveys()
            hdlMdlClose();
        } catch (error) {
            toast.error("Something went wrong", { autoClose: 3000 });
        }
    };

    const downloadData = async (id, name) => {
        try {
            const response = await axios.get(`/survey-answer/import?surveyId=${id}`);
            if (response.status === 200) {
                const data = response.data.data;

                const excelData = data.map((item) => ({
                    Question: item.question,
                    A1: item.answers.find((a) => a.option === 'A1').count,
                    A2: item.answers.find((a) => a.option === 'A2').count,
                    A3: item.answers.find((a) => a.option === 'A3').count,
                    A4: item.answers.find((a) => a.option === 'A4').count,
                    A5: item.answers.find((a) => a.option === 'A5').count,
                }));

                const worksheetData = [['Question', 'A1', 'A2', 'A3', 'A4', 'A5'], ...excelData.map(Object.values)];

                const ws = XLSX.utils.aoa_to_sheet(worksheetData);

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Survey Answers');

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                saveAs(blob, `${name}.xlsx`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            editor.addEventListener("trix-change", (event) => {
                setSurveyFormData((prevData) => ({
                    ...prevData,
                    DESCRIPTION: event.target.value
                }));
            });
        }
        getSurveys();
    }, []);

    return (
        <div className="container">
            {/* Header and Add Button */}
            <Row className="m-0 mt-2">
                <Col>
                    <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
                        Add Survey
                    </Button>
                </Col>
            </Row>

            {/* Survey Table */}
            <Row className="mt-3">
                <Col>
                    <Table responsive hover className="text-muted">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSurveys.map((survey) => (
                                <tr key={survey.ID}>
                                    <td>{survey.NAME}</td>
                                    <td>{survey.CATEGORY}</td>
                                    <td>{new Date(survey.START_DATE).toLocaleDateString()}</td>
                                    <td>{new Date(survey.END_DATE).toLocaleDateString()}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            onClick={() => downloadData(survey.ID, survey.NAME)}
                                        >
                                            Download Result
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => redirectRouter(survey.ID)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                Swal.fire({
                                                    text: `Are you sure you want to delete this Survey?`,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Yes",
                                                    cancelButtonText: "Cancel",
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        await deleteSurvey(survey.ID);
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

            {/* Modal for Add/Edit Survey */}
            <Modal show={modalAdd} onHide={hdlMdlClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actType === "Create" ? "Add Survey" : "Edit Survey"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={surveyFormData.NAME}
                                onChange={(e) =>
                                    setSurveyFormData({ ...surveyFormData, NAME: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <input
                                id="trixInput"
                                type="hidden"
                                value={surveyFormData.DESCRIPTION}
                            />
                            <trix-editor ref={editorRef} input="trixInput" style={{ height: "200px" }}></trix-editor>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={surveyFormData.START_DATE}
                                onChange={(e) =>
                                    setSurveyFormData({ ...surveyFormData, START_DATE: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={surveyFormData.END_DATE}
                                onChange={(e) =>
                                    setSurveyFormData({ ...surveyFormData, END_DATE: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={surveyFormData.CATEGORY}
                                onChange={(e) =>
                                    setSurveyFormData({ ...surveyFormData, CATEGORY: e.target.value })
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
                        <Form.Group className="mb-3">
                            <Form.Label>Ucapan ketika sudah mengisi survey</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={surveyFormData.END_TEXT}
                                onChange={(e) =>
                                    setSurveyFormData({ ...surveyFormData, END_TEXT: e.target.value })
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
};

export default Survey;