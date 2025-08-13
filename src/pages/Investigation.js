import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Card, Table, Form, Button, Image, Modal } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";
import { FaFileExcel, FaPlus, FaUpload, FaTrash } from "react-icons/fa6";
import { AuthContext } from "../auth/AuthProvider.js";
import { FaArrowLeft, FaEdit, FaExternalLinkAlt, FaReply } from "react-icons/fa";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const InvestigationMain = () => {
  const { value } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [Periode, setPeriode] = useState({ StartDate: moment().subtract(7, "days").format("YYYY-MM-DD"), EndDate: moment().format("YYYY-MM-DD") });
  const [dataInvestigation, setDataInvestigation] = useState([]);
  const [dataResponse, setDataResponse] = useState([]);
  const [detailInvestigation, setDetailInvestigation] = useState({});
  const [detailResponse, setDetailResponse] = useState({ INVS_RES_MESSAGE: "" });
  const [InvsManual, setInvsManual] = useState({});
  const [Mode, setMode] = useState("List");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [ModalCloseInvestigation, setModalCloseInvestigation] = useState(false);
  const [ModalCloseInvestigationNGrievance, setModalCloseInvestigationNGrievance] = useState(false);
  const [ModalAddEdit, setModalAddEdit] = useState(false);
  const [ListCategory, setListCategory] = useState([]);
  const [ListSubCategory, setListSubCategory] = useState([]);
  const [ListPIC, setListPIC] = useState([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [file, setFile] = useState(null);
  const [documentList, setDocumentList] = useState([]);
  const [fileInputs, setFileInputs] = useState([]);
  const uploadFile = useRef()

  const getInvestigationDetails = async (id) => {
    try {
      const { data } = await axios.get(`/investigation/doc/${id}`);
      setDocumentList(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error retrieving investigation details.");
    }
  };

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
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file.");
    }
    return "";
  };

  const addDocument = async (id) => {
    try {
      const files = [...fileInputs];
      for (const file of files) {
        const url = await uploadSingleFile(file);
        if (url) {
          await axios.post("/investigation/doc", {
            INVESTIGATION_ID: id,
            DOCUMENT_URL: url,
          });
        }
      }
      if (uploadFile.current) {
      uploadFile.current.value = ""; 
    }
      setFileInputs([]); 
      getInvestigationDetails(id);
      toast.success("Documents added successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Error adding documents.");
    }
  };

  const deleteDocument = async (docId, invsId) => {
    try {
      await axios.delete(`/investigation/doc/${docId}`);
      getInvestigationDetails(invsId);
      toast.success("Document deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting document.");
    }
  };

  const getCategory = async () => {
    try {
      const company = idPerusahaan ? idPerusahaan : "all";
      const response = await axios.get(`/grievance/category/${company}`);
      if (response.status === 200) {
        setListCategory(response.data.data);
      }
    } catch (err) {
      toast.warning("Cannot Get Category");
    }
  };

  const getSubCategory = async () => {
    try {
      const company = idPerusahaan ? idPerusahaan : "all";
      const response = await axios.get(`/grievance/subcategory/${company}`);
      if (response.status === 200) {
        setListSubCategory(response.data.data);
      }
    } catch (err) {
      toast.warning("Cannot Get Category");
    }
  };

  const getListPIC = async () => {
    try {
      const { data } = await axios.get("/investigation/pic-list");
      setListPIC(data.data || []);
    } catch (err) {
      toast.warning("Cannot Get PIC List");
    }
  };

  const getImageGrievance = async (id, tipe, filename) => {
    try {
      const imageData = await axios.get(`/grievance/image/${id}/${tipe}/${filename}`, { responseType: "blob" });
      if (imageData.status === 200) {
        const blob = await imageData.data;
        const url = URL.createObjectURL(blob);
        switch (tipe) {
          case 1: setImage1(url); break;
          case 2: setImage2(url); break;
          case 3: setImage3(url); break;
          default: console.log("Tipe tidak ditemukan"); break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getDataInvestigation = async (start, end) => {
    try {
      const response = await axios.get(`/investigation/find-by-date/${start}/${end}`);
      if (response.status === 200) {
        setDataInvestigation(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getDataInvestigationById = async (id) => {
    try {
      const response = await axios.get(`/investigation/find-by-id/${id}`);
      if (response.status === 200) {
        setDetailInvestigation(response.data.data[0]);
        if (response.data.data[0].GRV_MEDIA_1_FILENAME) getImageGrievance(response.data.data[0].GRV_ID, 1, response.data.data[0].GRV_MEDIA_1_FILENAME);
        if (response.data.data[0].GRV_MEDIA_2_FILENAME) getImageGrievance(response.data.data[0].GRV_ID, 2, response.data.data[0].GRV_MEDIA_2_FILENAME);
        if (response.data.data[0].GRV_MEDIA_3_FILENAME) getImageGrievance(response.data.data[0].GRV_ID, 3, response.data.data[0].GRV_MEDIA_3_FILENAME);
        await getInvestigationDetails(id); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getDataInvestigationResponById = async (id) => {
    try {
      const response = await axios.get(`/investigation/respons/find-by-id/${id}`);
      if (response.status === 200) {
        setDataResponse(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectPeriode = async (event) => {
    const { name, value } = event.target;
    if (name === "StartDate") await getDataInvestigation(value, Periode.EndDate);
    if (name === "EndDate") await getDataInvestigation(Periode.StartDate, value);
    setPeriode({ ...Periode, [name]: value });
  };

  const SignPriorityCat = (id) => {
    switch (id) {
      case 1: return "🔴 TINGGI";
      case 2: return "🟡 MODERATE";
      case 3: return "🟢 RENDAH";
      default: return "🟢 RENDAH";
    }
  };

  const onClickDetail = async (id) => {
    try {
      setMode("Detail");
      await getDataInvestigationById(id);
      await getDataInvestigationResponById(id);
    } catch (err) {
      console.log(err);
    }
  };

  const ocPostMessage = async (event) => {
    event.preventDefault();
    const { value } = event.target;
    setDetailResponse({ INVS_ID: detailInvestigation.INVS_ID, INVS_RES_CREATE_BY: userId, INVS_RES_MESSAGE: value });
  };

  const postMessage = async () => {
    try {
      const response = await axios.post("/investigation/respons", { data: detailResponse });
      if (response.status === 200) {
        setDetailResponse({ INVS_RES_MESSAGE: "" });
        getDataInvestigationResponById(detailInvestigation.INVS_ID);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeInvestigation = async () => {
    try {
      const data = { INVS_ID: detailInvestigation.INVS_ID, INVS_STATUS: "COMPLETE", INVS_UPDATE_BY: userId };
      const response = await axios.post(`/investigation/update-status/${detailInvestigation.INVS_ID}`, { data });
      if (response.status === 200) {
        toast.success("Investigation telah ditutup");
        setModalCloseInvestigation(false);
        setDetailResponse({ INVS_RES_MESSAGE: "" });
        setMode("List");
        getDataInvestigation(Periode.StartDate, Periode.EndDate);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const exportXLSSummary = async () => {
    const response = await axios.get(`/investigation/report/${Periode.StartDate}/${Periode.EndDate}`);
    if (response.status === 200) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      worksheet.columns = [
        { header: "CATEGORY", key: "CATEGORY" },
        { header: "SUBCATEGORY", key: "SUBCATEGORY" },
        { header: "PRIORITY", key: "PRIORITY" },
        { header: "PROCESS_TIME", key: "PROCESS_TIME" },
        { header: "TITLE", key: "GRV_TITLE" },
        { header: "DESCRIPTION", key: "GRV_DESCRIPTION" },
        { header: "COMPANY", key: "GRV_COMPANY" },
        { header: "GRV SUBMIT_BY", key: "GRV_SUBMIT_BY" },
        { header: "GRV SUBMIT_DATE", key: "GRV_SUBMIT_DATE", style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
        { header: "INVS STATUS", key: "INVS_STATUS" },
        { header: "INVS CREATE BY", key: "INVS_CREATE_NAME" },
        { header: "INVS CREATE DATE", key: "INVS_CREATE_DATE", style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
        { header: "INVS UPDATE BY", key: "INVS_UPDATE_NAME" },
        { header: "INVS UPDATE DATE", key: "INVS_UPDATE_DATE", style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
        { header: "INVS RES MESSAGE", key: "INVS_RES_MESSAGE" },
        { header: "INVS RES CREATE BY", key: "INVS_RES_CREATE_NAME" },
        { header: "INVS RES CREATE DATE", key: "INVS_RES_CREATE_DATE" },
      ];
      const transformData = (row) => {
        if (row.GRV_SUBMIT_DATE) row.GRV_SUBMIT_DATE = moment(row.GRV_SUBMIT_DATE).format("YYYY-MM-DD HH:mm:ss");
        if (row.INVS_CREATE_DATE) row.INVS_CREATE_DATE = moment(row.INVS_CREATE_DATE).format("YYYY-MM-DD HH:mm:ss");
        if (row.INVS_UPDATE_DATE) row.INVS_UPDATE_DATE = moment(row.INVS_UPDATE_DATE).format("YYYY-MM-DD HH:mm:ss");
        if (row.INVS_RES_CREATE_DATE) row.INVS_RES_CREATE_DATE = moment(row.INVS_RES_CREATE_DATE).format("YYYY-MM-DD HH:mm:ss");
        return row;
      };
      response.data.data.forEach((row) => worksheet.addRow(transformData(row)));
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Investigation-Recap.xlsx`);
    }
  };

  const ocInvsManual = (event) => {
    const { name, value } = event.target;
    setInvsManual((prevData) => ({
      ...prevData,
      [name]: value,
      INVSM_COMPANY: idPerusahaan,
      INVSM_SUBMIT_BY: userId,
      INVSM_SUBMIT_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!InvsManual.INVSM_DATE) errors.INVSM_DATE = "Tanggal wajib diisi";
    if (!InvsManual.INVSM_TITLE) errors.INVSM_TITLE = "Judul wajib diisi";
    if (!InvsManual.INVSM_CATEGORY_ID) errors.INVSM_CATEGORY_ID = "Kategori wajib dipilih";

    if (Object.keys(errors).length > 0) {
      toast.error("Mohon lengkapi semua field yang wajib!");
      return false;
    }

    return true;
  };

  const submitInvsManual = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("/investigation/investigation-manual", { data: InvsManual });
      toast.success("Success Add Investigation Manual");
      setModalAddEdit(false);
      setInvsManual({});
      getDataInvestigation(Periode.StartDate, Periode.EndDate);
    } catch (err) {
      toast.error("Error adding Investigation Manual");
    }
  };

  const handleEdit = async (item) => {
    setSelectedInvestigation(item);
    setInvsManual({
      INVSM_ID: item.INVSM_ID,
      INVSM_DATE: item.INVSM_DATE ? moment(item.INVSM_DATE).format("YYYY-MM-DD") : "",
      INVSM_DEADLINE_DATE: item.INVSM_DEADLINE_DATE ? moment(item.INVSM_DEADLINE_DATE).format("YYYY-MM-DD") : "",
      INVSM_INFORMANT: item.INVSM_INFORMANT || "",
      INVSM_SOURCE: item.INVSM_SOURCE || "LAIN_LAIN",
      INVSM_AREA: item.INVSM_AREA || "",
      INVSM_STATUS: item.INVSM_STATUS || "DITERIMA",
      INVSM_PIC: item.INVSM_PIC || "",
      INVSM_TITLE: item.INVSM_TITLE || "",
      INVSM_CATEGORY_ID: item.INVSM_CATEGORY_ID || "",
      INVSM_SUBCATEGORY_ID: item.INVSM_SUBCATEGORY_ID || "",
      INVSM_DESCRIPTION: item.INVSM_DESCRIPTION || "",
      INVSM_COMPLETED_DATE: item.INVSM_COMPLETED_DATE ? moment(item.INVSM_COMPLETED_DATE).format("YYYY-MM-DD") : "",
      INVSM_COMPANY: item.INVSM_COMPANY || idPerusahaan,
      INVSM_SUBMIT_BY: item.INVSM_SUBMIT_BY || userId,
      INVSM_SUBMIT_DATE: item.INVSM_SUBMIT_DATE ? moment(item.INVSM_SUBMIT_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
      INVS_STATUS: item.INVS_STATUS || "ON-PROGRESS",
      INVSM_NOTES: item.INVSM_NOTES || "",
      INVSM_CASE_TYPE: item.INVSM_CASE_TYPE || "LAIN-LAIN",
      INVSM_SAME_REPORT_COUNT: item.INVSM_SAME_REPORT_COUNT || 0,
    });
    setModalAddEdit(true);
  };

  const importExcel = async (event) => {
    const file = event.target.files[0];
    setFile(file);
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target.result;
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.getWorksheet(1);
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          data.push({
            INVSM_DATE: row.getCell(2).value ? moment(row.getCell(2).value).format("YYYY-MM-DD") : null,
            INVSM_DEADLINE_DATE: row.getCell(3).value ? moment(row.getCell(3).value).format("YYYY-MM-DD") : null,
            INVSM_INFORMANT: row.getCell(4).value ? row.getCell(4).value.toString() : "",
            INVSM_SOURCE: row.getCell(5).value ? row.getCell(5).value.toString() : "LAIN_LAIN",
            INVSM_AREA: row.getCell(6).value ? row.getCell(6).value.toString() : "",
            INVSM_STATUS: row.getCell(7).value ? row.getCell(7).value.toString() : "ON-PROGRESS",
            INVSM_PIC: row.getCell(8).value ? row.getCell(8).value.toString() : "INVESTIGASI",
            INVSM_CASE_TYPE: row.getCell(9).value ? row.getCell(9).value.toString() : "LAIN-LAIN",
            INVSM_TITLE: row.getCell(10).value ? row.getCell(10).value.toString() : "",
            INVSM_SAME_REPORT_COUNT: row.getCell(11).value ? parseInt(row.getCell(11).value) : 0,
            INVS_STATUS: row.getCell(12).value ? row.getCell(12).value.toString() : "ON-PROGRESS",
            INVSM_NOTES: row.getCell(13).value ? row.getCell(13).value.toString() : "",
            INVSM_COMPLETED_DATE: row.getCell(14).value ? moment(row.getCell(14).value).format("YYYY-MM-DD") : null,
          });
        }
      });

      try {
        const response = await axios.post("/investigation/import-excel", { data });
        if (response.status === 200) {
          toast.success("Data imported successfully");
          getDataInvestigation(Periode.StartDate, Periode.EndDate);
        }
      } catch (err) {
        toast.error("Error importing data");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const InitDataInvestigation = async () => {
      const start = moment().subtract(7, "days").format("YYYY-MM-DD");
      const end = moment().format("YYYY-MM-DD");
      await getDataInvestigation(start, end);
      await getCategory();
      await getSubCategory();
      await getListPIC();
    };
    InitDataInvestigation();
  }, []);

  return (
    <>
      {Mode === "List" && (
        <Row className="mx-0 mt-3">
          <Col className="ps-3 p-2">
            <Card className="border-0">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="formStartDate">
                        <Form.Control size="sm" type="date" defaultValue={Periode.StartDate} name="StartDate" onChange={selectPeriode} />
                      </Form.Group>
                    </Col>
                    <Col>-</Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="formEndDate">
                        <Form.Control size="sm" type="date" defaultValue={Periode.EndDate} name="EndDate" onChange={selectPeriode} />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Button variant="primary" size="sm" onClick={() => { setModalAddEdit(true); setSelectedInvestigation(null); setInvsManual({}); }} className="me-2">
                    <FaPlus /> Add
                  </Button>
                  <Button variant="success" size="sm" onClick={exportXLSSummary} className="me-2">
                    <FaFileExcel /> Export
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="text rounded shadow-sm">
                <Row>
                  <Col sm={12}>
                    <Table hover size="sm">
                      <thead>
                        <tr>
                          <th style={{ width: "10%" }}>PRIORITAS</th>
                          <th style={{ width: "10%" }}>STATUS</th>
                          <th style={{ width: "10%" }}>KATEGORI</th>
                          <th style={{ width: "10%" }}>SUBKATEGORI</th>
                          <th style={{ width: "10%" }}>BATAS WAKTU PROSES</th>
                          <th style={{ width: "10%" }}>TANGGAL SUBMIT</th>
                          <th style={{ width: "10%" }}>PELAPOR</th>
                          <th style={{ width: "10%" }}>INVESTIGATOR</th>
                          <th style={{ width: "20%" }}>TOPIK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataInvestigation.map((item, index) => (
                          <tr key={item.INVS_ID} onDoubleClick={() => onClickDetail(item.INVS_ID)}>
                            <td className="py-3" style={{ width: "10%" }}>{SignPriorityCat(item.PRIORITY)}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.INVS_STATUS}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.CATEGORY}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.SUBCATEGORY}</td>
                            <td className="py-3" style={{ width: "10%" }}>{moment(item.GRV_DEADLINE_PROCESS).format("YYYY-MM-DD HH:mm:ss")}</td>
                            <td className="py-3" style={{ width: "10%" }}>{moment(item.INVS_CREATE_DATE).format("YYYY-MM-DD HH:mm:ss")}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.GRV_SUBMIT_BY}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.INVS_CREATE_NAME}</td>
                            <td className="py-3" style={{ width: "20%" }}>{item.GRV_TITLE}</td>
                            <td className="py-3" style={{ width: "5%" }}>
                              <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="me-2">
                                <FaEdit /> Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {Mode === "Detail" && (
        <Row className="mx-0 mt-3 bg-light">
          <Col className="ps-3 p-2 bg-light" lg={9}>
            <Card className="border-0">
              <Card.Header className="align-items-center">
                <Row>
                  <Col sm={12}>
                    <h5><Button variant="danger" onClick={() => setMode("List")}><FaArrowLeft /></Button> Detail Investigation</h5>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="mt-3">
                    <h1>{detailInvestigation.GRV_TITLE}</h1>
                  </Col>
                  <Col sm={12} className="mt-3">
                    <p>{detailInvestigation.GRV_DESCRIPTION}</p>
                  </Col>
                  <Col sm={12} className="mt-3">
                    <p>
                      {detailInvestigation.GRV_MEDIA_1_FILENAME && <Image src={image1} style={{ maxWidth: "250px" }} />}
                      {detailInvestigation.GRV_MEDIA_2_FILENAME && <Image src={image2} style={{ maxWidth: "250px" }} />}
                      {detailInvestigation.GRV_MEDIA_3_FILENAME && <Image src={image3} style={{ maxWidth: "250px" }} />}
                    </p>
                  </Col>
                </Row>
                {dataResponse.map((item, index) => (
                  <Row key={index}>
                    <Col sm={12}>
                      <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }}>
                        <div dangerouslySetInnerHTML={{ __html: item.INVS_RES_MESSAGE }} />
                        <br />
                        <p style={{ textDecoration: "overline" }}><FaReply /> Direspon pada {moment(item.INVS_RES_CREATE_DATE).format("DD-MM-YYYY HH:mm:ss") || ""} oleh <i>{item.INVS_RES_CREATE_NAME || ""}</i></p>
                      </Card>
                      <br />
                    </Col>
                  </Row>
                ))}
                {detailInvestigation.INVS_STATUS !== "COMPLETE" && (
                  <Row>
                    <Col sm={12}>
                      <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }}>
                        <Form.Group className="mb-3" controlId="formMessage">
                          <Form.Label>Pesan</Form.Label>
                          <Form.Control as="textarea" rows={3} value={detailResponse.INVS_RES_MESSAGE} onChange={ocPostMessage} />
                        </Form.Group>
                        <div className="d-grid gap-2">
                          <Button variant="primary" onClick={postMessage}>POST</Button>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Card.Header>
            </Card>
          </Col>
          <Col className="ps-3 p-2" lg={3}>
            <Card className="border-0">
              <Card.Header className="align-items-center">
                <Row>
                  <Col sm={12} className="mt-3">
                    <Table>
                      <tr><td className="py-2"><b>KATEGORI</b></td><td><b>: {detailInvestigation.CATEGORY}</b></td></tr>
                      <tr><td className="py-2"><b>SUB KATEGORI</b></td><td><b>: {detailInvestigation.SUBCATEGORY}</b></td></tr>
                      <tr><td className="py-2"><b>STATUS INVESTIGASI</b></td><td><b>: {detailInvestigation.INVS_STATUS}</b></td></tr>
                      <tr><td className="py-2"><b>PRIORITAS</b></td><td><b>: {SignPriorityCat(detailInvestigation.GRV_PRIORITY)}</b></td></tr>
                      <tr><td className="py-2"><b>BATAS WAKTU RESPON</b></td><td><b>: {moment(detailInvestigation.GRV_DEADLINE_PROCESS).format("DD-MM-YYYY HH:mm:ss")}</b></td></tr>
                      {detailInvestigation.INVS_STATUS === "COMPLETE" && (
                        <tr><td className="py-2"><b>DITUTUP OLEH / WAKTU</b></td><td><b>: {detailInvestigation.INVS_UPDATE_NAME} / {moment(detailInvestigation.INVS_UPDATE_DATE).format("DD-MM-YYYY HH:mm:ss")}</b></td></tr>
                      )}
                      {detailInvestigation.INVS_STATUS !== "COMPLETE" && (
                        <tr><td><div className="d-grid gap-2"><Button variant="primary" onClick={() => setModalCloseInvestigation(true)}>TUTUP INVESTIGASI</Button></div></td></tr>
                      )}
                    </Table>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <h6 className="mb-3">Documents</h6>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "4px", padding: "10px" }}>
                  {documentList.length > 0 ? (
                    <ul className="list-group">
                      {documentList.map((doc, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <a href={doc.DOCUMENT_URL} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                            {doc.DOCUMENT_URL.split("/").pop()}
                          </a>
                          <div>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-info me-2"
                              onClick={() => window.open(doc.DOCUMENT_URL, "_blank")}
                            >
                              <FaExternalLinkAlt />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger"
                              onClick={() => deleteDocument(doc.ID, detailInvestigation.INVS_ID)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No documents available.</p>
                  )}
                </div>
                <Form.Group className="mt-3">
                  <Form.Label>Upload Document</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    ref={uploadFile}
                    onChange={(e) => setFileInputs(Array.from(e.target.files))}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => addDocument(detailInvestigation.INVS_ID)}
                  >
                    <FaUpload /> Upload
                  </Button>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Modal show={ModalCloseInvestigation} onHide={() => setModalCloseInvestigation(false)}>
        <Modal.Header closeButton><Modal.Title>Konfirmasi Tutup Investigasi</Modal.Title></Modal.Header>
        <Modal.Body><p>Apakah anda yakin ingin menutup investigasi ini ?</p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalCloseInvestigation(false)}>Batal</Button>
          <Button variant="primary" onClick={closeInvestigation}>Tutup</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={ModalCloseInvestigationNGrievance} onHide={() => setModalCloseInvestigationNGrievance(false)}>
        <Modal.Header closeButton><Modal.Title>Konfirmasi Tutup Investigasi & Grievance</Modal.Title></Modal.Header>
        <Modal.Body><p>Apakah anda yakin ingin menutup investigasi dan Grievance terkait ini ?</p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalCloseInvestigationNGrievance(false)}>Batal</Button>
          <Button variant="primary" onClick={closeInvestigation}>Tutup</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={ModalAddEdit} size="xl" onHide={() => { setModalAddEdit(false); setSelectedInvestigation(null); setInvsManual({}); }}>
        <Form onSubmit={(e) => { e.preventDefault(); submitInvsManual(); }}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedInvestigation ? "Edit Investigation" : "Add Investigation"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="mt-2">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control type="date" name="INVSM_DATE" value={InvsManual.INVSM_DATE || ""} onChange={ocInvsManual} required />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Jatuh Tempo</Form.Label>
                <Form.Control type="date" name="INVSM_DEADLINE_DATE" value={InvsManual.INVSM_DEADLINE_DATE || ""} onChange={ocInvsManual} required />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Tanggal Selesai</Form.Label>
                <Form.Control type="date" name="INVSM_COMPLETED_DATE" value={InvsManual.INVSM_COMPLETED_DATE || ""} onChange={ocInvsManual} />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>PLP</Form.Label>
                <Form.Control type="text" name="INVSM_INFORMANT" value={InvsManual.INVSM_INFORMANT || ""} onChange={ocInvsManual} required />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Isi Laporan</Form.Label>
                <Form.Control type="text" name="INVSM_TITLE" value={InvsManual.INVSM_TITLE || ""} onChange={ocInvsManual} required />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Area</Form.Label>
                <Form.Control type="text" name="INVSM_AREA" value={InvsManual.INVSM_AREA || ""} onChange={ocInvsManual} />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Asal</Form.Label>
                <Form.Select name="INVSM_SOURCE" value={InvsManual.INVSM_SOURCE || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Asal</option>
                  <option value="KOTAK_SARAN">Kotak Saran</option>
                  <option value="HOTLINE">Hotline</option>
                  <option value="APLIKASI">Aplikasi</option>
                  <option value="INFOLINE_STAFF">Infoline Staff</option>
                  <option value="HRD_COMPLIANCE">HRD/Compliance</option>
                  <option value="LAIN_LAIN">Lain-Lain</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Status Penanganan</Form.Label>
                <Form.Select name="INVSM_STATUS" value={InvsManual.INVSM_STATUS || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Status</option>
                  <option value="DITERIMA">Diterima</option>
                  <option value="DI_TOLAK">Di Tolak</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>PIC Penanganan</Form.Label>
                <Form.Select name="INVSM_PIC" value={InvsManual.INVSM_PIC || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih PIC</option>
                  {ListPIC.map((pic, index) => (
                    <option key={index} value={pic.ID}>{pic.TITLE}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Jenis Kasus</Form.Label>
                <Form.Select name="INVSM_CASE_TYPE" value={InvsManual.INVSM_CASE_TYPE || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Jenis</option>
                  <option value="KEKERASAN_PSIKIS_VERBAL">Kekerasan Psikis Verbal</option>
                  <option value="KEKERASAN_PSIKIS_NON_VERBAL">Kekerasan Psikis Non-Verbal</option>
                  <option value="KEKERASAN_FISIK">Kekerasan Fisik</option>
                  <option value="KEKERASAN_EKONOMI">Kekerasan Ekonomi</option>
                  <option value="KEKERASAN_SOSIAL">Kekerasan Sosial</option>
                  <option value="KEKERASAN_SEKSUAL">Kekerasan Seksual</option>
                  <option value="ANCAMAN_PEMAKSAAN_PEMBALASAN">Ancaman, Pemaksaan, Pembalasan</option>
                  <option value="LAIN_LAIN">Lain-Lain</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="INVS_STATUS" value={InvsManual.INVS_STATUS || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON-PROGRESS">On-Progress</option>
                  <option value="WAITING">Waiting</option>
                  <option value="CANCEL">Cancel</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Jumlah Laporan yang Sama</Form.Label>
                <Form.Control type="number" name="INVSM_SAME_REPORT_COUNT" value={InvsManual.INVSM_SAME_REPORT_COUNT || 0} onChange={ocInvsManual} />
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control as="textarea" rows={3} name="INVSM_DESCRIPTION" value={InvsManual.INVSM_DESCRIPTION || ""} onChange={ocInvsManual} />
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Catatan</Form.Label>
                <Form.Control as="textarea" rows={3} name="INVSM_NOTES" value={InvsManual.INVSM_NOTES || ""} onChange={ocInvsManual} />
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Category</Form.Label>
                <Form.Select name="INVSM_CATEGORY_ID" value={InvsManual.INVSM_CATEGORY_ID || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Category</option>
                  {ListCategory.map((item, index) => (
                    <option key={index} value={item.ID}>{item.TITLE}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Subcategory</Form.Label>
                <Form.Select name="INVSM_SUBCATEGORY_ID" value={InvsManual.INVSM_SUBCATEGORY_ID || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Subcategory</option>
                  {ListSubCategory
                    .filter(item => parseInt(item.ID_CATEGORY) === parseInt(InvsManual.INVSM_CATEGORY_ID))
                    .map((item, index) => (
                      <option key={index} value={item.ID}>{item.TITLE}</option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setModalAddEdit(false); setSelectedInvestigation(null); setInvsManual({}); }}>Cancel</Button>
            <Button variant="success" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default InvestigationMain;