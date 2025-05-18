import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import * as XLSX from "xlsx";

// Initial state for exam form based on the model
const initialExam = (companyId) => ({
  THUMBNAIL_IMAGE_URL: "",
  IMAGE_URL: "",
  NAME: "",
  DESCRIPTION: "",
  START_DATE: "",
  END_DATE: "",
  DURATION_MINUTE: 30,
  IS_RANDOM_QUESTION: false,
  CATEGORY: "GENERAL",
  CODE_TEST: "",
  UPDATED_BY: companyId,
  IS_DELETE: "N",
  EMP_COMPANY: companyId,
});

const Exam = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [examFormData, setExamFormData] = useState(initialExam(idPerusahaan));
  const [listExams, setListExams] = useState([]);
  const [modalExam, setModalExam] = useState(false);
  const [actType, setActType] = useState("Create");
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch all exams
  const getExams = async () => {
    try {
      const response = await axios.get(`/exam?EMP_COMPANY=${idPerusahaan}`);
      if (response.status === 200) {
        setListExams(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to retrieve exams", { autoClose: 3000 });
    }
  };

  // Upload single file (image)
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

  // Download template
  const downloadTemplate = () => {
    const templateData = [
      {
        Title: "",
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
        F: "",
        Answer: "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "exam_question_template.xlsx");
  };

  // Create exam
  const createExam = async () => {

    let thumbnailUrl = examFormData.THUMBNAIL_IMAGE_URL;
    let imageUrl = examFormData.IMAGE_URL;

    if (thumbnailFile) {
      thumbnailUrl = await uploadSingleFile(thumbnailFile);
    }
    if (imageFile) {
      imageUrl = await uploadSingleFile(imageFile);
    }

    

    const dataToSend = {
      ...examFormData,
      THUMBNAIL_IMAGE_URL: thumbnailUrl,
      IMAGE_URL: imageUrl,
      START_DATE: examFormData.START_DATE || new Date().toISOString().split("T")[0],
      END_DATE: examFormData.END_DATE || new Date().toISOString().split("T")[0],
      CODE_TEST: parseInt(examFormData.CODE_TEST) || 0,
    };

    try {
      const response = await axios.post("/exam", dataToSend);
      if (response.status === 201) {
        if (file) {
            await handleFileUpload(response.data.data)
        }
        toast.success("Exam created successfully", { autoClose: 3000 });
        setModalExam(false);
        setExamFormData(initialExam(idPerusahaan));
        setThumbnailFile(null);
        setImageFile(null);
        setFile(null);
            getExams();
      }
    } catch (error) {
      toast.error("Failed to create exam", { autoClose: 3000 });
    }
  };

  // Update exam
  const updateExam = async (id) => {
    let thumbnailUrl = examFormData.THUMBNAIL_IMAGE_URL;
    let imageUrl = examFormData.IMAGE_URL;

    if (thumbnailFile) {
      thumbnailUrl = await uploadSingleFile(thumbnailFile);
    }
    if (imageFile) {
      imageUrl = await uploadSingleFile(imageFile);
    }

    const dataToSend = {
      ...examFormData,
      THUMBNAIL_IMAGE_URL: thumbnailUrl,
      IMAGE_URL: imageUrl,
      START_DATE: examFormData.START_DATE || new Date().toISOString().split("T")[0],
      END_DATE: examFormData.END_DATE || new Date().toISOString().split("T")[0],
      CODE_TEST: parseInt(examFormData.CODE_TEST) || 0,
    };

    try {
      const response = await axios.put(`/exam/${id}`, dataToSend);
      if (response.status === 200) {
        if (file) {
            await handleFileUpload(response.data.data)
        }
        toast.success("Exam updated successfully", { autoClose: 3000 });
        setModalExam(false);
        setExamFormData(initialExam(idPerusahaan));
        setThumbnailFile(null);
        setImageFile(null);
        setFile(null);
            getExams();
      }
    } catch (error) {
      toast.error("Failed to update exam", { autoClose: 3000 });
    }
  };

  // Delete exam
  const deleteExam = async (id) => {
    try {
      const response = await axios.delete(`/exam/${id}`);
      if (response.status === 200) {
        toast.success("Exam deleted successfully", { autoClose: 3000 });
        getExams();
      }
    } catch (error) {
      toast.error("Failed to delete exam", { autoClose: 3000 });
    }
  };

  const getQuestions = async (examId) => {
    try {
      const response = await axios.get(`/exam-question?EXAM_ID=${examId}`);
      if (response.status === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      toast.error("Failed to retrieve questions", { autoClose: 3000 });
      return [];
    }
  };

  const handleDownloadFileExist = async (examId) => {
    const questions = await getQuestions(examId);
    if (questions.length === 0) {
      toast.info("No questions found for this exam", { autoClose: 3000 });
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
    XLSX.writeFile(wb, `exam_questions_${examId}.xlsx`);
  };
  
  const handleFileUpload = async (mainId) => {
    if (!file || !mainId) {
      toast.error("Please select a file and an exam", { autoClose: 3000 });
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
            EXAM_ID: mainId,
            QUESTION: row.Title || "",
            OPTION: options,
            TRUE_ANSWER: row.Answer || "",
            SEQUENCE: index + 1,
            CATEGORY: row.Answer && row.Answer.split("|").length > 1 ? "CHECKBOX" : "MULTIPLE_CHOICE",
          };
        });

      try {
        const response = await axios.put(`/exam-question/bulk/${mainId}`, { questions });
        if (response.status === 200) {
          setFile(null);
        }
      } catch (error) {
        toast.error("Failed to update questions", { autoClose: 3000 });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle Open Modal
  const handleOpenModal = (type = "Create", data = null) => {
    setActType(type);
    if (type === "Edit" && data) {
      setExamFormData({...data, CODE_TEST: `${data.CODE_TEST}`});
    } else {
      setExamFormData(initialExam(idPerusahaan));
    }
    setModalExam(true);
  };

  // Handle Close Modal
  const hdlMdlClose = () => {
    setModalExam(false);
    setExamFormData(initialExam(idPerusahaan));
    setThumbnailFile(null);
    setImageFile(null);
    setFile(null);
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(examFormData);
    
    if (examFormData.CODE_TEST.length != 4) {
        toast.error("Kode ujian harus 4 digit", { autoClose: 3000 });
        return
    }
    try {
      if (actType === "Create") {
        await createExam();
      } else {
        await updateExam(examFormData.ID);
      }
      hdlMdlClose();
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 3000 });
    }
  };

  // Load exams on component mount
  useEffect(() => {
    getExams();
  }, []);

  return (
    <div className="container">
      {/* Header and Add Buttons */}
      <Row className="m-0 mt-2">
        <Col>
          <Button size="sm" variant="primary" onClick={() => handleOpenModal("Create")}>
            Tambah
          </Button>{" "}
          <Button size="sm" variant="success" onClick={downloadTemplate}>
            Download Template
          </Button>
        </Col>
      </Row>

      {/* Exams Table */}
      <Row className="mt-3">
        <Col>
          <Table responsive hover className="text-muted">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Durasi</th>
                <th>Kode Ujian</th>
                <th>Pertanyaan acak</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listExams.map((exam) => (
                <tr key={exam.ID}>
                  <td>{exam.NAME}</td>
                  <td>{exam.START_DATE}</td>
                  <td>{exam.END_DATE}</td>
                  <td>{exam.DURATION_MINUTE}</td>
                  <td>{exam.CODE_TEST}</td>
                  <td>{exam.IS_RANDOM_QUESTION ? "Ya": "Tidak"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleOpenModal("Edit", exam)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        Swal.fire({
                          text: `Are you sure you want to delete this exam?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "Cancel",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await deleteExam(exam.ID);
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

      {/* Exam Modal */}
      <Modal show={modalExam} onHide={hdlMdlClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actType === "Create" ? "Add Exam" : "Edit Exam"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Gambar Thumbnail (tidak wajib)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gambar (tidak wajib)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Exam Name"
                value={examFormData.NAME}
                onChange={(e) => setExamFormData({ ...examFormData, NAME: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                value={examFormData.DESCRIPTION}
                onChange={(e) => setExamFormData({ ...examFormData, DESCRIPTION: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control
                type="date"
                value={examFormData.START_DATE}
                onChange={(e) => setExamFormData({ ...examFormData, START_DATE: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Selesai</Form.Label>
              <Form.Control
                type="date"
                value={examFormData.END_DATE}
                onChange={(e) => setExamFormData({ ...examFormData, END_DATE: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Durasi tes (menit)</Form.Label>
              <Form.Control
                type="number"
                value={examFormData.DURATION_MINUTE}
                onChange={(e) => setExamFormData({ ...examFormData, DURATION_MINUTE: Number(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apakah pertanyaan diacak?</Form.Label>
              <Form.Switch
                checked={examFormData.IS_RANDOM_QUESTION}
                onChange={(e) => setExamFormData({ ...examFormData, IS_RANDOM_QUESTION: e.target.checked })}
                label={examFormData.IS_RANDOM_QUESTION ? "Yes" : "No"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={examFormData.CATEGORY}
                onChange={(e) => setExamFormData({ ...examFormData, CATEGORY: e.target.value })}
                required
              >
                <option value="GENERAL">General</option>
                {/* <option value="PRE_TEST">Pre-Test</option>
                <option value="POST_TEST">Post-Test</option> */}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kode ujian (4 digit)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Code Test"
                value={examFormData.CODE_TEST}
                onChange={(e) => setExamFormData({ ...examFormData, CODE_TEST: e.target.value })}
                required
              />
            </Form.Group>

            {/* Upload Template Section */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Soal Template</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {actType != "Create" && <Button variant="info" className="mt-4" onClick={handleDownloadFileExist}>
              Download soal sebelumnya
            </Button>}
              
            </Form.Group>
            

            <Button variant="primary" type="submit" className="mt-4">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Exam;