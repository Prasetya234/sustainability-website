import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCircle, FaLevelUpAlt, FaPlus, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";

const GrievanceCategory = () => {
    const { value }                                 = useContext(AuthContext);
    const [ ModalLevel, setModalLevel ]             = useState(false);
    const [ ModalCategory, setModalCategory ]                 = useState(false);
    const [ ListPerusahaan, setListPerusahaan ]     = useState([]);
    const [ ListCategory, setListCategory]          = useState([]);
    const [ ListSubCategory, setListSubCategory ]   = useState([]);
    const [ activeDropCat, setActiveDropCat ]       = useState(null);
    const [ activeDropSubCat, setActiveDropSubCat ] = useState(null);
    const [ dataCategory, setDataCategory ]         = useState({ ID:'', ID_COMPANY:'', TITLE:'', DESCRIPTION:''});
    const IDCompany                                 = value.idPerusahaan;
    const IDUser                                    = value.userId;

    const getListCompany = async() => {
            const response = await axios.get('/perusahaan');
            if(response.status===200){
                setListPerusahaan(response.data.data);
            }
    }

    const getCategory = async() => {
        try {
            const company   = IDCompany ? IDCompany : 'all';
            const response  = await axios.get(`/grievance/category/${company}`);
            if(response.status===200){
                setListCategory(response.data.data);
            } 
        } catch(err){
            toast.warning('Cannot Get Category');
        }
    }

    const getSubCategory = async() => {
        try {
            const company   = IDCompany ? IDCompany : 'all';
            const response  = await axios.get(`/grievance/subcategory/${company}`);
            if(response.status===200){
                setListSubCategory(response.data.data);
            } 
        } catch(err){
            toast.warning('Cannot Get Category');
        }
    }


    const OpenModalCategory = () => {
        setModalCategory(true);
    }

    const CloseModalCategory = () => {
        setModalCategory(false);
    }

    const OpenModalLevel = () => {
        setModalLevel(true);
    }

    const CloseModalLevel = () => {
        setModalLevel(false);
    }

    const actionListCategory = (id) => {
        return [
          { actionLable: "Edit", actExe: () => console.log(id)},
          { actionLable: "Delete", actExe:  () => console.log(id) },
        ];
    }

    const actionListSubCategory = (id) => {
        return [
            { actionLable: "Edit", actExe: () => console.log(id)},
            { actionLable: "Set Administrator", actExe: () => console.log(id)},
            { actionLable: "Delete", actExe:  () => console.log(id) },
        ];
    }

    const SignPriorityCat = (id) => {
        let status;
        switch(id){
            case 1:
                status = 'HIGH';
            break;
            case 2:
                status = 'MODERATE';
            break;
            case 3:
                status = 'LOW';
            break;
            default:
                status = 'LOW';
            break;
        }
        return status;
    }

    const ColorPriorityCat = (id) => {
        let status;
        switch(id){
            case 1:
                status = 'text-danger';
            break;
            case 2:
                status = 'text-warning';
            break;
            case 3:
                status = 'text-success';
            break;
            default:
                status = '';
            break;
        }
        return status;
    }

    const ocCategory = (event) => {
        const { name, value } = event.target;
        setDataCategory((prevData) => ({
            ...prevData,
            [name]: value,
            CREATE_BY: IDUser
        }));
    }

    const submitCategory = async(event) => {
        event.preventDefault();
        const tryPost = await axios.post('/grievance/category', { dataCategory: dataCategory });
        if(tryPost.status === 200){
            toast.success(tryPost.data.messages);
            setDataCategory({ ID:'', ID_COMPANY:'', TITLE:'', DESCRIPTION:''});
            setModalCategory(false);
            await getCategory();
        } else {
            toast.error(tryPost.data.messages);
        }
    }

    console.log(dataCategory);

    useEffect(() => {
        getListCompany();
        getCategory();
        getSubCategory();
    }, []);

    
    return (
        <>
        <Row className="mx-0 mt-3">
        <Col className="ps-3 p-2">
          <Card className="border-0 ">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <Button variant={"primary"} size="sm" onClick={OpenModalCategory}><FaPlus/> </Button>&nbsp; &nbsp;    
                    <Button variant={"warning"} size="sm" onClick={OpenModalLevel} ><FaLevelUpAlt/> SET LEVEL</Button>&nbsp; &nbsp;  
                </div>
                <div>
                    
                </div>  
            </Card.Header>
            <Card.Body className="text rounded shadow-sm">
                <Row>
                    <Col sm={12}>
                        <Table hover>
                            <thead className="bg-secondary">
                                <tr>
                                    {IDCompany===null && (
                                        <th>ID COMPANY</th>
                                    )}
                                    <th>CATEGORY</th>
                                    <th>PRIORITY</th>
                                    <th>TIME RANGE PROCESS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                            {ListCategory &&
                                ListCategory.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Main Category Row */}
                                <tr key={index} >
                                    {IDCompany===null && (
                                        <td>{item.ID_COMPANY}</td>
                                    )}
                                    <td colSpan={3}>
                                        <OverlayTrigger placement="right" overlay={<Tooltip>{item.DESCRIPTION}</Tooltip>}>
                                            <b>{item.TITLE}</b>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        <NewDropDown
                                            label={"Action"}
                                            dropdownId={`dropdown${item.ID}`}
                                            items={actionListCategory(item.ID)}
                                            activeDropdown={activeDropCat}
                                            setActiveDropdown={setActiveDropCat}
                                        />
                                    </td>
                                    </tr>

                                    {/* Subcategories Row */}
                                    {ListSubCategory &&
                                    ListSubCategory.filter(cat => cat.ID_CATEGORY === item.ID).map((subItem, subIndex) => (
                                        <tr key={`sub-${index}-${subIndex}`}>
                                            {IDCompany===null && (
                                                <td>{item.ID_COMPANY}</td>
                                            )}
                                            <td>---   {subItem.TITLE}</td>
                                            <td className={ColorPriorityCat(subItem.PRIORITY)}><FaCircle /> {SignPriorityCat(subItem.PRIORITY)}</td>
                                            <td>{subItem.PROCESS_HOUR} Hour</td>
                                            <td>
                                                <NewDropDown
                                                    label={"Action"}
                                                    dropdownId={`dropdown${item.ID}${item.ID_CATEGORY}`}
                                                    items={actionListSubCategory(item.ID)}
                                                    activeDropdown={activeDropSubCat}
                                                    setActiveDropdown={setActiveDropSubCat}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        </Col>
        </Row>

        <Modal show={ModalCategory} size="md" onHide={CloseModalCategory}>
            <Form onSubmit={submitCategory}>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        { IDCompany===null && (
                            <Form.Group className="mb-3" controlId="formCompanyID">
                                <Form.Label>Company ID</Form.Label>
                                <Form.Select name="ID_COMPANY" onChange={ocCategory}>
                                    <option value={""} disabled selected>Select Company</option>
                                    { ListPerusahaan && ListPerusahaan.map((item,i) => (
                                        <option value={item.ID_PERUSAHAAN} key={i}>{item.NAMA_PERUSAHAAN}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>    
                        )}
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category Title</Form.Label>
                                <Form.Control type="text" name="TITLE" onChange={ocCategory} required={true}/>
                            </Form.Group>.
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Category Description </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Explain here..."
                                    name="DESCRIPTION"
                                    onChange={ocCategory}
                                />
                            </Form.Group>.
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formButton">
                                <Button variant="primary" type="submit"><FaSave/> SAVE</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>


        <Modal show={ModalLevel} size="xl" onHide={CloseModalLevel}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title>Set Level</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">

                </Modal.Body>
            </Form>
        </Modal>


        </>
    )
}

export default GrievanceCategory;