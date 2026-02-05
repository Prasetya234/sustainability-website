//import axios from "../axios/axios.js";
import moment from "moment";
import axios from "../axios/axios";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Modal, Form, Pagination } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaUpload, FaSave } from "react-icons/fa";

// excel template untuk PSG
import PSGTemplatePayslip from "../assets/excel/PSG_template-payslip.xlsx";
// excel template untuk BAI
import BAITemplatePayslip from "../assets/excel/BAI_template-payslip.xlsx";

import * as XLSX from "xlsx";
import { convertDecimal4, formatAccountingIDR } from "../component/utils/AccountingCurrency";
import { AuthContext } from "../auth/AuthProvider";
import { formatRupiah } from "../component/utils/Utils";


const PortalPayslip = () => {
    const { value } = useContext(AuthContext)
    const [ListPayslip, setListPayslip] = useState([]);
    const [ListPerusahaan, setListPerusahaan] = useState([]);
    const [SelectPerusahaan, setSelectPerusahaan] = useState('');
    const [FilterPayslip, setFilterPayslip] = useState({ Year: moment().format('YYYY'), Month: moment().format('M') });
    const [ModalManualPayslip, setModalManualPayslip] = useState(false);
    const [ModalImportBatch, setModalImportBatch] = useState(false);
    const [ModalDetailPayslip, setModalDetailPayslip] = useState(false);
    const [ModalDelPayslip, setModalDelPayslip] = useState(false);
    const [DetailPayslip, setDetailPayslip] = useState({});
    const [DataPayslipManual, setDataPayslipManual] = useState({
        Year: 0,
        Month: 0,
        EmpCompanyID: "",
        EmpID: "",
        BasicSalary: 0,
        ProrateSalary: 0,
        GradingAllowance: 0,
        WorkLengthAllowance: 0,
        JobTitleAllowance: 0,
        NonFixedAllowance: 0,
        SkillAllowance: 0,
        TotalWorkingkDay: 0,
        TotalWorkingHour: 0,
        TotalOT1: 0,
        TotalOT2: 0,
        TotalOTHoliday: 0,
        ValueOT1: 0,
        ValueOT2: 0,
        ValueOTHoliday: 0,
        AttendancePremi: 0,
        EatingAllowance: 0,
        MenstrualAllowance: 0,
        TransportAllowance: 0,
        TargetReward: 0,
        ShiftAllowance: 0,
        PENGEMBALIAN_PPH: 0,
        POTONG_BERANGKAT_SIANG: 0,
        POTONG_PULANG_AWAL: 0,
        UANG_LEMBUR: 0,
        POTONGAN_LAIN_LAIN: 0,
        Absentee: 0,
        UnionCost: 0,
        Jamsostek: 0,
        GrossSalary: 0,
        DeductionCost: 0,
        NetSalary: 0,
        CreateBy: value.userId
    });
    const [DataPayslipMultiple, setDataPayslipMultiple] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limitPage = 25;
    const IDCompany = value.idPerusahaan;

    const getListCompany = async () => {
        const response = await axios.get('/perusahaan');
        if (response.status === 200) {
            setListPerusahaan(response.data.data);
        }
    }

    const getDataPaySlip = async (company, page, limit, year, month) => {
        const companyID = company ? company : 'all';
        const getData = await axios.get(`/personal/payslip?company=${companyID}&page=${page}&limit=${limit}&year=${year}&month=${parseInt(month)}`);
        if (getData.status === 200) {
            if ((getData.data.data).length > 0) {
                setListPayslip(getData.data.data);
                setTotalPages(getData.data.totalPages);
                setCurrentPage(page);
            } else {
                setListPayslip([]);
            }
        } else {
            toast.danger('Cannot Load Payslip Data');
        }
    }

    const getDataPaySlipSearch = async (company, page, limit, year, month, search) => {
        const companyID = company ? company : 'all';
        const getData = await axios.get(`/personal/payslip-search?company=${companyID}&page=${page}&limit=${limit}&year=${year}&month=${parseInt(month)}&search=${encodeURIComponent(search)}`);
        if (getData.status === 200) {
            if ((getData.data.data).length > 0) {
                setListPayslip(getData.data.data);
                setTotalPages(getData.data.totalPages);
                setCurrentPage(page);
            } else {
                setListPayslip([]);
            }
        } else {
            toast.danger('Cannot Load Payslip Data');
        }
    }


    const OpenModalManualPayslip = () => {
        setModalManualPayslip(true);
    }

    const OpenModalImportBatch = () => {
        setModalImportBatch(true);
    }

    const OpenModalDeletePayslip = () => {
        setModalDelPayslip(true);
    }

    const CloseModalManualPayslip = () => {
        setModalManualPayslip(false);
        setDataPayslipManual({});
    }

    const CloseModalImportBatch = () => {
        setModalImportBatch(false);
        setDataPayslipMultiple([]);
    }

    const CloseModalDetailPayslip = () => {
        setModalDetailPayslip(false);
        setDetailPayslip({});
    }


    const ocFilterYearMonth = async (event) => {
        const { name, value } = event.target;
        if (name === 'FilterYear') {
            setFilterPayslip((prevData) => ({
                ...prevData,
                Year: value,
            }));
            await getDataPaySlip(IDCompany, currentPage, limitPage, value, FilterPayslip.Month);
        }

        if (name === 'FilterMonth') {
            setFilterPayslip((prevData) => ({
                ...prevData,
                Month: value,
            }));
            getDataPaySlip(IDCompany, currentPage, limitPage, FilterPayslip.Year, value);
        }
    }

    const ocSelectPerusahaan = async (event) => {
        const { value } = event.target;
        setSelectPerusahaan(value);
    }

    const ocPayslipManual = async (event) => {
        const { name, value } = event.target;
        if (name === "EmpID") {
            if (value.length > 4) {
                const getEmpData = await axios.get(`/employee/emp-check-id/${SelectPerusahaan}/${value}`);
                if (getEmpData.status === 200 && getEmpData.data.exist === true) {
                    setDataPayslipManual((prevData) => ({
                        ...prevData,
                        EmpCompany: IDCompany,
                        EmpName: getEmpData.data.data.EMP_FULL_NAME,
                        EmpDept: getEmpData.data.data.EMP_DEPARTMENT,
                        EmpJobTitle: getEmpData.data.data.EMP_JOB_TITLE
                    }));
                } else {
                    console.log(`emp not found`);
                }
            }
        }

        const calcGrossSalary = convertDecimal4(DataPayslipManual.ProrateSalary)
            + convertDecimal4(DataPayslipManual.GradingAllowance)
            + convertDecimal4(DataPayslipManual.WorkLengthAllowance)
            + convertDecimal4(DataPayslipManual.JobTitleAllowance)
            + convertDecimal4(DataPayslipManual.NonFixedAllowance)
            + convertDecimal4(DataPayslipManual.SkillAllowance)
            + convertDecimal4(DataPayslipManual.ValueOT1)
            + convertDecimal4(DataPayslipManual.ValueOT2)
            + convertDecimal4(DataPayslipManual.ValueOTHoliday)
            + convertDecimal4(DataPayslipManual.AttendancePremi)
            + convertDecimal4(DataPayslipManual.EatingAllowance)
            + convertDecimal4(DataPayslipManual.MenstrualAllowance)
            + convertDecimal4(DataPayslipManual.TransportAllowance)
            + convertDecimal4(DataPayslipManual.TargetReward)
            + convertDecimal4(DataPayslipManual.ShiftAllowance) + convertDecimal4(DataPayslipManual.ShiftAllowance) + convertDecimal4(DataPayslipManual.PENGEMBALIAN_PPH) + convertDecimal4(DataPayslipManual?.UANG_LEMBUR || 0);
        const calcDeductionCost = convertDecimal4(DataPayslipManual.Absentee) + convertDecimal4(DataPayslipManual.UnionCost) + convertDecimal4(DataPayslipManual.Jamsostek) + convertDecimal4(DataPayslipManual.POTONG_BERANGKAT_SIANG) + convertDecimal4(DataPayslipManual.POTONG_PULANG_AWAL) + convertDecimal4(DataPayslipManual?.POTONGAN_LAIN_LAIN || 0);
        const calcNetSalary = convertDecimal4(calcGrossSalary) - convertDecimal4(calcDeductionCost);

        setDataPayslipManual((prevData) => ({
            ...prevData,
            [name]: value,
            GrossSalary: calcGrossSalary,
            DeductionCost: calcDeductionCost,
            NetSalary: calcNetSalary,
        }));
    }

    const getDetailPayslip = async (id) => {
        const getData = await axios.get(`/personal/payslip-by-id/${id}`);
        if (getData.status === 200) {
            setModalDetailPayslip(true);
            setDetailPayslip(getData.data.data[0]);
        }
    }

    const deletePayslip = async (id) => {
        const getData = await axios.delete(`/personal/payslip/${id}`);
        if (getData.status === 200) {
            setModalDetailPayslip(false);
            setModalDelPayslip(false);
            setDetailPayslip({});
            toast.success(getData.data.message);
        }
    }


    const handleUploadXLSXEmp = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Read data as an array of arrays
                const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (rawData.length > 1) {
                    const headers = rawData[0]; // First row as keys
                    const values = rawData.slice(1); // Rest as data

                    // Convert array into array of objects
                    const formattedData = values.map((row) => {
                        let obj = {};
                        headers.forEach((key, index) => {
                            obj[key] = row[index] || ""; // Assign each value to corresponding key
                        });
                        return obj;
                    });


                    setDataPayslipMultiple(formattedData);
                }
            };
            reader.readAsBinaryString(file);
        }
    };

    const submitPayslipManual = async (event) => {
        event.preventDefault();
        const postEmp = await axios.post('/personal/payslip-new', { dataPayslip: DataPayslipManual });
        if (postEmp.status === 200) {
            setDataPayslipManual({
                Year: 0,
                Month: 0,
                EmpCompany: IDCompany,
                EmpID: "",
                BasicSalary: 0,
                ProrateSalary: 0,
                GradingAllowance: 0,
                WorkLengthAllowance: 0,
                JobTitleAllowance: 0,
                NonFixedAllowance: 0,
                SkillAllowance: 0,
                TotalWorkingkDay: 0,
                TotalWorkingHour: 0,
                TotalOT1: 0,
                TotalOT2: 0,
                TotalOTHoliday: 0,
                ValueOT1: 0,
                ValueOT2: 0,
                ValueOTHoliday: 0,
                AttendancePremi: 0,
                EatingAllowance: 0,
                MenstrualAllowance: 0,
                TransportAllowance: 0,
                TargetReward: 0,
                ShiftAllowance: 0,
                PENGEMBALIAN_PPH: 0,
                POTONG_BERANGKAT_SIANG: 0,
                POTONG_PULANG_AWAL: 0,
                UANG_LEMBUR: 0,
                POTONGAN_LAIN_LAIN: 0,
                Absentee: 0,
                UnionCost: 0,
                Jamsostek: 0,
                GrossSalary: 0,
                DeductionCost: 0,
                NetSalary: 0,
                CreateBy: value.userId
            });
            toast.success(postEmp.data.message);
            CloseModalManualPayslip();
        } else {
            toast.warning('Fail to add employee');
        }
    }



    const submitPayslipMass = async (event) => {
        event.preventDefault();
        const postEmp = await axios.post(`/personal/payslip-new-mass/${IDCompany}`, { listPayslip: DataPayslipMultiple });
        if (postEmp.status === 200) {
            toast.success('Success upload payslip data');
            CloseModalImportBatch();
            getDataPaySlip(value.idPerusahaan, currentPage, limitPage, FilterPayslip.Year, FilterPayslip.Month);
        } else {
            toast.warning('payslip data upload failed, please check file.');
        }
    }

    const searchEmp = async (event) => {
        const { value } = event.target;
        if (value.length > 3) {
            //const EmpCompany = value.idPerusahaan ? value.idPerusahaan : "all";
            await getDataPaySlipSearch(IDCompany, 1, limitPage, FilterPayslip.Year, FilterPayslip.Month, value);
        } else {
            await getDataPaySlip(IDCompany, currentPage, limitPage, FilterPayslip.Year, FilterPayslip.Month);
        }
    }



    useEffect(() => {
        setSelectPerusahaan(IDCompany);
        getDataPaySlip(IDCompany, currentPage, limitPage, FilterPayslip.Year, FilterPayslip.Month);
        getListCompany();
    }, [IDCompany, FilterPayslip.Year, FilterPayslip.Month, currentPage]);

    const pageNumbers = [];

    // Define range (-5 to +5 of the current page)
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, currentPage + 3);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => setCurrentPage(i)}
            >
                {i}
            </Pagination.Item>
        );
    }


    return (
        <>
            <Row className="mx-0 mt-3">
                <Col sm={12} className="ps-3 p-2">
                    <Card className="border-0 ">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div>
                                <Button variant={"primary"} size="sm" onClick={OpenModalManualPayslip}><FaPlus /> ADD </Button>&nbsp; &nbsp;
                                <Button variant={"success"} size="sm" onClick={OpenModalImportBatch}><FaFileImport /> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                                <Button variant={"danger"} size="sm" ><FaTrash /> DELETE IN BATCH </Button>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="form-control w-auto"
                                    onChange={searchEmp}
                                />
                            </div>
                        </Card.Header>
                        <Card.Body className="text rounded shadow-sm">
                            <Row>
                                <Col sm={6} md={2} lg={1}>
                                    <Form.Label>Year</Form.Label>
                                    <Form.Select size="sm" defaultValue={FilterPayslip.Year} name="FilterYear" onChange={ocFilterYearMonth}>
                                        <option value={""} disabled selected>Select Year</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                    </Form.Select>
                                </Col>
                                <Col sm={6} md={2} lg={2}>
                                    <Form.Label>Month</Form.Label>
                                    <Form.Select size="sm" defaultValue={FilterPayslip.Month} name="FilterMonth" onChange={ocFilterYearMonth}>
                                        <option value={""} disabled selected>Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </Form.Select>
                                </Col>
                                <Col sm={0} md={8} lg={9}>

                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <br />
                                    <Table striped hover responsive>
                                        <thead className="text-center">
                                            <tr className="text-center">
                                                <th>COMPANY</th>
                                                <th>Year</th>
                                                <th>Month</th>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Departemen</th>
                                                <th>Job Title</th>
                                                <th>Status</th>
                                                <th>Onboarding Date</th>
                                                <th>Resign Date</th>
                                                <th>Basic Salary</th>
                                                <th>Gross Salary</th>
                                                <th>Net Salary</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ListPayslip && ListPayslip.map((item, index) => (
                                                <tr key={index} onDoubleClick={() => getDetailPayslip(item.ID)}>
                                                    <td>{item.EMP_COMPANY}</td>
                                                    <td>{item.Year}</td>
                                                    <td>{moment().month(item.Month - 1).format("MMMM")}</td>
                                                    <td>{item.Emp_ID}</td>
                                                    <td>{item.Emp_FullName}</td>
                                                    <td>{item.Emp_Department}</td>
                                                    <td>{item.Emp_Jobtitle}</td>
                                                    <td className="text-center">{item.Emp_Status}</td>
                                                    <td className="text-center">{item.Emp_OnboardingDate}</td>
                                                    <td className="text-center">{item.Emp_ResignDate}</td>
                                                    <td className="text-center">{formatAccountingIDR(item.Basic_Salary)}</td>
                                                    <td className="text-center">{formatAccountingIDR(item.Gross_Salary)}</td>
                                                    <td className="text-center">{formatAccountingIDR(item.Net_Salary)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col>
                                    <Pagination>
                                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                                        {pageNumbers}

                                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                    <br />

                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                </Col>
            </Row>

            <Modal show={ModalImportBatch} size="md" onHide={CloseModalImportBatch}>
                <Form>
                    <Modal.Header className="bg-success text-mute bg-opacity-50" closeButton>
                        <Modal.Title>Payslip Import</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <a href={IDCompany === 'PSG' ? PSGTemplatePayslip : BAITemplatePayslip} download>Download Template Excel</a>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Form.Label>Upload File</Form.Label>
                                <Form.Control type="file" name="EmpImportFile" onChange={handleUploadXLSXEmp} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="success" size="sm" onClick={submitPayslipMass} disabled={DataPayslipMultiple.length === 0 ? true : false}><FaUpload /> Upload</Button>
                    </Modal.Footer>
                </Form>
            </Modal>


            <Modal show={ModalManualPayslip} size="xl" onHide={CloseModalManualPayslip}>
                <Form onSubmit={submitPayslipManual}>
                    <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                        <Modal.Title>Add New Payslip</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mx-2">
                        <Row>
                            <Col sm={6} md={4} lg={3}>
                                <Form.Label>Year</Form.Label>
                                <Form.Select size="sm" name="Year" onChange={ocPayslipManual} required={true}>
                                    <option value={""} disabled selected>Select Year</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </Form.Select>
                            </Col>
                            <Col sm={6} md={4} lg={3}>
                                <Form.Label>Month</Form.Label>
                                <Form.Select size="sm" name="Month" onChange={ocPayslipManual} required={true}>
                                    <option value={""} disabled selected>Select Month</option>
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="4">April</option>
                                    <option value="5">May</option>
                                    <option value="6">June</option>
                                    <option value="7">July</option>
                                    <option value="8">August</option>
                                    <option value="9">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </Form.Select>
                            </Col>
                            {IDCompany === null && (
                                <Col sm={6} md={6} lg={6}>
                                    <Form.Group className="mb-3" controlId="formCompanyID">
                                        <Form.Label>Company ID</Form.Label>
                                        <Form.Select name="EmpCompanyID" onChange={ocSelectPerusahaan} required={true}>
                                            <option value={""} disabled selected>Select Company</option>
                                            {ListPerusahaan && ListPerusahaan.map((item) => (
                                                <option value={item.ID_PERUSAHAAN}>{item.NAMA_PERUSAHAAN}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            )}

                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Employee ID</Form.Label>
                                    <Form.Control type="text" name="EmpID" onChange={ocPayslipManual} required={true} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Employee Name</Form.Label>
                                    <Form.Control type="text" name="EmpName" value={DataPayslipManual.EmpName} onChange={ocPayslipManual} disabled={true} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Employee Departmen</Form.Label>
                                    <Form.Control type="text" name="EmpDept" value={DataPayslipManual.EmpDept} onChange={ocPayslipManual} disabled={true} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Employee Job Title</Form.Label>
                                    <Form.Control type="text" name="EmpJobTitle" value={DataPayslipManual.EmpJobTitle} onChange={ocPayslipManual} disabled={true} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Employee Status</Form.Label>
                                    <Form.Control type="text" name="EmpStatus" value={DataPayslipManual.EmpStatus} onChange={ocPayslipManual} required={true} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <hr />
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <h5>Salary, Allowance & Reward</h5>
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Basic Salary</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="BasicSalary" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Prorate Salary</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="ProrateSalary" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Grading Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="GradingAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Work Length Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="WorkLengthAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Job Title Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="JobTitleAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Non-Fixed Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="NonFixedAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Skill Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="SkillAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Total Working Day</Form.Label>
                                    <Form.Control type="number" name="TotalWorkingkDay" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Total Working Hour</Form.Label>
                                    <Form.Control type="number" name="TotalWorkingHour" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Total OT 1</Form.Label>
                                    <Form.Control type="number" name="TotalOT1" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Total OT 2</Form.Label>
                                    <Form.Control type="number" name="TotalOT2" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Total OT Holiday</Form.Label>
                                    <Form.Control type="number" name="TotalOTHoliday" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Value OT 1</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="ValueOT1" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Value OT 2</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="ValueOT2" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Value OT Holiday</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="ValueOTHoliday" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Attendance Premi</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="AttendancePremi" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Food / Eating Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="EatingAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Menstrual Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="MenstrualAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Transport Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="TransportAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Target Reward</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="TargetReward" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Shift Allowance</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="ShiftAllowance" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Pengembalian PPH</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="PENGEMBALIAN_PPH" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>

                            {/* khusus untuk company bai */}
                            {
                                IDCompany === 'BAI' && <Col sm={12} md={4} lg={3}>
                                    <Form.Group className="mb-3" controlId="formEmpID">
                                        <Form.Label>Uang Lembur</Form.Label>
                                        <Form.Control type="number" step="0.0001" name="UANG_LEMBUR" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                    </Form.Group>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <hr />
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <h5>Deduction Cost</h5>
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Absentee Cost</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="Absentee" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Union / Serikat Cost</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="UnionCost" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>{IDCompany === 'BAI' ? 'Potongan BPJS' : 'Jamsostek'}</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="Jamsostek" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>PPh / Tax</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="Tax" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Potongan Berangkat Siang</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="POTONG_BERANGKAT_SIANG" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Potongan Pulang Awal</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="POTONG_PULANG_AWAL" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>

                            {/* khusus untuk company bai */}
                            {
                                IDCompany === 'BAI' && <Col sm={12} md={4} lg={3}>
                                    <Form.Group className="mb-3" controlId="formEmpID">
                                        <Form.Label>Potongan Lain-lain</Form.Label>
                                        <Form.Control type="number" step="0.0001" name="POTONGAN_LAIN_LAIN" onChange={ocPayslipManual} required={true} style={{ textAlign: 'right' }} />
                                    </Form.Group>
                                </Col>
                            }

                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <hr />
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <h5>Salary Calculation</h5>
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label><b>Gross Salary</b></Form.Label>
                                    <Form.Control type="number" step="0.0001" name="GrossSalary" value={DataPayslipManual.GrossSalary} onChange={ocPayslipManual} readOnly={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label><b>Deduction Cost</b></Form.Label>
                                    <Form.Control type="number" step="0.0001" name="DeductionCost" value={DataPayslipManual.DeductionCost} onChange={ocPayslipManual} readOnly={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={4} lg={4}>
                                <Form.Group className="mb-3" controlId="formEmpID">
                                    <Form.Label>Net Salary</Form.Label>
                                    <Form.Control type="number" step="0.0001" name="NetSalary" value={DataPayslipManual.NetSalary} onChange={ocPayslipManual} readOnly={true} style={{ textAlign: 'right' }} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" size="sm" type="submit"><FaSave /> Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={ModalDetailPayslip} size="md" onHide={CloseModalDetailPayslip}>
                <Form>
                    <Modal.Header className="bg-success text-mute bg-opacity-50" closeButton>
                        <Modal.Title>Payslip Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <Table>
                                    <tr>
                                        <td>Name</td>
                                        <td>: {DetailPayslip.EMP_FULL_NAME}</td>
                                    </tr>
                                    <tr>
                                        <td>Department</td>
                                        <td>: {DetailPayslip.EMP_DEPARTMENT}</td>
                                    </tr>
                                    <tr>
                                        <td>Job Title</td>
                                        <td>: {DetailPayslip.EMP_JOB_TITLE}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}><br /><b>Income</b></td>
                                    </tr>
                                    <tr>
                                        <td>Basic Salary</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_GAJI_POKOK)}</td>
                                    </tr>
                                    <tr>
                                        <td>Prorate Salary</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_GAJI_PRORATE)}</td>
                                    </tr>
                                    <tr>
                                        <td>Grading Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_TUNJANGAN_GRADING)}</td>
                                    </tr>
                                    <tr>
                                        <td>Work Length Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_TUNJANGAN_MASA_KERJA)}</td>
                                    </tr>
                                    <tr>
                                        <td>Job Title Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_TUNJANGAN_JABATAN)}</td>
                                    </tr>
                                    <tr>
                                        <td>Non-Fixed Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_TUNJANGAN_TIDAK_TETAP)}</td>
                                    </tr>
                                    <tr>
                                        <td>Skill Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_TUNJANGAN_SKILL)}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Working Day / Working Hour</td>
                                        <td>: {parseInt(DetailPayslip.SAL_TOTAL_HARIKERJA)} / {parseInt(DetailPayslip.SAL_TOTAL_JAMKERJA)}</td>
                                    </tr>
                                    <tr>
                                        <td>Total OT 1 / OT 2 / OT Holiday</td>
                                        <td>: {parseInt(DetailPayslip.SAL_COUNT_OT_1)} / {parseInt(DetailPayslip.SAL_COUNT_OT_2)} / {parseInt(DetailPayslip.SAL_COUNT_OT_HOLIDAY)}</td>
                                    </tr>
                                    <tr>
                                        <td>Value OT 1</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_OT_WORKDAY1)}</td>
                                    </tr>
                                    <tr>
                                        <td>Value OT 2</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_OT_WORKDAY2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Value OT Holiday</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_OT_HOLIDAY)}</td>
                                    </tr>
                                    <tr>
                                        <td>Attendance Premi</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_PREMI_HADIR)}</td>
                                    </tr>
                                    <tr>
                                        <td>Eating / Food Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_BIAYA_MAKAN)}</td>
                                    </tr>
                                    <tr>
                                        <td>Menstrual Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_UANG_HAID)}</td>
                                    </tr>
                                    {
                                        IDCompany === 'BAI' && <tr>
                                            <td>Uang Lembur</td>
                                            <td>: - {formatRupiah(DetailPayslip.SAL_UANG_LEMBUR)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td>Transport Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_TRANSPORT)}</td>
                                    </tr>
                                    <tr>
                                        <td>Pengembalian PPH</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_RETURN_PPH)}</td>
                                    </tr>
                                    <tr>
                                        <td>Reward Target</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_REWARD_TARGET)}</td>
                                    </tr>
                                    <tr>
                                        <td>Shift Allowance</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_SHIFT_UANG)}</td>
                                    </tr>
                                    <tr>
                                        <td>Gross Salary</td>
                                        <td>: {formatRupiah(DetailPayslip.SAL_GAJI_KOTOR)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}><br /><b>Expense</b></td>
                                    </tr>

                                    <tr>
                                        <td>Potongan Berangkat Siang</td>
                                        <td>: - {formatRupiah(DetailPayslip.SAL_POTONG_BERANGKAT_SIANG)}</td>
                                    </tr>
                                    <tr>
                                        <td>Potongan Pulang Awal</td>
                                        <td>: - {formatRupiah(DetailPayslip.SAL_POTONG_PULANG_AWAL)}</td>
                                    </tr>
                                    <tr>
                                        <td>Absentee</td>
                                        <td>: - {formatRupiah(DetailPayslip.SAL_MANGKIR)}</td>
                                    </tr>
                                    <tr>
                                        <td>Union / Serikat Cost</td>
                                        <td>: - {formatRupiah(DetailPayslip.SAL_SERIKAT)}</td>
                                    </tr>
                                    <tr>
                                        <td>BPJS Ketenagakerjaan</td>
                                        <td>: - {formatRupiah(DetailPayslip.SAL_JAMSOSTEK)}</td>
                                    </tr>
                                    {
                                        IDCompany === 'BAI' && <tr>
                                            <td>Potongan Lain- lain</td>
                                            <td>: - {formatRupiah(DetailPayslip.SAL_POTONGAN_LAIN_LAIN)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td>PPh</td>
                                        <td>: - {formatRupiah(DetailPayslip.SAL_PPH)}</td>
                                    </tr>
                                    <tr>
                                        <td><br /><b>Net Salary</b></td>
                                        <td><br /><b>: {formatRupiah(DetailPayslip.SAL_GAJI_BERSIH)}</b></td>
                                    </tr>

                                </Table>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="danger" onClick={OpenModalDeletePayslip}><FaTrash /></Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={ModalDelPayslip} size="sm" onHide={() => setModalDelPayslip(false)}>
                <Modal.Header className="bg-danger text-mute bg-opacity-50" closeButton>
                    <Modal.Title>Payslip Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Do you want to delete Payslip?</p>
                    <br />
                    <Button variant="danger" onClick={() => deletePayslip(DetailPayslip.SAL_ID)} style={{ width: '100%' }}>DELETE</Button>
                    <br /><br />
                    <Button variant="secondary" style={{ width: '100%' }}>CANCEL</Button>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default PortalPayslip;