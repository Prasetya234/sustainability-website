//import axios from "../axios/axios.js";
import moment from "moment";
import axios from "../axios/axios";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Modal, Form, Pagination } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaUpload, FaSave } from "react-icons/fa";
import TemplateTHR from "../assets/excel/template-thr.xlsx";
import * as XLSX from "xlsx";
import { formatAccountingIDR } from "../component/utils/AccountingCurrency";
import { AuthContext } from "../auth/AuthProvider";
import { formatRupiah } from "../component/utils/Utils";


const PortalTHR = () => {
    const { value }                                     = useContext(AuthContext)
    const [ListTHR, setListTHR ]                = useState([]);
    const [ListPerusahaan, setListPerusahaan]           = useState([]);
    const [SelectPerusahaan, setSelectPerusahaan]       = useState('');
    const [FilterTHR, setFilterTHR]             = useState({Year:moment().format('YYYY'), Month:moment().format('M')});
    const [ModalManualTHR, setModalManualTHR]   = useState(false);
    const [ModalImportBatch, setModalImportBatch]       = useState(false);
    const [ModalDetailTHR, setModalDetailTHR]   = useState(false);
    const [ModalDelTHR, setModalDelTHR]         = useState(false);
    const [DetailTHR, setDetailTHR]             = useState({});
    const [DataTHRManual, setDataTHRManual]     = useState({
            THR_YEAR: moment().format('YYYY'),
            THR_COMPANY: value.idPerusahaan,
            EMP_ID: "",
            THR_MASA_KERJA: 0,
            THR_STATUS_PAJAK:"",
            THR_GAJI_POKOK:0,
            THR_TUNJANGAN_GRADING:0,
            THR_TUNJANGAN_MASA_KERJA:0,
            THR_TUNJANGAN_JABATAN:0,
            THR_TUNJANGAN_TIDAK_TETAP:0,
            THR_TOTAL_UPAH: 0,
            THR_BRUTO:0,
            THR_PPH:0,
            THR_BERSIH:0,
            THR_CREATE_BY:value.userId
    });
    const [DataTHRMultiple, setDataTHRMultiple] = useState([]);
    const [currentPage, setCurrentPage]                 = useState(1);
    const [totalPages, setTotalPages]                   = useState(1);
    const limitPage                                     = 25; 
    const IDCompany                                     = value.idPerusahaan;
    
    const getListCompany = async() => {
            const response = await axios.get('/perusahaan');
            if(response.status===200){
                setListPerusahaan(response.data.data);
            }
        }
    
    const getDataTHR = async(company, page, limit, year, month) => {
        const companyID = company ? company : 'all';
        const getData = await axios.get(`/personal/thr?company=${companyID}&page=${page}&limit=${limit}&year=${year}`);
        if(getData.status===200){
            if((getData.data.data).length > 0){
                setListTHR(getData.data.data);
                setTotalPages(getData.data.totalPages);
                setCurrentPage(page);
            } else {
                setListTHR([]);
            }
        } else {
            toast.danger('Cannot Load THR Data');
        }
    }

    const getDataTHRSearch = async(company, page, limit, year, month, search) => {
        const companyID = company ? company : 'all';
        const getData = await axios.get(`/personal/THR-search?company=${companyID}&page=${page}&limit=${limit}&year=${year}&search=${encodeURIComponent(search)}`);
        if(getData.status===200){
            if((getData.data.data).length > 0){
                setListTHR(getData.data.data);
                setTotalPages(getData.data.totalPages);
                setCurrentPage(page);
            } else {
                setListTHR([]);
            }
        } else {
            toast.danger('Cannot Load THR Data');
        }
    }


    const OpenModalManualTHR = () => {
        setModalManualTHR(true);
    }

    const OpenModalImportBatch = () => {
        setModalImportBatch(true);
    }

    const OpenModalDeleteTHR = () => {
        setModalDelTHR(true);
    }

    const CloseModalManualTHR = () => {
        setModalManualTHR(false);
        setDataTHRManual({});
    }

    const CloseModalImportBatch = () => {
        setModalImportBatch(false);
        setDataTHRMultiple([]);
    }

    const CloseModalDetailTHR = () => {
        setModalDetailTHR(false);
        setDetailTHR({});
    }


    const ocFilterYearMonth = async(event) => {
        const { name, value } = event.target;
        if(name==='FilterYear'){
            setFilterTHR((prevData) => ({
                ...prevData,
                THR_YEAR: value,
            }));
            await getDataTHR(IDCompany, currentPage, limitPage, value, FilterTHR.Month);
        }

        if(name==='FilterMonth'){
            setFilterTHR((prevData) => ({
                ...prevData,
                Month: value,
            }));
            getDataTHR(IDCompany, currentPage, limitPage, FilterTHR.Year, value);
        }
    }

    const ocSelectPerusahaan = async(event) => {
        const { value } = event.target;
        setSelectPerusahaan(value);
        setDataTHRManual((prevData) => ({
            ...prevData,
            THR_COMPANY: value
        }));
    }

    const ocTHRManual = async(event) => {
        const { name, value } = event.target;
        if(name==="EMP_ID"){
            if(value.length > 4){
                const getEmpData = await axios.get(`/employee/emp-check-id/${SelectPerusahaan}/${value}`);
                if(getEmpData.status===200 && getEmpData.data.exist === true){
                    setDataTHRManual((prevData) => ({
                        ...prevData,
                        EMP_FULL_NAME: getEmpData.data.data.EMP_FULL_NAME,
                        EMP_DEPARTMENT: getEmpData.data.data.EMP_DEPARTMENT,
                        EMP_JOB_TITLE: getEmpData.data.data.EMP_JOB_TITLE,
                        THR_COMPANY: SelectPerusahaan
                    }));        
                } else {
                    console.log(`emp not found`);
                }
            }
        }

        
        setDataTHRManual((prevData) => ({
            ...prevData,
            [name]: value
        })); 
    }

    const getDetailTHR = async(id) => {
        const getData = await axios.get(`/personal/thr-by-id/${id}`);
        if(getData.status === 200) {
            setModalDetailTHR(true);
            setDetailTHR(getData.data.data[0]);
        }
    }

    const deleteTHR = async(id)=> {
        const getData = await axios.delete(`/personal/thr/${id}`);
        if(getData.status===200){
            setModalDetailTHR(false);
            setModalDelTHR(false);
            setDetailTHR({});
            getDataTHR(IDCompany, currentPage, limitPage, FilterTHR.Year, FilterTHR.Month);
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
                    // Function to check if a value is an Excel date
                    const isExcelDate = (value) => {
                        return typeof value === "number" && value > 0 && value < 2958465; // Excel's valid date range
                    };
                    
                    // Convert array into array of objects
                const formattedData = values.map((row) => {
                    let obj = {};
                    headers.forEach((key, index) => {
                        let value = row[index];

                        // Convert only if the column is 'BIRTHDAY' or 'ONBOARDING_DATE'
                        if (['EMP_TANGGAL_MASUK', 'EMP_TANGGAL_KELUAR'].includes(key) && isExcelDate(value)) {
                             const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel starts at Dec 30, 1899
                             value = moment.utc(excelEpoch.getTime() + value * 86400000).format('YYYY-MM-DD');
                        }

                        
                        obj[key] = value || ""; // Assign each value to the corresponding key
                    });
                    return obj;
                });
      
          
                    setDataTHRMultiple(formattedData);
                  }
                };
                reader.readAsBinaryString(file);
            }
          };
    
    const submitTHRManual = async(event) => {
        event.preventDefault();
        const postEmp = await axios.post('/personal/thr-new', { dataTHR: DataTHRManual });
        if(postEmp.status === 200){
            setDataTHRManual({
                THR_YEAR: 0,
                THR_COMPANY: value.idPerusahaan,
                EMP_ID: "",
                THR_MASA_KERJA: 0,
                THR_STATUS_PAJAK:"",
                THR_GAJI_POKOK:0,
                THR_TUNJANGAN_GRADING:0,
                THR_TUNJANGAN_MASA_KERJA:0,
                THR_TUNJANGAN_JABATAN:0,
                THR_TUNJANGAN_TIDAK_TETAP:0,
                THR_TOTAL_UPAH: 0,
                THR_BRUTO:0,
                THR_PPH:0,
                THR_BERSIH:0,
                THR_CREATE_BY:value.userId
            });
            toast.success(postEmp.data.message);
            getDataTHR(IDCompany, currentPage, limitPage, FilterTHR.Year, FilterTHR.Month);
            CloseModalManualTHR();
        } else {
            toast.warning('Fail to add employee');
        }
    }



    const submitTHRMass = async(event) => {
            event.preventDefault();
            const postEmp = await axios.post('/personal/THR-new-mass', { listTHR: DataTHRMultiple });
            if(postEmp.status === 200){
                toast.success('Success upload THR data');
                CloseModalImportBatch();
                getDataTHR(value.idPerusahaan, currentPage, limitPage, FilterTHR.Year, FilterTHR.Month);
            } else {
                toast.warning('THR data upload failed, please check file.');
            }
    }


    const searchEmp = async(event) => {
        const { value } = event.target;
        if(value.length > 3){
            //const EmpCompany = value.idPerusahaan ? value.idPerusahaan : "all";
            await getDataTHRSearch(IDCompany, 1, limitPage, FilterTHR.Year, FilterTHR.Month, value);
        } else {
            await getDataTHR(IDCompany, currentPage, limitPage, FilterTHR.Year, FilterTHR.Month);
        }
    }
          
        

    useEffect(() => {
        getDataTHR(IDCompany, currentPage, limitPage, FilterTHR.Year, FilterTHR.Month);
        getListCompany();
    }, [FilterTHR.Year, FilterTHR.Month, currentPage]);

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

    console.log(DataTHRMultiple);
    
    
    return (
        <>
        <Row className="mx-0 mt-3">
            <Col sm={12} className="ps-3 p-2">
                <Card className="border-0 ">
                    <Card.Header  className="d-flex justify-content-between align-items-center">
                        <div>
                            <Button variant={"primary"} size="sm" onClick={OpenModalManualTHR}><FaPlus/> ADD </Button>&nbsp; &nbsp;
                            <Button variant={"success"} size="sm" onClick={OpenModalImportBatch}><FaFileImport/> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                            
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
                            <Col sm={12} md={2} lg={1}>
                                <Form.Label>Tahun</Form.Label>
                                <Form.Select size="sm" defaultValue={FilterTHR.Year} name="FilterYear" onChange={ocFilterYearMonth}>
                                    <option value={""} disabled selected>Pilih Tahun</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </Form.Select>
                            </Col>
                            <Col sm={0} md={10} lg={11}>
                            
                            </Col>
                        </Row>
                        <Row>
                           <Col sm={12}>
                                <br/>
                                <Table  striped hover responsive>
                                    <thead className="text-center">
                                        <tr className="text-center">
                                            <th>Tahun</th>
                                            <th>ID</th>
                                            <th>Nama</th>
                                            <th>Departemen</th>
                                            <th>Bagian</th>
                                            <th>Jabatan</th>
                                            <th>Status Pajak</th>
                                            <th>Tanggal Masuk</th>
                                            <th>Tanggal Keluar</th>
                                            <th>Total Upah</th>
                                            <th>THR Bruto</th>
                                            <th>PPH 21</th>
                                            <th>THR Bersih</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { ListTHR && ListTHR.map((item, index ) => (
                                        <tr key={index} onDoubleClick={() => getDetailTHR(item.THR_ID)}>
                                            <td>{item.THR_YEAR}</td>
                                            <td>{item.EMP_ID}</td>
                                            <td>{item.EMP_FULL_NAME}</td>
                                            <td>{item.EMP_DEPARTEMEN}</td>
                                            <td>{item.EMP_BAGIAN}</td>
                                            <td>{item.EMP_JABATAN}</td>
                                            <td className="text-center">{item.THR_STATUS_PAJAK}</td>
                                            <td className="text-center">{item.EMP_TANGGAL_MASUK}</td>
                                            <td className="text-center">{item.EMP_TANGGAL_KELUAR}</td>
                                            <td className="text-center">{formatAccountingIDR(item.THR_TOTAL_UPAH)}</td>
                                            <td className="text-center">{formatAccountingIDR(item.THR_BRUTO) }</td>
                                            <td className="text-center">{formatAccountingIDR(item.THR_PPH)}</td>
                                            <td className="text-center">{formatAccountingIDR(item.THR_BERSIH)}</td>
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
                <Modal.Title>THR Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <a href={TemplateTHR} download>Download Template Excel</a>
                        </Col>
                        <Col sm={12} md={12} lg={12}>  
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" name="EmpImportFile" onChange={handleUploadXLSXEmp}/>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="success" size="sm" onClick={submitTHRMass} disabled={DataTHRMultiple.length===0 ? true:false}><FaUpload/> Upload</Button>
            </Modal.Footer>
            </Form>
        </Modal>


        <Modal show={ModalManualTHR} size="xl" onHide={CloseModalManualTHR}>
        <Form onSubmit={submitTHRManual}>    
            <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
            <Modal.Title>Add New THR</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mx-2">
                    <Row>
                        <Col sm={6} md={4} lg={3}>
                                <Form.Label>Year</Form.Label>
                                <Form.Select size="sm" name="THR_YEAR" onChange={ocTHRManual} required={true}>
                                    <option value={""} disabled selected>Select Year</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </Form.Select>
                            </Col>
                        {IDCompany===null && (
                            <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formCompanyID">
                                <Form.Label>Company ID</Form.Label>
                                <Form.Select name="THR_COMPANY" onChange={ocSelectPerusahaan} required={true}>
                                    <option value={""} disabled selected>Select Company</option>
                                    { ListPerusahaan && ListPerusahaan.map((item) => (
                                        <option value={item.ID_PERUSAHAAN}>{item.NAMA_PERUSAHAAN}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        )}
                        
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Employee ID</Form.Label>
                                <Form.Control type="text" name="EMP_ID" onChange={ocTHRManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Employee Name</Form.Label>
                                <Form.Control type="text" name="EMP_FULL_NAME" value={DataTHRManual.EMP_FULL_NAME} onChange={ocTHRManual} disabled={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Employee Departmen</Form.Label>
                                <Form.Control type="text" name="EMP_DEPARTMENT" value={DataTHRManual.EMP_DEPARTMENT} onChange={ocTHRManual} disabled={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Employee Job Title</Form.Label>
                                <Form.Control type="text" name="EMP_JOB_TITLE" value={DataTHRManual.EMP_JOB_TITLE} onChange={ocTHRManual} disabled={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Status Pajak</Form.Label>
                                <Form.Control type="text" name="THR_STATUS_PAJAK" value={DataTHRManual.THR_STATUS_PAJAK} onChange={ocTHRManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Masa Kerja</Form.Label>
                                <Form.Control type="text" name="THR_MASA_KERJA" value={DataTHRManual.THR_MASA_KERJA} onChange={ocTHRManual} required={true}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Gaji Pokok</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_GAJI_POKOK" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Grade</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_TUNJANGAN_GRADING" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Tunjangan Masa Kerja</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_TUNJANGAN_MASA_KERJA" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Tunjangan Jabatan</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_TUNJANGAN_JABATAN" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Tunjangan Tidak Tetap</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_TUNJANGAN_TIDAK_TETAP" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Total Upah</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_TOTAL_UPAH" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>THR Bruto</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_BRUTO" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>PPH 21</Form.Label>
                                <Form.Control type="number" step="0.0001" name="THR_PPH" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={4} lg={3}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>THR BERSIH</Form.Label>
                                <Form.Control type="number" name="THR_BERSIH" onChange={ocTHRManual} required={true} style={{textAlign:'right'}}/>
                            </Form.Group>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" size="sm" type="submit"><FaSave/> Save</Button>
            </Modal.Footer>
        </Form>
      </Modal>
    
      <Modal show={ModalDetailTHR} size="md" onHide={CloseModalDetailTHR}>
        <Form>    
            <Modal.Header className="bg-success text-mute bg-opacity-50" closeButton>
                <Modal.Title>THR Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <Table>
                                <tr>
                                    <td>ID NIK</td>
                                    <td>: {DetailTHR.EMP_ID}</td>
                                </tr>
                                <tr>
                                    <td>Nama Lengkap</td>
                                    <td>: {DetailTHR.EMP_FULL_NAME}</td>
                                </tr>
                                <tr>
                                    <td>Departemen</td>
                                    <td>: {DetailTHR.EMP_DEPARTEMEN}</td>
                                </tr>
                                <tr>
                                    <td>Bagian</td>
                                    <td>: {DetailTHR.EMP_BAGIAN}</td>
                                </tr>
                                <tr>
                                    <td>Jabatan</td>
                                    <td>: {DetailTHR.EMP_JABATAN}</td>
                                </tr>
                                <tr>
                                    <td>Gaji Pokok</td>
                                    <td>: {formatRupiah(DetailTHR.THR_GAJI_POKOK)}</td>
                                </tr>
                                <tr>
                                    <td>Grade</td>
                                    <td>: {formatRupiah(DetailTHR.THR_TUNJANGAN_GRADING)}</td>
                                </tr>
                                <tr>
                                    <td>Tunjangan Masa Kerja</td>
                                    <td>: {formatRupiah(DetailTHR.THR_TUNJANGAN_MASA_KERJA)}</td>
                                </tr>
                                <tr>
                                    <td>Tunjangan Jabatan</td>
                                    <td>: {formatRupiah(DetailTHR.THR_TUNJANGAN_JABATAN)}</td>
                                </tr>
                                <tr>
                                    <td>Tunjangan Tidak Tetap</td>
                                    <td>: {formatRupiah(DetailTHR.THR_TUNJANGAN_TIDAK_TETAP)}</td>
                                </tr>
                                <tr>
                                    <td>Total Upah</td>
                                    <td>: {formatRupiah(DetailTHR.THR_TOTAL_UPAH)}</td>
                                </tr>
                                <tr>
                                    <td>THR BRUTO</td>
                                    <td>: {formatRupiah(DetailTHR.THR_BRUTO)}</td>
                                </tr>
                                <tr>
                                    <td>PPH 21</td>
                                    <td>: {formatRupiah(DetailTHR.THR_PPH)}</td>
                                </tr>
                                <tr>
                                    <td>THR BERSIH</td>
                                    <td>: {formatRupiah(DetailTHR.THR_BERSIH)}</td>
                                </tr>
                                
                            </Table>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="danger" onClick={OpenModalDeleteTHR}><FaTrash/></Button>
            </Modal.Footer>
            </Form>
        </Modal>

        <Modal show={ModalDelTHR} size="sm" onHide={()=> setModalDelTHR(false)}>
            <Modal.Header className="bg-danger text-mute bg-opacity-50" closeButton>
                <Modal.Title>THR Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Do you want to delete THR?</p>
                <br/>
                <Button variant="danger" onClick={()=>deleteTHR(DetailTHR.THR_ID)} style={{width:'100%'}}>DELETE</Button>
                <br/><br/>
                <Button variant="secondary" style={{width:'100%'}}>CANCEL</Button>
                
            </Modal.Body>
      </Modal>
        </>
    )
}

export default PortalTHR;