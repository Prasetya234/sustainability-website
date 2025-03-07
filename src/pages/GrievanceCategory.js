import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCircle, FaPlus, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";

const GrievanceCategory = () => {
    const { value }                                 = useContext(AuthContext);
    const [ ModalSubCategory, setModalSubCategory ]             = useState(false);
    const [ ModalCategory, setModalCategory ]                 = useState(false);
    const [ ListPerusahaan, setListPerusahaan ]     = useState([]);
    const [ ListCategory, setListCategory]          = useState([]);
    const [ ListSubCategory, setListSubCategory ]   = useState([]);
    const [ activeDropCat, setActiveDropCat ]       = useState(null);
    const [ activeDropSubCat, setActiveDropSubCat ] = useState(null);
    const [ dataCategory, setDataCategory ]         = useState({ ID:'', ID_COMPANY:'', TITLE:'', DESCRIPTION:''});
    const [ dataSubCategory, setDataSubCategory ]   = useState({ ID:'', ID_CATEGORY: 0, NAME_CATEGORY:'', ID_COMPANY: '', TITLE: '', DESCRIPTION: "", PRIORITY: 1, PROCESS_HOUR: 0});
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

    const OpenModalSubCategory = (idcategory) => {
        const selectedCategory = ListCategory.filter(cat => cat.ID === idcategory);
        console.log(selectedCategory);
        setDataSubCategory((prevData) => ({
            ...prevData,
            ID_CATEGORY: idcategory,
            NAME_CATEGORY: selectedCategory[0].TITLE
        }));
        setModalSubCategory(true);
    }

    const CloseModalSubCategory = () => {
        setModalSubCategory(false);
        setDataSubCategory({ ID:'', ID_CATEGORY: 0, NAME_CATEGORY:'', ID_COMPANY: '', TITLE: '', DESCRIPTION: "", PRIORITY: 1, PROCESS_HOUR: 0});
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

    const ocSubCategory = (event) => {
        const { name, value } = event.target;
        setDataSubCategory((prevData) => ({
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

    console.log(dataSubCategory);

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
                    <Button variant={"primary"} size="sm" onClick={OpenModalCategory}><FaPlus/> </Button> 
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
                                        <th>ID PERUSAHAAN</th>
                                    )}
                                    <th>KATEGORI</th>
                                    <th>PRIORITAS</th>
                                    <th>BATAS WAKTU<br/>PROSES</th>
                                    <th>TAMPILAN</th>
                                    <th>PANGGILAN<br/>BALIK</th>
                                    <th>PENILAIAN</th>
                                    <th>ANONIM</th>
                                    <th>TINDAKAN</th>
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
                                    <td colSpan={7}>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{item.DESCRIPTION}</Tooltip>}>
                                            <b><Button size="sm" variant="light" onClick={() => OpenModalSubCategory(item.ID)}><FaPlus/></Button>&nbsp; &nbsp;{item.TITLE}</b>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        <NewDropDown
                                            label={"Opsi"}
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
                                            <td>{subItem.PROCESS_HOUR} Jam</td>
                                            <td>{subItem.VISIBLE==='Y' ? 'YA':'TIDAK'}</td>
                                            <td>{subItem.CALLBACK==='Y' ? 'YA':'TIDAK'}</td>
                                            <td>{subItem.EVALUATION==='Y' ? 'YA':'TIDAK'}</td>
                                            <td>{subItem.ANONYMOUS==='Y' ? 'YA':'TIDAK'}</td>
                                            <td>
                                                <NewDropDown
                                                    label={"Opsi"}
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
                    <Modal.Title>{dataCategory.ID==='' ? 'Tambah':'Edit'} Kategori</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        { IDCompany===null && (
                            <Form.Group className="mb-3" controlId="formCompanyID">
                                <Form.Label>Perusahaan</Form.Label>
                                <Form.Select name="ID_COMPANY" onChange={ocCategory}>
                                    <option value={""} disabled selected>Pilih Perusahaan</option>
                                    { ListPerusahaan && ListPerusahaan.map((item,i) => (
                                        <option value={item.ID_PERUSAHAAN} key={i}>{item.NAMA_PERUSAHAAN}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>    
                        )}
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Nama Kategori</Form.Label>
                                <Form.Control type="text" name="TITLE" onChange={ocCategory} required={true}/>
                            </Form.Group>.
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Deskripsi / Catatan </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Jelaskan disini..."
                                    name="DESCRIPTION"
                                    onChange={ocCategory}
                                />
                            </Form.Group>.
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formButton">
                                <Button variant="primary" type="submit"><FaSave/> SIMPAN</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>


        <Modal show={ModalSubCategory} size="md" onHide={CloseModalSubCategory}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title>{dataSubCategory.ID==='' ? 'Tambah' : 'Edit'} SubCategory</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Kategori</Form.Label>
                                <Form.Control type="text" name="NAME_CATEGORY" value={dataSubCategory.NAME_CATEGORY}  readOnly={true}/>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>SubCategory</Form.Label>
                                <Form.Control type="text" name="TITLE" onChange={ocSubCategory}/>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Prioritas</Form.Label>
                                <Form.Select name="PRIORITY" onChange={ocSubCategory}>
                                    <option value={""} disabled selected>Pilih Level Prioritas</option>
                                    <option value={"1"} className="text-danger">🔴 TINGGI</option>
                                    <option value={"2"} className="text-warning">🟡 MODERATE</option>
                                    <option value={"3"} className="text-success">🟢 RENDAH</option>
                                    
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Batas Waktu Proses</Form.Label>
                                <Form.Control type="time" name="PROCESS_HOUR" onChange={ocSubCategory}/>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-0" controlId="formDescription">
                                <Form.Label>Deskripsi / Catatan</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Jelaskan disini..."
                                    name="DESCRIPTION"
                                    onChange={ocSubCategory}
                                />
                            </Form.Group>.
                        </Col>
                        <Col lg={12} className="mb-3">
                            <Form.Check // prettier-ignore
                                type='switch'
                                id="radio-visible"
                                name="VISIBLE"
                                onChange={ocSubCategory}
                                label={`Tampilkan dalam aplikasi`}
                            />
                        </Col>
                        <Col lg={12} className="mb-3">
                            <Form.Check // prettier-ignore
                                type='switch'
                                id="radio-callback"
                                name="CALLBACK"
                                onChange={ocSubCategory}
                                label={`Aktifkan panggilan balik`}
                            />
                        </Col>
                        <Col lg={12} className="mb-3">
                            <Form.Check // prettier-ignore
                                type='switch'
                                id="radio-evaluation"
                                name="EVALUATION"
                                onChange={ocSubCategory}
                                label={`Aktifkan penilaian`}
                            />
                        </Col>
                        <Col lg={12} className="mb-3">
                            <Form.Check // prettier-ignore
                                type='switch'
                                id="radio-anonymous"
                                name="ANONYMOUS"
                                onChange={ocSubCategory}
                                label={`Ijinkan Anonim di Aplikasi`}
                            />
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formButton">
                                <Button variant="primary" type="submit"><FaSave/> SIMPAN</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>


        </>
    )
}

export default GrievanceCategory;