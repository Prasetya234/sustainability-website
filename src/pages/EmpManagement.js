import axios from "../axios/axios.js";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Table, Pagination, Form, Modal, InputGroup } from "react-bootstrap";
import { FaPlus, FaFileImport, FaTrash, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import DropdownCus from "../partial/DropdownCus.js";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import * as XLSX from "xlsx";
import TemplateEmployee from "../assets/excel/template-employee.xlsx";
import moment from "moment";


const EmpManagement = () => {
    const [ ListEmp, SetListEmp ] = useState([]);
    const [ ItemPagination, setItemPagination ]     = useState([]);
    const [ ModalAddEmp, setModalAddEmp ]           = useState(false);
    const [ ModalImportBatch, setModalImportBatch ] = useState(false);
    const [ ModalDeleteBatch, setModalDeleteBatch ] = useState(false);
    const [ DataEmpAddManual, setDataEmpAddManual ] = useState([]);
    const [ DataEmpAddImport, setDataEmpAddImport ] = useState([]);
    const [ activeDropdown, setActiveDropdown ]     = useState(null);
    const [showPassword, setShowPassword]           = useState(false);


    const getListEmp = async() => {
        const dataEmp = await axios.get('/employee/emp-list');
        if(dataEmp.status===200){
            SetListEmp(dataEmp.data.data);
        }
    }

    const ConfigPagination = () => {
        let active = 10;
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active}>
                {number}
                </Pagination.Item>,
            );
        }
        setItemPagination(items);
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
            toast.success('Karyawan berhasil ditambahkan');
            await getListEmp();
            CloseModalAddEmp();
        } else {
            toast.warning('Karyawan gagal ditambahkan');
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
            toast.success('Karyawan berhasil ditambahkan');
            await getListEmp();
            CloseModalAddEmp();
        } else {
            toast.warning('Karyawan gagal ditambahkan');
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
        ConfigPagination();
        getListEmp();
    }, []);


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
                                <td> </td>
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
                <Pagination>{ItemPagination}</Pagination>
                <br />

            </Card.Body>
            </Card>
        </Col>
    </Row>

    <Modal show={ModalAddEmp} size="xl" onHide={CloseModalAddEmp}>
        <Form onSubmit={submitEmpManual}>    
            <Modal.Header className="bg-primary text-white" closeButton>
            <Modal.Title>Add New Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
    
      <Modal show={ModalImportBatch} size="sm" onHide={CloseModalImportBatch}>
        <Form>    
            <Modal.Header className="bg-success text-white" closeButton>
                <Modal.Title>User Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <a href={TemplateEmployee} download>Download Template</a>
                        </Col>
                        <Col sm={12} md={12} lg={12}>  
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" name="EmpImportFile" onChange={handleUploadXLSXEmp}/>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" size="sm" onClick={submitEmpMass} disabled={DataEmpAddImport.length===0 ? true:false}><FaSave/> Save</Button>
            </Modal.Footer>
            </Form>
        </Modal>

      <Modal show={ModalDeleteBatch} size="sm" onHide={CloseModalDeleteBatch}>
        <Form>    
            <Modal.Header className="bg-danger text-white" closeButton>
                <Modal.Title>Delete Batch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <p>
                                You will delete all inactive users.<br/>This operation will not affect the historical data of users in the statistics.<br/>Please be careful.
                            </p>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" size="sm"><FaSave/> Save</Button>
            </Modal.Footer>
            </Form>
        </Modal>
        
        </>
    )
}

export default EmpManagement;