import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import "trix/dist/trix.css";
import "trix";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  const [modalQR, setModalQR] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(null);

  const categories = [{ name: "Umum", value: "GENERAL" }];

  const editorRef = useRef(null);

  const getSurveys = async () => {
    try {
      const response = await axios.get(`/survey?company=${idPerusahaan}`);
      if (response.status === 200) {
        setListSurveys(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal mengambil daftar survei", { autoClose: 3000 });
    }
  };

  const createSurvey = async (data) => {
    try {
      const response = await axios.post("/survey", data);
      if (response.status === 201) {
        toast.success("Survei berhasil dibuat", { autoClose: 3000 });
        navigate("/survey");
      }
    } catch (error) {
      toast.error("Gagal membuat survei", { autoClose: 3000 });
    }
  };

  const updateSurvey = async (id, data) => {
    try {
      const response = await axios.put(`/survey/${id}`, data);
      if (response.status === 200) {
        toast.success("Survei berhasil diperbarui", { autoClose: 3000 });
        getSurveys();
      }
    } catch (error) {
      toast.error("Gagal memperbarui survei", { autoClose: 3000 });
    }
  };

  const deleteSurvey = async (id) => {
    try {
      const response = await axios.delete(`/survey/${id}`);
      if (response.status === 200) {
        toast.success("Survei berhasil dihapus", { autoClose: 3000 });
        getSurveys();
      }
    } catch (error) {
     toast.error("Gagal menghapus survei", { autoClose: 3000 });
    }
  };

  const handleOpenModal = (type = "Create", surveyData = null) => {
    try {
      if (type === "Edit" && surveyData) {
        setSurveyFormData({
          ...surveyData,
          START_DATE: surveyData.START_DATE.split("T")[0],
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
  };

  const handleGenerateQR = (surveyId) => {
    setCurrentClassId(surveyId);
    setModalQR(true);
  };

  const handlePrintQR = () => {
    const qrElement = document.getElementById('qrCodeContainer');
    if (!qrElement) {
      alert('QR code tidak ditemukan.');
      return;
    }

    // Membuka jendela print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak QR Code Aplikasi GBVH</title>
          <style>
            body { 
              margin: 0; 
              display: flex; 
              flex-direction: column;
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              background-color: #fff; 
            }
            #qrCodeContainer { 
              text-align: center; 
            }
            #qrCodeContainer svg {
              width: 200px;
              height: 200px;
            }
            @media print { 
              body { margin: 0; }
              #qrCodeContainer { width: 200px; height: 200px; }
              #qrCodeContainer svg { width: 200px; height: 200px; }
              p { font-size: 14px; margin-top: 30px; }
            }
          </style>
        </head>
        <body>
          <div id="qrCodeContainer">
            ${qrElement.innerHTML}
          </div>
          <p style="text-align: center; font-weight: bold; margin-top: 30px;">
            QR Code untuk Aplikasi GBVH
          </p>
          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 100);
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
      getSurveys();
      hdlMdlClose();
    } catch (error) {
      toast.error("Terjadi kesalahan", { autoClose: 3000 });
    }
  };

  const downloadData = async (id, name) => {
    try {
      const response = await axios.get(`/survey-answer/import?surveyId=${id}`);
      if (response.status === 200) {
        const data = response.data.data;

        const excelData = data.map((item) => ({
          Question: item.question,
          A1: item.answers.find((a) => a.option === "A1").count,
          A2: item.answers.find((a) => a.option === "A2").count,
          A3: item.answers.find((a) => a.option === "A3").count,
          A4: item.answers.find((a) => a.option === "A4").count,
          A5: item.answers.find((a) => a.option === "A5").count,
        }));

        const worksheetData = [["Question", "A1", "A2", "A3", "A4", "A5"], ...excelData.map(Object.values)];

        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Survey Answers");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        saveAs(blob, `${name}.xlsx`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("trix-change", (event) => {
        setSurveyFormData((prevData) => ({
          ...prevData,
          DESCRIPTION: event.target.value,
        }));
      });
    }
    getSurveys();
  }, []);

  return (
    <div className="container">
      <Modal show={modalQR} onHide={() => setModalQR(false)}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code untuk Survei</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="qrCodeContainer" style={{ textAlign: "center", padding: "20px" }}>
            <QRCodeSVG value={`VoteDetail/${currentClassId}`} size={200} />
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              variant="primary"
              onClick={handlePrintQR}
              style={{ marginRight: "10px" }}
              aria-label="Cetak QR Code"
            >
              Cetak QR Code
            </Button>
            <Button
              variant="secondary"
              onClick={() => setModalQR(false)}
              aria-label="Tutup modal QR code"
            >
              Tutup
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Header and Add Button */}
      <Row className="m-0 mt-2">
        <Col>
          <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
            Tambah Survei
          </Button>
        </Col>
      </Row>

      {/* Survey Table */}
      <Row className="mt-3">
        <Col>
          <Table responsive hover className="text-muted">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Aksi</th>
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
                    <Button size="sm" variant="warning" onClick={() => downloadData(survey.ID, survey.NAME)}>
                      Unduh Hasil
                    </Button>
                    <Button size="sm" variant="info" onClick={() => redirectRouter(survey.ID)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        Swal.fire({
                          text: `Apakah Anda yakin ingin menghapus survei ini?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Ya",
                          cancelButtonText: "Batal",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await deleteSurvey(survey.ID);
                          }
                        });
                      }}
                    >
                      Hapus
                    </Button>
                    <Button size="sm" variant="success" onClick={() => handleGenerateQR(survey.ID)}>
                      Generate QR
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
          <Modal.Title>{actType === "Create" ? "Tambah Survei" : "Edit Survei"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                value={surveyFormData.NAME}
                onChange={(e) => setSurveyFormData({ ...surveyFormData, NAME: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <input id="trixInput" type="hidden" value={surveyFormData.DESCRIPTION} />
              <trix-editor ref={editorRef} input="trixInput" style={{ height: "200px" }}></trix-editor>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control
                type="date"
                value={surveyFormData.START_DATE}
                onChange={(e) => setSurveyFormData({ ...surveyFormData, START_DATE: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Selesai</Form.Label>
              <Form.Control
                type="date"
                value={surveyFormData.END_DATE}
                onChange={(e) => setSurveyFormData({ ...surveyFormData, END_DATE: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={surveyFormData.CATEGORY}
                onChange={(e) => setSurveyFormData({ ...surveyFormData, CATEGORY: e.target.value })}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ucapan ketika sudah mengisi survei</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={surveyFormData.END_TEXT}
                onChange={(e) => setSurveyFormData({ ...surveyFormData, END_TEXT: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Survey;