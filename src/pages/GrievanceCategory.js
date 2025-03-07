import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Modal, Form } from "react-bootstrap";
import { FaCircle, FaLevelUpAlt, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";

const GrievanceCategory = () => {
    const { value }                                 = useContext(AuthContext);
    const [ ModalLevel, setModalLevel ]             = useState(false);
    const [ ModalAdd, setModalAdd ]                 = useState(false);
    const [ ListCategory, setListCategory]          = useState([]);
    const [ ListSubCategory, setListSubCategory ]   = useState([]);
    const [ activeDropCat, setActiveDropCat ]       = useState(null);
    const [ activeDropSubCat, setActiveDropSubCat ] = useState(null);
    const IDCompany                                 = value.idPerusahaan;

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


    const OpenModalAdd = () => {
        setModalAdd(true);
    }

    const CloseModalAdd = () => {
        setModalAdd(false);
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


    useEffect(() => {
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
                    <Button variant={"primary"} size="sm" onClick={OpenModalAdd}><FaPlus/> </Button>&nbsp; &nbsp;    
                    <Button variant={"warning"} size="sm" onClick={OpenModalLevel} ><FaLevelUpAlt/> SET LEVEL</Button>&nbsp; &nbsp;  
                </div>
                <div>
                    
                </div>  
            </Card.Header>
            <Card.Body className="text rounded shadow-sm">
                <Row>
                    <Col sm={12}>
                        <Table hover responsive>
                            <thead className="bg-secondary">
                                <tr>
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
                                    <tr>
                                    <td><b>{item.TITLE}</b></td>
                                    <td></td>
                                    <td></td>
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

        <Modal show={ModalAdd} size="md" onHide={CloseModalAdd}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Select>
                                    { ListCategory && ListCategory.map((item,i) => (
                                        <option value={item.ID_CATEGORY} key={i}>{item.TITLE}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>.
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>SubCategory Title </Form.Label>
                                <Form.Text>

                                </Form.Text>
                            </Form.Group>.
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