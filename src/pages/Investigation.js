import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Card, Table, Form, Button, Modal, Spinner, Badge } from "react-bootstrap";
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
  const [ModalCloseInvestigation, setModalCloseInvestigation] = useState(false);
  const [ModalCloseInvestigationNGrievance, setModalCloseInvestigationNGrievance] = useState(false);
  const [ModalAddEdit, setModalAddEdit] = useState(false);
  const [ListCategory, setListCategory] = useState([]);
  const [ListSubCategory, setListSubCategory] = useState([]);
  const [ListPIC, setListPIC] = useState([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [loading, setLoading] = useState(false)
  const [documentList, setDocumentList] = useState([]);
  const [fileInputs, setFileInputs] = useState([]);
  const [detail, setDetail] = useState({})
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
    formData.append("storage", "investigation");
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
    if (!fileInputs.length) {
      toast.warn("File must be fill")
      return
    }
    if (loading) return

    setLoading(true)
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
      setLoading(false)
      toast.success("Documents added successfully.");
    } catch (err) {
      setLoading(false)
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

  const checkPiCalready = async (userId, invesitgasi) => {
    try {
      const { data } = await axios.get(`/investigation/pic-check-resp/${userId}/${invesitgasi}`);
      return data.data
    } catch (err) {
      return false
    }
  }



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
      setDetailInvestigation(response.data.data[0]);
      await getInvestigationDetails(id);
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
    switch (Number(id)) {
      case 1: return "🔴 TINGGI";
      case 2: return "🟡 MODERATE";
      case 3: return "🟢 RENDAH";
      default: return "🟢 RENDAH";
    }
  };

  const onClickDetail = async (item) => {
    try {
      setMode("Detail");
      setDetail(item)

      await getDataInvestigationById(item.INVS_ID);
      await getDataInvestigationResponById(item.INVS_ID);
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
        getDataInvestigationById(detailInvestigation.INVS_ID);
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
    try {
      const { data } = await axios.get(`/investigation/report/${Periode.StartDate}/${Periode.EndDate}`);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      worksheet.columns = [
        { header: "NO", key: "NO" },
        { header: "TANGGAL", key: "INVSM_SUBMIT_DATE", style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
        { header: "JATUH TEMPO", key: "INVSM_DEADLINE_DATE", style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
        { header: "PLP", key: "INVSM_TITLE" },
        { header: "ISI LAPORAN", key: "INVSM_DESCRIPTION" },
        { header: "ASAL", key: "INVSM_SOURCE" },
        { header: "AREA", key: "INVSM_AREA" },
        { header: "STATUS PENANGANAN", key: "INVSM_STATUS" },
        { header: "PIC PENANGANGAN", key: "PIC_LIST_TITLE" },
        { header: "JENIS KASUS", key: "INVSM_CASE_TYPE" },
        { header: "KETERANGAN", key: "INVSM_NOTES" },
        { header: "JUMLAH LAPORAN YANG SAMA", key: "COUNT_SAME" },
        { header: "STATUS", key: "INVS_STATUS" },
        { header: "CATATAN", key: "INVSM_NOTES2" },
        { header: "TANGGAL SELESAI", key: "INVSM_COMPLETED_DATE", style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
      ];
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }
        };
        cell.font = { bold: true };
      });
      const transformData = (row) => {
        if (row.INVSM.INVSM_SUBMIT_DATE) row.INVSM_SUBMIT_DATE = moment(row.INVSM.INVSM_SUBMIT_DATE).format("YYYY-MM-DD HH:mm:ss");
        if (row.INVSM.INVSM_DEADLINE_DATE) row.INVSM_DEADLINE_DATE = moment(row.INVSM.INVSM_DEADLINE_DATE).format("YYYY-MM-DD HH:mm:ss");
        if (row.INVSM.INVSM_COMPLETED_DATE) row.INVSM_COMPLETED_DATE = moment(row.INVSM.INVSM_COMPLETED_DATE).format("YYYY-MM-DD HH:mm:ss");
        row.INVSM_DESCRIPTION = row.INVSM.INVSM_DESCRIPTION
        row.INVSM_TITLE = row.INVSM.INVSM_TITLE
        row.INVSM_SOURCE = row.INVSM.INVSM_SOURCE
        row.INVSM_AREA = row.INVSM.INVSM_AREA
        row.INVSM_STATUS = row.INVSM.INVSM_STATUS
        row.PIC_LIST_TITLE = row.INVSM.PIC_LIST.TITLE
        row.INVSM_CASE_TYPE = row.INVSM.INVSM_CASE_TYPE
        row.INVSM_NOTES = row.INVSM.INVSM_NOTES
        row.INVSM_NOTES2 = row.INVSM.INVSM_NOTES2
        row.INVSM_COMPLETED_DATE = row.INVSM.INVSM_COMPLETED_DATE
        return row;
      };
      data.data.forEach((row) => {
        const dataa = transformData(row)
        worksheet.addRow(transformData(dataa))
      });
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Investigation-Recap.xlsx`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Investigation Not Found")

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
      INVSM_STATUS: item.INVSM_STATUS || "",
      INVSM_PIC: item.INVSM_PIC || "",
      INVSM_TITLE: item.INVSM_TITLE || "",
      INVSM_CATEGORY_ID: item.INVSM_CATEGORY_ID || "",
      INVSM_SUBCATEGORY_ID: item.INVSM_SUBCATEGORY_ID || "",
      INVSM_DESCRIPTION: item.INVSM_DESCRIPTION || "",
      INVSM_COMPLETED_DATE: item.INVSM_COMPLETED_DATE ? moment(item.INVSM_COMPLETED_DATE).format("YYYY-MM-DD") : "",
      INVSM_COMPANY: item.INVSM_COMPANY || idPerusahaan,
      INVSM_SUBMIT_BY: item.INVSM_SUBMIT_BY || userId,
      INVSM_SUBMIT_DATE: item.INVSM_SUBMIT_DATE ? moment(item.INVSM_SUBMIT_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
      INVSM_NOTES: item.INVSM_NOTES || "",
      INVSM_NOTES2: item.INVSM_NOTES2 || "",
      INVSM_CASE_TYPE: item.INVSM_CASE_TYPE || "LAIN-LAIN",
    });
    setModalAddEdit(true);
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
    // eslint-disable-next-line
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
                          <th style={{ width: "10%" }}>PELAPOR</th>
                          <th style={{ width: "20%" }}>TOPIK</th>
                          <th style={{ width: "10%" }}>STATUS</th>
                          <th style={{ width: "10%" }}>KATEGORI</th>
                          <th style={{ width: "10%" }}>SUBKATEGORI</th>
                          <th style={{ width: "10%" }}>INVESTIGATOR</th>
                          <th style={{ width: "20%" }}>TANGGAL SUBMIT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataInvestigation.map((item, idx) => (
                          <tr key={idx} onDoubleClick={() => onClickDetail(item)}>
                            <td className="py-3" style={{ width: "10%" }}>{SignPriorityCat(item.PRIORITY)}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.INVSM_INFORMANT}</td>
                            <td className="py-3" style={{ width: "20%" }}>{item.INVSM_TITLE}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.INVS_STATUS}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.CATEGORY}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.SUBCATEGORY}</td>
                            <td className="py-3" style={{ width: "10%" }}>{item.TITLE_PIC}</td>
                            <td className="py-3" style={{ width: "20%" }}>{moment(item.INVS_CREATE_DATE).format("YYYY-MM-DD HH:mm:ss")}</td>
                            <td className="py-3" style={{ width: "5%" }}>
                              {
                                item.INVS_STATUS !== "COMPLETE" &&

                                <Button variant="warning" size="sm" onClick={() => handleEdit(item)} className="me-2">
                                  <FaEdit />
                                </Button>
                              }
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
                <Card.Body className="mt-4">
                  <Row className="g-4">
                    <Col md={4}>
                      <Card className="shadow-sm border-0 rounded-4 futuristic-card">
                        <Card.Body>
                          <h6 className="text-secondary fw-semibold">ID</h6>
                          <p className="mb-3 text-monospace">{detail.INVSM_ID}</p>

                          <h6 className="text-secondary fw-semibold">Judul</h6>
                          <p className="mb-3">{detail.INVSM_TITLE}</p>

                          <h6 className="text-secondary fw-semibold">Status</h6>
                          <Badge bg={detail.INVSM_STATUS === "Open" ? "success" : "secondary"} className="mb-3 px-3 py-2 rounded-pill">
                            {detail.INVSM_STATUS}
                          </Badge>

                          <h6 className="text-secondary fw-semibold">Tanggal Dibuat</h6>
                          <p className="mb-3">{moment(detail.INVS_CREATE_DATE).format("DD/MMM/YYYY HH:mm:ss")}</p>

                          <h6 className="text-secondary fw-semibold">Tanggal Kejadian</h6>
                          <p className="mb-0">{detail.INVSM_DATE}</p>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="shadow-sm border-0 rounded-4 futuristic-card">
                        <Card.Body>
                          <h6 className="text-secondary fw-semibold">Tanggal Jatuh Tempo</h6>
                          <p className="mb-3">{detail.INVSM_DEADLINE_DATE}</p>

                          <h6 className="text-secondary fw-semibold">Tanggal Selesai</h6>
                          <p className="mb-3">{detail.INVSM_COMPLETED_DATE}</p>

                          <h6 className="text-secondary fw-semibold">Reporter</h6>
                          <p className="mb-3">{detail.TITLE_PIC}</p>

                          <h6 className="text-secondary fw-semibold">Pelapor</h6>
                          <p className="mb-3">{detail.INVSM_INFORMANT}</p>

                          <h6 className="text-secondary fw-semibold">Jenis Aduan</h6>
                          <p className="mb-0">{detail.INVSM_SOURCE} - {detail.SUBCATEGORY}</p>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="shadow-sm border-0 rounded-4 futuristic-card">
                        <Card.Body>
                          <h6 className="text-secondary fw-semibold">Kategori</h6>
                          <p className="mb-3">{detail.CATEGORY}</p>

                          <h6 className="text-secondary fw-semibold">Tipe Kasus</h6>
                          <p className="mb-3">{detail.INVSM_CASE_TYPE}</p>

                          <h6 className="text-secondary fw-semibold">Area</h6>
                          <p className="mb-3">{detail.INVSM_AREA}</p>

                          <h6 className="text-secondary fw-semibold">Prioritas</h6>
                          <Badge bg={detail.PRIORITY === 1 ? "danger" : "warning"} className="mb-3 px-3 py-2 rounded-pill">
                            {SignPriorityCat(detail.PRIORITY)}
                          </Badge>

                          <h6 className="text-secondary fw-semibold">Durasi Proses</h6>
                          <p className="mb-0">{detail.PROCESS_TIME} jam</p>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={12}>
                      <Card className="shadow-sm border-0 rounded-4 futuristic-card">
                        <Card.Body>
                          <h6 className="text-secondary fw-semibold">Dibuat Oleh</h6>
                          <p className="mb-3">{detail.INVS_CREATE_NAME}</p>

                          <h6 className="text-secondary fw-semibold">Diperbarui Oleh</h6>
                          <p className="mb-3">{detail.INVS_UPDATE_NAME}</p>

                          <h6 className="text-secondary fw-semibold">Keterangan</h6>
                          <p className="mb-0">{detail.INVSM_NOTES}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Card>
                        <Card.Header as="h6">Deskripsi Laporan</Card.Header>
                        <Card.Body>
                          <p className="mb-0">{detail.INVSM_DESCRIPTION}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
                <br />
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
              <Card.Body className="align-items-center" >
                <Row>
                  <Col sm={12} className="mt-3">
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "bold", width: "50%" }}>KATEGORI</div>
                        <div style={{ fontWeight: "bold", width: "50%" }}>: {detailInvestigation.CATEGORY}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "bold", width: "50%" }}>SUB KATEGORI</div>
                        <div style={{ fontWeight: "bold", width: "50%" }}>: {detailInvestigation.SUBCATEGORY}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "bold", width: "50%" }}>STATUS INVESTIGASI</div>
                        <div style={{ fontWeight: "bold", width: "50%" }}>: {detailInvestigation.INVS_STATUS}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "bold", width: "50%" }}>PRIORITAS</div>
                        <div style={{ fontWeight: "bold", width: "50%" }}>: {SignPriorityCat(detailInvestigation.GRV_PRIORITY)}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "bold", width: "50%" }}>BATAS WAKTU RESPON</div>
                        <div style={{ fontWeight: "bold", width: "50%" }}>: {moment(detailInvestigation.GRV_DEADLINE_PROCESS).format("DD-MM-YYYY HH:mm:ss")}</div>
                      </div>
                      {detailInvestigation.INVS_STATUS === "COMPLETE" && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight: "bold", width: "50%" }}>DITUTUP OLEH / WAKTU</div>
                          <div style={{ fontWeight: "bold", width: "50%" }}>: {detailInvestigation.INVS_UPDATE_NAME} / {moment(detailInvestigation.INVS_UPDATE_DATE).format("DD-MM-YYYY HH:mm:ss")}</div>
                        </div>
                      )}
                    </div>
                    {detailInvestigation.INVS_STATUS !== "COMPLETE" && (
                      <div className="d-grid gap-2 mt-4"><Button variant="primary" onClick={() => setModalCloseInvestigation(true)}>TUTUP INVESTIGASI</Button></div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
              <hr />
              <Card.Body>
                <h6 className="mb-3">Documents</h6>
                <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "4px", padding: "10px" }}>
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
                <br />
                {detailInvestigation.INVS_STATUS !== 'COMPLETE' &&
                  <Form.Group>
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
                      {
                        loading ? <div className="loading-overlay">
                          <Spinner animation="border" size="sm" /> Uploading
                        </div> : <>
                          <FaUpload /> Upload
                        </>
                      }
                    </Button>
                  </Form.Group>
                }
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
              <Col md={6} className="mt-2">
                <Form.Label>PLP</Form.Label>
                <Form.Control type="text" name="INVSM_INFORMANT" value={InvsManual.INVSM_INFORMANT || ""} onChange={ocInvsManual} required />
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Judul</Form.Label>
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
              <Col md={6} className="mt-2">
                <Form.Label>PIC Penanganan</Form.Label>
                <Form.Select name="INVSM_PIC" value={InvsManual.INVSM_PIC || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih PIC</option>
                  {ListPIC.map((pic, index) => (
                    <option key={index} value={pic.ID}>{pic.TITLE}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Status Penanganan </Form.Label>
                <Form.Select name="INVSM_STATUS" value={InvsManual.INVSM_STATUS || ""} onChange={ocInvsManual} required>
                  <option value="">Pilih Status</option>
                  <option value="DITERIMA">Diterima</option>
                  <option value="DI_TOLAK">Di Tolak</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Isi Laporan</Form.Label>
                <Form.Control as="textarea" rows={3} name="INVSM_DESCRIPTION" value={InvsManual.INVSM_DESCRIPTION || ""} onChange={ocInvsManual} />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control as="textarea" rows={3} name="INVSM_NOTES" value={InvsManual.INVSM_NOTES || ""} onChange={ocInvsManual} />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Catatan</Form.Label>
                <Form.Control as="textarea" rows={3} name="INVSM_NOTES2" value={InvsManual.INVSM_NOTES2 || ""} onChange={ocInvsManual} />
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