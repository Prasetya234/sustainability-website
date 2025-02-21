//import axios from "../axios/axios.js";
import moment from "moment";
import axios from "../axios/axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Modal, Form, Pagination } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import TemplatePayslip from "../assets/excel/template-payslip.xlsx";
import * as XLSX from "xlsx";


const PortalPayslip = () => {
    const [ListPayslip, setListPayslip ]                = useState([]);
    const [FilterPayslip, setFilterPayslip]             = useState({Year:moment().format('YYYY'), Month:moment().format('MM')});
    const [ModalImportBatch, setModalImportBatch]       = useState(false);
    const [DataPayslipMultiple, setDataPayslipMultiple] = useState([]);
    const [currentPage, setCurrentPage]                 = useState(1);
    const [totalPages, setTotalPages]                   = useState(1);
    const limitPage                                     = 25; 
    
    const getDataPaySlip = async(page, limit, year, month) => {
        const getData = await axios.get(`/personal/payslip?page=${page}&limit=${limit}&year=${year}&month=${parseInt(month)}`);
        if(getData.status===200){
            if((getData.data.data).length > 0){
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

    const OpenModalImportBatch = () => {
        setModalImportBatch(true);
    }

    const CloseModalImportBatch = () => {
        setModalImportBatch(false);
    }

    const ocFilterYearMonth = async(event) => {
        const { name, value } = event.target;
        if(name==='FilterYear'){
            setFilterPayslip((prevData) => ({
                ...prevData,
                Year: value,
            }));
            // await getDataPaySlip(value, FilterPayslip.Month);
        }

        if(name==='FilterMonth'){
            setFilterPayslip((prevData) => ({
                ...prevData,
                Month: value,
            }));
            // await getDataPaySlip(FilterPayslip.Year, value);
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
    
            const submitPayslipMass = async(event) => {
                  event.preventDefault();
                  const postEmp = await axios.post('/personal/payslip-new-mass', { listPayslip: DataPayslipMultiple });
                  if(postEmp.status === 200){
                      toast.success('Success upload payslip data');
                      // await getListEmpPaginated(currentPage);
                      CloseModalImportBatch();
                  } else {
                      toast.warning('payslip data upload failed, please check file.');
                  }
              }
          
        

    useEffect(() => {
        getDataPaySlip(currentPage, limitPage, FilterPayslip.Year, FilterPayslip.Month);
    }, [currentPage, limitPage, FilterPayslip.Year, FilterPayslip.Month]);

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
                    <Card.Header>
                        <Button variant={"primary"} size="sm" ><FaPlus/> ADD </Button>&nbsp; &nbsp;
                        <Button variant={"success"} size="sm" onClick={OpenModalImportBatch}><FaFileImport/> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                        <Button variant={"danger"} size="sm" ><FaTrash/> DELETE IN BATCH </Button>
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        <Row>
                            <Col sm={6} md={2} lg={1}>
                                <Form.Label>Year</Form.Label>
                                <Form.Select size="sm" name="FilterYear" onChange={ocFilterYearMonth}>
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
                                <Form.Select size="sm" name="FilterMonth" onChange={ocFilterYearMonth}>
                                    <option value={""} disabled selected>Select Month</option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
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
                                <br/>
                                <Table>
                                    <thead className="text-center">
                                        <tr>
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
                                    { ListPayslip && ListPayslip.map((item, index ) => (
                                        <tr key={index}>
                                            <td>{item.Year}</td>
                                            <td>{moment(item.Month).format('MMMM')}</td>
                                            <td>{item.Emp_ID}</td>
                                            <td>{item.Emp_FullName}</td>
                                            <td>{item.Emp_Department}</td>
                                            <td>{item.Emp_Jobtitle}</td>
                                            <td>{item.Emp_Status}</td>
                                            <td>{item.Emp_OnboardingDate}</td>
                                            <td>{item.Emp_ResignDate}</td>
                                            <td>{item.Basic_Salary}</td>
                                            <td>{item.Gross_Salary}</td>
                                            <td>{item.Net_Salary}</td>
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
                            <a href={TemplatePayslip} download>Download Template Excel</a>
                        </Col>
                        <Col sm={12} md={12} lg={12}>  
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" name="EmpImportFile" onChange={handleUploadXLSXEmp}/>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="success" size="sm" onClick={submitPayslipMass} disabled={DataPayslipMultiple.length===0 ? true:false}><FaUpload/> Upload</Button>
            </Modal.Footer>
            </Form>
        </Modal>


        </>
    )
}

export default PortalPayslip;