import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Form, Modal, Button } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";
import { Link, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import { FaFileExcel } from "react-icons/fa6";
import { AuthContext } from "../auth/AuthProvider.js";
import { toast } from "react-toastify"; // Pastikan toast diimpor jika digunakan

const GrievanceMain = () => {
  const navigate = useNavigate();
  const { value } = useContext(AuthContext);
  const { userId } = value;
  const IDCompany = value.idPerusahaan;

  const [Periode, setPeriode] = useState({
    StartDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
    EndDate: moment().format("YYYY-MM-DD"),
  });
  const [dataGrievance, setDataGrievance] = useState([]);
  const [accessGrievance, setAccessGrievance] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [ModalInfoSender, setModalInfoSender] = useState(false);
  const [DataSender, setDataSender] = useState({});
  const [loading, setLoading] = useState(false);

  const getDataGrievance = async (company, start, end) => {
    setLoading(true);
    try {
      const response = await axios.get(`/grievance/list/${company}/${start}/${end}`);
      if (response.status === 200) {
        setDataGrievance(response.data.data);
      } else {
        setDataGrievance([]);
        toast.error("Failed to fetch grievance data", { autoClose: 2000 });
      }
    } catch (err) {
      console.log(err);
      setDataGrievance([]);
      toast.error("Error fetching grievance data", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const getGrievanceAccess = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/grievance/access/${userId}`);
      if (response.status === 200) {
        setAccessGrievance(response.data.data);
      } else {
        setAccessGrievance([]);
        toast.error("Failed to fetch access data", { autoClose: 2000 });
      }
    } catch (err) {
      console.log(err);
      setAccessGrievance([]);
      toast.error("Error fetching access data", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const onDeleteGrv = async (id) => {
    setLoading(true);
    try {
      const tryDelete = await axios.put(`/mobile/grievance/delete`, {
        dataDelete: {
          GRV_DELETE_BY: `${userId}`,
          GRV_ID: `${id}`,
          GRV_COMPANY: IDCompany, // Menambahkan konteks perusahaan
        },
      });
      if (tryDelete.status === 200) {
        toast.success("Grievance deleted successfully", { autoClose: 2000 });
        await getDataGrievance(IDCompany, Periode.StartDate, Periode.EndDate);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete grievance", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const selectPeriode = async (event) => {
    const { name, value } = event.target;
    const updatedPeriode = { ...Periode, [name]: value };
    setPeriode(updatedPeriode);
    await getDataGrievance(IDCompany, updatedPeriode.StartDate, updatedPeriode.EndDate);
  };

  const SignPriorityCat = (id) => {
    switch (id) {
      case 1:
        return "🔴 TINGGI";
      case 2:
        return "🟡 MODERATE";
      case 3:
        return "🟢 RENDAH";
      default:
        return "🟢 RENDAH";
    }
  };

  const actionList = (id) => {
    return [
      { actionLable: "Detail", actExe: () => navigate(`/grievance-response?id=${id}`) },
      { actionLable: "Hapus", actExe: () => onDeleteGrv(id) },
    ];
  };

  const OpenModalSender = async (event, id) => {
    event.preventDefault();
    setLoading(true);
    try {
      const selectedGrv = dataGrievance.filter((item) => item.GRV_ID === id);
      if (selectedGrv.length > 0) {
        const checkID = await axios.get(
          `/employee/emp-check-id/${selectedGrv[0].GRV_COMPANY}/${selectedGrv[0].GRV_SUBMIT_BY}`
        );
        setDataSender(checkID.data.data || {});
      }
    } catch (err) {
      console.log(err);
      setDataSender({});
      toast.error("Failed to fetch sender info", { autoClose: 2000 });
    } finally {
      setLoading(false);
      setModalInfoSender(true);
    }
  };

  const exportXLSSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/grievance/recap/${IDCompany}/${Periode.StartDate}/${Periode.EndDate}`
      );
      if (response.status === 200) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");
        worksheet.columns = [
          { header: "Grievance Status", key: "GRIEVANCE_STATUS", width: 20 },
          { header: "Grievance Date", key: "GRIEVANCE_DATE", width: 20, style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
          { header: "Grievance Submit By", key: "GRIEVANCE_SUBMIT_BY", width: 25 },
          { header: "Grievance Category", key: "GRIEVANCE_CATEGORY", width: 25 },
          { header: "Grievance Subcategory", key: "GRIEVANCE_SUBCATEGORY", width: 25 },
          { header: "Grievance Title", key: "GRIEVANCE_TITLE", width: 30 },
          { header: "Grievance Description", key: "GRIEVANCE_DESCRIPTION", width: 40 },
          { header: "Grievance Response", key: "GRIEVANCE_RESPONSE", width: 40 },
          { header: "Grievance Response By", key: "GRIEVANCE_RESPONSE_BY", width: 20 },
          { header: "Grievance Response Date", key: "GRIEVANCE_RESPONSE_DATE", width: 20, style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
          { header: "Grievance Close By", key: "GRIEVANCE_CLOSE_BY", width: 20 },
          { header: "Grievance Close Date", key: "GRIEVANCE_CLOSE_DATE", width: 20, style: { numFmt: "dd-mm-yyyy hh:mm:ss" } },
        ];
        const transformData = (row) => {
          if (row.GRIEVANCE_DATE) row.GRIEVANCE_DATE = moment(row.GRIEVANCE_DATE).format("YYYY-MM-DD HH:mm:ss");
          if (row.GRIEVANCE_RESPONSE_DATE) row.GRIEVANCE_RESPONSE_DATE = moment(row.GRIEVANCE_RESPONSE_DATE).format("YYYY-MM-DD HH:mm:ss");
          if (row.GRIEVANCE_CLOSE_DATE) row.GRIEVANCE_CLOSE_DATE = moment(row.GRIEVANCE_CLOSE_DATE).format("YYYY-MM-DD HH:mm:ss");
          return row;
        };

        response.data.data.forEach((row) => {
          worksheet.addRow(transformData(row));
        });
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Grievance-Recap_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to export XLS", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const InitDataGrievance = async () => {
      setLoading(true);
      try {
        const start = moment().subtract(7, "days").format("YYYY-MM-DD");
        const end = moment().format("YYYY-MM-DD");
        setPeriode({ StartDate: start, EndDate: end });
        await getDataGrievance(IDCompany, start, end);
        await getGrievanceAccess();
      } catch (err) {
        console.log(err);
        toast.error("Error initializing data", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };
    InitDataGrievance();
  }, [IDCompany, userId]);

  // Convert permission subcategory IDs to string for comparison
  const allowedSubcategoryIds = accessGrievance.map((p) => String(p.ID_SUBCATEGORY));

  // Filter grievances that match allowed subcategory IDs
  const filteredGrievances = dataGrievance.filter((g) =>
    allowedSubcategoryIds.includes(g.GRV_SUBCATEGORY_ID)
  );

  return (
    <>
      <Row className="mx-0 mt-3">
        <Col className="ps-3 p-2">
          <Card className="border-0">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formStartDate">
                      <Form.Control
                        size="sm"
                        type="date"
                        value={Periode.StartDate}
                        name="StartDate"
                        onChange={selectPeriode}
                      />
                    </Form.Group>
                  </Col>
                  <Col>-</Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formEndDate">
                      <Form.Control
                        size="sm"
                        type="date"
                        value={Periode.EndDate}
                        name="EndDate"
                        onChange={selectPeriode}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <div>
                <Button size="sm" variant="success" onClick={exportXLSSummary} disabled={loading}>
                  <FaFileExcel /> Download XLS
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="text rounded shadow-sm">
              <Row>
                <Col sm={12}>
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <Table hover size="sm">
                      <thead>
                        <tr>
                          <th style={{ width: "10%" }}>PRIORITAS</th>
                          <th style={{ width: "10%" }}>STATUS</th>
                          <th style={{ width: "10%" }}>TANGGAL POSTING</th>
                          <th style={{ width: "10%" }}>PENGIRIM</th>
                          <th style={{ width: "20%" }}>TOPIK</th>
                          <th style={{ width: "10%" }}>KATEGORI</th>
                          <th style={{ width: "10%" }}>SUBKATEGORI</th>
                          <th style={{ width: "10%" }}>BATAS WAKTU PROSES</th>
                          <th>OPSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGrievances && filteredGrievances.map((item, index) => (
                          <tr
                            key={index}
                            onDoubleClick={() => navigate(`/grievance-response?id=${item.GRV_ID}`)}
                          >
                            <td className="py-3" style={{ width: "10%" }}>
                              {SignPriorityCat(item.GRV_PRIORITY)}
                            </td>
                            <td className="py-3" style={{ width: "10%" }}>
                              {item.GRV_STATUS}
                            </td>
                            <td className="py-3" style={{ width: "10%" }}>
                              {moment(item.GRV_SUBMIT_DATE).format("YYYY-MM-DD HH:mm:ss")}
                            </td>
                            <td className="py-3" style={{ width: "10%" }}>
                              {item.GRV_SUBMIT_NAME === "ANONYM"
                                ? item.GRV_SUBMIT_NAME
                                : (
                                  <Link
                                    to="#"
                                    onClick={(e) => OpenModalSender(e, item.GRV_ID)}
                                  >
                                    {item.GRV_SUBMIT_NAME}
                                  </Link>
                                )}
                            </td>
                            <td className="py-3" style={{ width: "20%" }}>
                              {item.GRV_TITLE}
                            </td>
                            <td className="py-3" style={{ width: "10%" }}>
                              {item.GRV_CATEGORY_NAME}
                            </td>
                            <td className="py-3" style={{ width: "10%" }}>
                              {item.GRV_SUBCATEGORY_NAME}
                            </td>
                            <td className="py-3" style={{ width: "10%" }}>
                              {moment(item.GRV_DEADLINE_PROCESS).format("YYYY-MM-DD HH:mm:ss")}
                            </td>
                            <td className="py-3">
                              <NewDropDown
                                label={"Opsi"}
                                dropdownId={`dropdown${index}`}
                                items={actionList(item.GRV_ID)}
                                activeDropdown={activeDropdown}
                                setActiveDropdown={setActiveDropdown}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={ModalInfoSender} size="sm" onHide={() => setModalInfoSender(false)}>
        <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
          <Modal.Title>Info Pengirim</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-4">
          <Row>
            <Col lg={12} className="mb-3">
              <Table>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>: {DataSender.EMP_ID || "-"}</td>
                  </tr>
                  <tr>
                    <td>Nama Lengkap</td>
                    <td>: {DataSender.EMP_FULL_NAME || "-"}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>: {DataSender.EMP_GENDER === "M" ? "Laki-Laki" : DataSender.EMP_GENDER === "F" ? "Perempuan" : "-"}</td>
                  </tr>
                  <tr>
                    <td>Tanggal Masuk</td>
                    <td>: {DataSender.EMP_ONBOARDING_DATE ? moment(DataSender.EMP_ONBOARDING_DATE).format("DD-MM-YYYY") : "-"}</td>
                  </tr>
                  <tr>
                    <td>DEPARTEMEN</td>
                    <td>: {DataSender.EMP_DEPARTMENT || "-"}</td>
                  </tr>
                  <tr>
                    <td>Jabatan</td>
                    <td>: {DataSender.EMP_JOB_TITLE || "-"}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GrievanceMain;