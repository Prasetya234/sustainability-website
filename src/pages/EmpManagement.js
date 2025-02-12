import axios from "../axios/axios.js";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Table, Pagination, Form, Modal, InputGroup } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash, FaSave, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import DropdownCus from "../partial/DropdownCus.js";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import * as XLSX from "xlsx";
import TemplateEmployee from "../assets/excel/template-employee.xlsx";
import moment from "moment";
import { FaCircleUser, FaTriangleExclamation } from "react-icons/fa6";


const EmpManagement = () => {
    const [ ListEmp, SetListEmp ] = useState([]);
    const [ ModalAddEmp, setModalAddEmp ]           = useState(false);
    const [ ModalImportBatch, setModalImportBatch ] = useState(false);
    const [ ModalDeleteBatch, setModalDeleteBatch ] = useState(false);
    const [ DataEmpAddManual, setDataEmpAddManual ] = useState([]);
    const [ DataEmpAddImport, setDataEmpAddImport ] = useState([]);
    const [ SelectedEmp, setSelectedEmp ]           = useState({});
    const [ activeDropdown, setActiveDropdown ]     = useState(null);
    const [ showPassword, setShowPassword]          = useState(false);
    const [currentPage, setCurrentPage]             = useState(1);
    const [totalPages, setTotalPages]               = useState(1);
    const limitPage                                 = 30; // Show 10 per page

    
    
    
    const getListEmpPaginated = async(page) => {
        const response = await axios.get(`/employee/emp-list-page?page=${page}&limit=${limitPage}`);
        if(response.status===200){
            SetListEmp(response.data.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        }
    }

    

    const OpenModalAddEmp = () => {
        setModalAddEmp(true);
    }

    const OpenModalImportBatch = () => {
        setModalImportBatch(true);
    }

    const OpenModalDeleteBatch = () => {
        setModalDeleteBatch(true);
    }

    const CloseModalAddEmp = () => {
        setDataEmpAddManual([]);
        setModalAddEmp(false);
    }

    const CloseModalImportBatch = () => {
        setModalImportBatch(false);
    }

    const CloseModalDeleteBatch = () => {
        setModalDeleteBatch(false);
    }

    const ocAddEmpManual = async(event) => {
        const { name, value } = event.target;
        switch(name){
            case "EmpID":
                if(value.length>4){
                    const checkID = await axios.get(`/employee/emp-check-id/${value}`);
                    if(checkID.status===200 && checkID.data.exist === true) toast.warning('ID sudah digunakan!');
                    setDataEmpAddManual((prevData) => ({
                        ...prevData,
                        EmpID: value,
                    }));
                }
            break;
            case "EmpUsername":
                if(value.length>4){
                    const checkUsername = await axios.get(`/employee/emp-check-username/${value}`);
                    if(checkUsername.status===200 && checkUsername.data.exist === true) toast.warning('Username sudah digunakan!');
                    setDataEmpAddManual((prevData) => ({
                        ...prevData,
                        EmpUsername: "psg" + value,
                      }));
                }
            break;
            case "EmpEmail":
                if(value.length>4){
                    const checkEmail = await axios.get(`/employee/emp-check-email/${value}`);
                    if(checkEmail.status===200 && checkEmail.data.exist === true) toast.warning('Email sudah digunakan!');
                    setDataEmpAddManual((prevData) => ({
                        ...prevData,
                        EmpEmail: value,
                    }));
                }
            break;
            default:
                setDataEmpAddManual((prevData) => ({
                    ...prevData,
                    [name]: value,
                  }));
            break;
        }
        
    }

    const submitEmpManual = async(event) => {
        event.preventDefault();
        const postEmp = await axios.post('/employee/emp-new', { dataEmp: DataEmpAddManual });
        if(postEmp.status === 200){
            setDataEmpAddManual({});
            await getListEmpPaginated(currentPage);
            toast.success('Success add new employee');
            CloseModalAddEmp();
        } else {
            toast.warning('Fail to add employee');
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
      
                setDataEmpAddImport(formattedData);
              }
            };
            reader.readAsBinaryString(file);
        }
      };

      
      const submitEmpMass = async(event) => {
        event.preventDefault();
        const postEmp = await axios.post('/employee/emp-new-mass', { listEmp: DataEmpAddImport });
        if(postEmp.status === 200){
            toast.success('Success upload employee data');
            await getListEmpPaginated(currentPage);
            CloseModalAddEmp();
        } else {
            toast.warning('Employee data upload failed, please check file.');
        }
    }

    const submitEmpBatchDelete = async(event) => {
        event.preventDefault();
        const postEmp = await axios.post('/employee/emp-batch-delete');
        if(postEmp.status===200){
            await getListEmpPaginated(currentPage);
            toast.success('Inactive Employee Successfully Deleted.');
        }
    }


    const actionList = (id) => {
        return [
          { actionLable: "Edit", actExe: () => console.log(id)},
          { actionLable: "Resigned", actExe: () => console.log(id) },
          { actionLable: "Account Log", actExe: () => console.log(id) },
          { actionLable: "Modify Employee ID", actExe: () => console.log(id) },
          { actionLable: "Disable", actExe: () => console.log(id) },
          { actionLable: "Reset Password", actExe: () => console.log(id) },
        ];
      }

    
    useEffect(() => {
        getListEmpPaginated(currentPage);
    }, [currentPage]);


    return (
        <>
        <Row className="mx-0 mt-3">
        <Col className="ps-3 p-2">
          <Card className="border-0 ">
            <Card.Header>
                <Button variant={"primary"} size="sm" onClick={OpenModalAddEmp}><FaPlus/> ADD </Button>&nbsp; &nbsp;
                <Button variant={"success"} size="sm" onClick={OpenModalImportBatch}><FaFileImport/> IMPORT IN BATCH</Button>&nbsp; &nbsp;
                <Button variant={"danger"} size="sm" onClick={OpenModalDeleteBatch}><FaTrash/> DELETE IN BATCH </Button>
            </Card.Header>
            <Card.Body className="text rounded shadow-sm">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Status</th>
                            <th>Active</th>
                            <th>Username</th>
                            <th>Employee ID</th>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>Department</th>
                            <th>Last Update</th>
                            <th>Action</th>    
                        </tr>    
                    </thead>
                    <tbody>
                        { ListEmp && ListEmp.map((item, index ) => (
                            <tr key={index}>
                                <td className="text-center"><FaCircleUser/> </td>
                                <td className="text-success">In Service</td>
                                <td>Yes</td>
                                <td>{item.emp_username}</td>
                                <td>{item.emp_id}</td>
                                <td>{item.emp_full_name}</td>
                                <td>{ item.emp_gender === 'M' ? 'Male' : 'Female' }</td>
                                <td>{ item.emp_department}</td>
                                <td>{ moment(item.emp_updatedate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>
                                    <DropdownCus
                                        label={"Action"}
                                        dropdownId={`dropdown${item.emp_id}`}
                                        items={actionList(item.emp_id)}
                                        activeDropdown={activeDropdown}
                                        setActiveDropdown={setActiveDropdown}
                                    />
                                </td>
                            </tr>
                        ))}
                            
                    </tbody>    
                </Table>
                {/* Bootstrap Pagination */}
      <Pagination>
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
                <br />

            </Card.Body>
            </Card>
        </Col>
    </Row>

    <Modal show={ModalAddEmp} size="xl" onHide={CloseModalAddEmp}>
        <Form onSubmit={submitEmpManual}>    
            <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
            <Modal.Title>Add New Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mx-4">
                    <Row>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpID">
                                <Form.Label>Employee ID</Form.Label>
                                <Form.Control type="text" name="EmpID" onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>PSG</InputGroup.Text>
                                    <Form.Control type="text" name="EmpUsername" onChange={ocAddEmpManual} required={true}/>
                                </InputGroup>
                                
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>* Password</Form.Label>
                                <InputGroup>
                                    <Form.Control type={showPassword ? "text" : "password"} name="EmpPassword" minLength={6} onChange={ocAddEmpManual} required={true}/>
                                    <Button variant="outline-primary" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <BsEyeSlash /> : <BsEye />}</Button>
                                </InputGroup>
                               
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" name="EmpFullName"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select name="EmpGender" onChange={ocAddEmpManual} required={true}>
                                    <option value={""} disabled selected>Select Gender</option>
                                    <option value={"M"}>Male</option>
                                    <option value={"F"}>Female</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpBirthday">
                                <Form.Label>Birthday</Form.Label>
                                <Form.Control type="date" name="EmpBirthday"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>

                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpOnboardingDate">
                                <Form.Label>Onboarding Date</Form.Label>
                                <Form.Control type="date" name="EmpOnboardingDate"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="EmpEmail"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpLaborType">
                                <Form.Label>Labor Type</Form.Label>
                                <Form.Control type="text" name="EmpLaborType"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpDepartment">
                                <Form.Label>Department</Form.Label>
                                <Form.Control type="text" name="EmpDepartment"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpJobTitle">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control type="text" name="EmpJobTitle"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group className="mb-3" controlId="formEmpAddress">
                                <Form.Label>Emp Address</Form.Label>
                                <Form.Control type="text" name="EmpAddress"  onChange={ocAddEmpManual} required={true}/>
                            </Form.Group>
                        </Col>
                    </Row>
                
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" size="sm" type="submit"><FaSave/> Save</Button>
            </Modal.Footer>
        </Form>
      </Modal>
    
      <Modal show={ModalImportBatch} size="md" onHide={CloseModalImportBatch}>
        <Form>    
            <Modal.Header className="bg-success text-mute bg-opacity-50" closeButton>
                <Modal.Title>Employee Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <a href={TemplateEmployee} download>Download Template Excel</a>
                        </Col>
                        <Col sm={12} md={12} lg={12}>  
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" name="EmpImportFile" onChange={handleUploadXLSXEmp}/>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="success" size="sm" onClick={submitEmpMass} disabled={DataEmpAddImport.length===0 ? true:false}><FaUpload/> Upload</Button>
            </Modal.Footer>
            </Form>
        </Modal>

      <Modal show={ModalDeleteBatch} size="md" onHide={CloseModalDeleteBatch}>
        <Form>    
            <Modal.Header className="bg-danger text-mute bg-opacity-50" closeButton>
                <Modal.Title>Delete Batch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <p>
                                You will delete all inactive employee.<br/>This operation will not affect the historical data of users in the statistics.<br/>Please be careful.
                            </p>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" size="sm" onClick={submitEmpBatchDelete}><FaTriangleExclamation/> &nbsp;Proceed</Button>
            </Modal.Footer>
            </Form>
        </Modal>
        
        </>
    )
}

export default EmpManagement;