import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Card, Spinner, Alert } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/SurveyQuestionManager.css";
import "trix/dist/trix.css";
import "trix";
import { AuthContext } from "../auth/AuthProvider";
import { logDOM } from "@testing-library/react";

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

const SurveyQuestionManager = () => {
    const { id: surveyId } = useParams();
    const navigate = useNavigate();
    const { value } = useContext(AuthContext);
    const { idPerusahaan } = value;

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [surveyFormData, setSurveyFormData] = useState(initialSurvey(idPerusahaan));
    const [questions, setQuestions] = useState([]);
    const [questionFiles, setQuestionFiles] = useState({});
    const [optionFiles, setOptionFiles] = useState({});
    const fileInputRefs = useRef({});
    const optionFileInputRefs = useRef({});

    const editorRef = useRef(null);


    const questionTypeOptions = [
        { name: "Multiple Choice", value: "MULTIPLE_CHOICE" },
        { name: "Checkbox", value: "CHECKBOX" },
        { name: "Single Text Box", value: "SINGLE_TEXT_BOX" },
        { name: "Multiple Choice with Image", value: "MULTIPLE_CHOICE_IMAGE" },
        { name: "Checkbox with Image", value: "CHECKBOX_IMAGE" },
    ];

    const multipleChoiceOptions = ["A", "B", "C", "D", "E", "F"];

    const categories = [
        { name: "Umum", value: "GENERAL" },
    ];


    const getSurveyAndQuestions = async () => {
        setIsLoading(true);
        try {
            const surveyResponse = await axios.get(`/survey/${surveyId}`);
            if (surveyResponse.status === 200) {
                setSurveyFormData({ ...surveyResponse.data.data })
            }

            const questionsResponse = await axios.get(`/survey-question?surveyId=${surveyId}`);
            if (questionsResponse.status === 200) {
                const sortedQuestions = questionsResponse.data.data.sort(
                    (a, b) => a.SEQUENCE - b.SEQUENCE
                );
                setQuestions(
                    sortedQuestions.map((q, idx) => ({
                        id: q.ID,
                        SURVEY_ID: q.SURVEY_ID,
                        QUESTION: q.QUESTION,
                        SEQUENCE: q.SEQUENCE,
                        OPTION: q.OPTION || [],
                        CATEGORY: q.CATEGORY,
                        ATTACHED_FILE: q.ATTACHED_FILE || "",
                        number: idx + 1,
                    }))
                );
            }
        } catch (error) {
            setErrorMessage("Failed to retrieve survey or questions");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const uploadSingleFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/mobile/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
           if(response.status === 200){
            return response.data.data;
        }  else {
            return ""
        }
    };

    const saveQuestions = async () => {
        setIsLoading(true);
        try {
            await axios.put(`/survey/${surveyId}`, { ...surveyFormData });
            const updatedQuestions = [...questions];
            if (!updatedQuestions.length) {
                toast.success("Survey updated successfully", { autoClose: 3000 });
                            navigate("/survey")

                return
            }
            for (const [index, file] of Object.entries(questionFiles)) {
                if (file) {
                    const url = await uploadSingleFile(file);
                    updatedQuestions[index] = {
                        ...updatedQuestions[index],
                        ATTACHED_FILE: url,
                    };
                }
            }
            for (const [key, file] of Object.entries(optionFiles)) {
                if (file) {
                    const [qIndex, cIndex] = key.split("-").map(Number);
                    const url = await uploadSingleFile(file);
                    updatedQuestions[qIndex] = {
                        ...updatedQuestions[qIndex],
                        OPTION: updatedQuestions[qIndex].OPTION.map((c, ci) =>
                            ci === cIndex ? { ...c, image_url: url } : c
                        ),
                    };
                }
            }


            const formattedQuestions = updatedQuestions.map((q) => ({
                QUESTION: q.QUESTION,
                SEQUENCE: q.SEQUENCE,
                OPTION: q.OPTION,
                CATEGORY: q.CATEGORY,
                ATTACHED_FILE: q.ATTACHED_FILE,
            }));
            await axios.put(`/survey-question/bulk/${surveyId}`, formattedQuestions);

            setQuestionFiles({});
            setOptionFiles({});

            toast.success("Survey updated successfully", { autoClose: 3000 });
            navigate("/survey")
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to save survey");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                SURVEY_ID: surveyId,
                QUESTION: "",
                SEQUENCE: questions.length + 1,
                OPTION: [],
                CATEGORY: "MULTIPLE_CHOICE",
                ATTACHED_FILE: "",
                number: questions.length + 1,
            },
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions(
            questions
                .filter((_, idx) => idx !== index)
                .map((q, idx) => ({ ...q, number: idx + 1, SEQUENCE: idx + 1 }))
        );
        setQuestionFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[index];
            return newFiles;
        });
        setOptionFiles((prev) => {
            const newFiles = { ...prev };
            Object.keys(newFiles).forEach((key) => {
                if (key.startsWith(`${index}-`)) {
                    delete newFiles[key];
                }
            });
            return newFiles;
        });
    };

    const moveQuestionUp = (index) => {
        if (index === 0) return;
        setQuestions((prev) =>
            prev
                .map((q, idx) => {
                    if (idx === index) return { ...q, SEQUENCE: q.SEQUENCE - 1, number: q.number - 1 };
                    if (idx === index - 1) return { ...q, SEQUENCE: q.SEQUENCE + 1, number: q.number + 1 };
                    return q;
                })
                .sort((a, b) => a.SEQUENCE - b.SEQUENCE)
        );
    };

    const moveQuestionDown = (index) => {
        if (index === questions.length - 1) return;
        setQuestions((prev) =>
            prev
                .map((q, idx) => {
                    if (idx === index) return { ...q, SEQUENCE: q.SEQUENCE + 1, number: q.number + 1 };
                    if (idx === index + 1) return { ...q, SEQUENCE: q.SEQUENCE - 1, number: q.number - 1 };
                    return q;
                })
                .sort((a, b) => a.SEQUENCE - b.SEQUENCE)
        );
    };

    const selectFile = (event, index) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage("File size must be less than 2MB");
            setShowError(true);
            return;
        }
        if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
            setErrorMessage("File must be JPEG, PNG, or PDF");
            setShowError(true);
            return;
        }
        setQuestionFiles((prev) => ({ ...prev, [index]: file }));
    };

    const removeImage = (index) => {
        setQuestions((prev) =>
            prev.map((q, idx) =>
                idx === index ? { ...q, ATTACHED_FILE: "" } : q
            )
        );
        setQuestionFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[index];
            return newFiles;
        });
    };

    const selectOptionFile = (event, qIndex, cIndex) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage("Option image size must be less than 2MB");
            setShowError(true);
            return;
        }
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setErrorMessage("Option image must be JPEG or PNG");
            setShowError(true);
            return;
        }
        setOptionFiles((prev) => ({
            ...prev,
            [`${qIndex}-${cIndex}`]: file,
        }));
    };

    const removeOptionImage = (qIndex, cIndex) => {
        setQuestions((prev) =>
            prev.map((q, idx) =>
                idx === qIndex
                    ? {
                        ...q,
                        OPTION: q.OPTION.map((c, ci) =>
                            ci === cIndex ? { ...c, image_url: "" } : c
                        ),
                    }
                    : q
            )
        );
        setOptionFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[`${qIndex}-${cIndex}`];
            return newFiles;
        });
    };

    const addChoice = (index) => {
        setQuestions((prev) => {
        const updatedQuestions = prev.map((q, idx) => {
            if (idx !== index) return q;

            
            if (q.OPTION.length >= 5) {
                alert("Maximum of 5 choices reached for this question.");
                return q;
            }

            
            return {
                ...q,
                OPTION: [
                    ...q.OPTION,
                    q.CATEGORY === "MULTIPLE_CHOICE_IMAGE" || q.CATEGORY === "CHECKBOX_IMAGE"
                        ? { option: "", image_url: "" }
                        : { option: "", description: "" },
                ],
            };
        });

        return updatedQuestions;
    });
    };

    const removeChoice = (qIndex, cIndex) => {
        setQuestions((prev) =>
            prev.map((q, idx) =>
                idx === qIndex
                    ? { ...q, OPTION: q.OPTION.filter((_, i) => i !== cIndex) }
                    : q
            )
        );
        setOptionFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[`${qIndex}-${cIndex}`];
            return newFiles;
        });
    };

    const onDrop = (event, index) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const syntheticEvent = { target: { files: [file] } };
            selectFile(syntheticEvent, index);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };




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
        getSurveyAndQuestions();
    }, [surveyId]);

    return (
        <div className="container-custom">
            {isLoading && (
                <div className="loading-overlay">
                    <Spinner animation="border" />
                </div>
            )}
            {showError && (
                <Alert
                    variant="danger"
                    onClose={() => setShowError(false)}
                    dismissible
                >
                    {errorMessage}
                </Alert>
            )}
            <div className="header">
                <h1>Survey Questions</h1>
            </div>
            <hr className="line-divider" />
            <Card className="question-card">
                <Card.Body>
                    <h2 className="mb-4">Head Survey</h2>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={surveyFormData.NAME}
                            onChange={(e) => setSurveyFormData({ ...surveyFormData, NAME: e.target.value })}
                            placeholder="Enter survey title"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <input id="trixInput" type="hidden" value={surveyFormData.DESCRIPTION} />
                        <trix-editor ref={editorRef} input="trixInput"></trix-editor>
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
                </Card.Body>
            </Card>
            <div className="question-card my-5">
                <Card className="question-card">
                    <Card.Body>
                        <h2 >List Survey</h2>
                    </Card.Body>
                </Card>
                <div className="questions-list">
                    {questions.map((question, idx) => (
                        <div className="question" key={idx}>
                            <div className="question-remove" onClick={() => removeQuestion(idx)}>
                                <span className="close-x">×</span>
                            </div>
                            <input
                                type="file"
                                ref={(el) => (fileInputRefs.current[idx] = el)}
                                accept="image/jpeg,image/png,application/pdf"
                                onChange={(e) => selectFile(e, idx)}
                                style={{ display: "none" }}
                            />
                            <div className="num">{question.number}</div>
                            <Card className="question-card">
                                <Card.Body>
                                    <div className="sequence-buttons mb-3">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => moveQuestionUp(idx)}
                                            disabled={idx === 0}
                                        >
                                            ↑ Up
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => moveQuestionDown(idx)}
                                            disabled={idx === questions.length - 1}
                                            className="ms-2"
                                        >
                                            ↓ Down
                                        </Button>
                                    </div>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Type Question</Form.Label>
                                        <Form.Select
                                            value={question.CATEGORY}
                                            onChange={(e) =>
                                                setQuestions((prev) =>
                                                    prev.map((q, i) =>
                                                        i === idx
                                                            ? {
                                                                ...q,
                                                                CATEGORY: e.target.value,
                                                                OPTION:
                                                                    e.target.value.includes("MULTIPLE") ||
                                                                        e.target.value.includes("CHECKBOX")
                                                                        ? q.OPTION.length
                                                                            ? q.OPTION
                                                                            : [
                                                                                e.target.value === "MULTIPLE_CHOICE_IMAGE" ||
                                                                                    e.target.value === "CHECKBOX_IMAGE"
                                                                                    ? { option: "", image_url: "" }
                                                                                    : { option: "", description: "" },
                                                                            ]
                                                                        : [],
                                                            }
                                                            : q
                                                    )
                                                )
                                            }
                                        >
                                            {questionTypeOptions.map((opt, optIdx) => (
                                                <option key={optIdx} value={opt.value}>
                                                    {opt.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <div>
                                        {!question.ATTACHED_FILE && !questionFiles[idx] ? (
                                            <div
                                                className="form-upload-file"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => onDrop(e, idx)}
                                                onClick={() => fileInputRefs.current[idx].click()}
                                            >
                                                <span className="upload-icon">⬆</span>
                                                <span className="upload-title">Upload Document</span>
                                                <span className="upload-description">
                                                    Select or drag file (JPEG/PNG/PDF, max 2MB)
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
                                                {question.ATTACHED_FILE ? (
                                                    <img
                                                        src={question.ATTACHED_FILE}
                                                        alt={`Question ${idx + 1}`}
                                                        className="question-img"
                                                    />
                                                ) : questionFiles[idx].type === "application/pdf" ? (
                                                    <div className="file-info">
                                                        <p>Selected: {questionFiles[idx].name}</p>
                                                        <p>Size: {formatFileSize(questionFiles[idx].size)}</p>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={URL.createObjectURL(questionFiles[idx])}
                                                        alt={`Question ${idx + 1}`}
                                                        className="question-img"
                                                    />
                                                )}
                                                <div className="upload-bar">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => fileInputRefs.current[idx].click()}
                                                    >
                                                        Replace File
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => removeImage(idx)}
                                                        className="ms-2"
                                                    >
                                                        Remove File
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Form.Group className="mt-3">
                                        <Form.Label>Question</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={question.QUESTION}
                                            onChange={(e) =>
                                                setQuestions((prev) =>
                                                    prev.map((q, i) =>
                                                        i === idx ? { ...q, QUESTION: e.target.value } : q
                                                    )
                                                )
                                            }
                                            placeholder={`Question ${idx + 1}`}
                                        />
                                    </Form.Group>
                                    {(question.CATEGORY === "MULTIPLE_CHOICE" ||
                                        question.CATEGORY === "CHECKBOX" ||
                                        question.CATEGORY === "MULTIPLE_CHOICE_IMAGE" ||
                                        question.CATEGORY === "CHECKBOX_IMAGE") && (
                                            <div>
                                                <h4 className="mt-3">Options</h4>
                                                {question.OPTION.map((choice, cIdx) => (
                                                    <div key={cIdx} className="question-option">
                                                        <span>{multipleChoiceOptions[cIdx]}.</span>
                                                        {question.CATEGORY === "MULTIPLE_CHOICE_IMAGE" ||
                                                            question.CATEGORY === "CHECKBOX_IMAGE" ? (
                                                            <div className="option-image-upload">
                                                                <input
                                                                    type="file"
                                                                    ref={(el) =>
                                                                        (optionFileInputRefs.current[`${idx}-${cIdx}`] = el)
                                                                    }
                                                                    accept="image/jpeg,image/png"
                                                                    onChange={(e) => selectOptionFile(e, idx, cIdx)}
                                                                    style={{ display: "none" }}
                                                                />
                                                                {!choice.image_url && !optionFiles[`${idx}-${cIdx}`] ? (
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            optionFileInputRefs.current[`${idx}-${cIdx}`].click()
                                                                        }
                                                                    >
                                                                        Select Image
                                                                    </Button>
                                                                ) : (
                                                                    <div className="option-image-preview">
                                                                        {choice.image_url ? (
                                                                            <img
                                                                                src={choice.image_url}
                                                                                alt={`Option ${cIdx + 1}`}
                                                                                className="option-img"
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={URL.createObjectURL(optionFiles[`${idx}-${cIdx}`])}
                                                                                alt={`Option ${cIdx + 1}`}
                                                                                className="option-img"
                                                                            />
                                                                        )}
                                                                        <div className="option-upload-bar">
                                                                            <Button
                                                                                variant="outline-primary"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    optionFileInputRefs.current[`${idx}-${cIdx}`].click()
                                                                                }
                                                                            >
                                                                                Replace Image
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline-danger"
                                                                                size="sm"
                                                                                onClick={() => removeOptionImage(idx, cIdx)}
                                                                                className="ms-2"
                                                                            >
                                                                                Remove Image
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Form.Control
                                                                type="text"
                                                                value={choice.description}
                                                                onChange={(e) =>
                                                                    setQuestions((prev) =>
                                                                        prev.map((q, i) =>
                                                                            i === idx
                                                                                ? {
                                                                                    ...q,
                                                                                    OPTION: q.OPTION.map((c, ci) =>
                                                                                        ci === cIdx
                                                                                            ? { ...c, description: e.target.value }
                                                                                            : c
                                                                                    ),
                                                                                }
                                                                                : q
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                        <div
                                                            onClick={() => removeChoice(idx, cIdx)}
                                                            className="close-x"
                                                        >
                                                            ×
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="add-button" onClick={() => addChoice(idx)}>
                                                    <div className="line"></div>
                                                    <span className="button">+ Add Option</span>
                                                    <div className="line"></div>
                                                </div>
                                            </div>
                                        )}
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                    <Button variant="primary" onClick={addQuestion} className="mt-3">
                        ADD QUESTION
                    </Button>

                </div>

            </div>
            <div className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="secondary"
                    onClick={goBack}
                    style={{ width: "150px", marginRight: "10px" }}
                >
                    BACK
                </Button>
                <Button
                    variant="primary"
                    onClick={saveQuestions}
                    style={{ width: "300px" }}
                >
                    SAVE
                </Button>
            </div>
        </div>
    );
};

export default SurveyQuestionManager;