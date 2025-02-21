//import axios from "../axios/axios.js";
import moment from "moment";
import axios from "../axios/axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Modal, Form } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import TemplatePayslip from "../assets/excel/template-payslip.xlsx";
import * as XLSX from "xlsx";


const PortalPayslip = () => {
    const [ListPayslip, setListPayslip ]                = useState([]);
    const [ModalImportBatch, setModalImportBatch]       = useState(false);
    const [DataPayslipMultiple, setDataPayslipMultiple] = useState([]);
    const getDataPaySlip = async(year, month) => {
        const getData = await axios.get(`/personal/payslip/${year}/${month}`);
        if(getData.status===200){
            if((getData.data.data).length > 0){
                setListPayslip(getData.data.data);
            } else {
                toast.warning('No existing Payslip data');
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
        getDataPaySlip(moment().format('YYYY'), moment().format('MM'));
    }, []);

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
                        <Table>
                            <thead className="text-center">
                                <tr>
                                    <th>Year</th>
                                    <th>Month</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Departemen</th>
                                    <th>Company</th>
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
                                    <th>{item.PAYSLIP_YEAR}</th>
                                    <th>{item.PAYSLIP_MONTH}</th>
                                    <th>{item.EMP_ID}</th>
                                    <th>{item.EMP_NAME}</th>
                                    <th>{item.EMP_DEPT}</th>
                                    <th>{item.EMP_COMPANY}</th>
                                    <th>{item.EMP_JOBTITLE}</th>
                                    <th>{item.EMP_ONBOARDING_DATE}</th>
                                    <th>{item.EMP_RESIGN_DATE}</th>
                                    <th>{item.BASIC_SALARY}</th>
                                    <th>{item.GROSS_SALARY}</th>
                                    <th>{item.NET_SALARY}</th>
                                </tr>

                                ))}
                            </tbody>
                        </Table>
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