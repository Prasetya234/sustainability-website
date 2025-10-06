import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCircle, FaPlus, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";

const GrievanceCategory = () => {
    const { value }                                 = useContext(AuthContext);
    const [ ModalSubCategory, setModalSubCategory ] = useState(false);
    const [ ModalCategory, setModalCategory ]       = useState(false);
    const [ ModalAdmin, setModalAdmin ]             = useState(false);
    const [ ModalDelete, setModalDelete ]           = useState(false);
    const [ ListPerusahaan, setListPerusahaan ]     = useState([]);
    const [ ListCategory, setListCategory]          = useState([]);
    const [ ListSubCategory, setListSubCategory ]   = useState([]);
    const [ ListUser, setListUser ]                 = useState([]);
    const [ activeDropCat, setActiveDropCat ]       = useState(null);
    const [ activeDropSubCat, setActiveDropSubCat ] = useState(null);
    const [ dataCategory, setDataCategory ]         = useState({ ID:'', ID_COMPANY:'', TITLE:'', DESCRIPTION:''});
    const [ dataSubCategory, setDataSubCategory ]   = useState({ ID:'', ID_CATEGORY: 0, NAME_CATEGORY:'', ID_COMPANY: '', TITLE: '', DESCRIPTION: "", PRIORITY: 1, PROCESS_HOUR: 0});
    const [ dataAdmin, setDataAdmin ]               = useState({ ID_CATEGORY:'', ID_SUBCATEGORY:'', LIST_ADMIN:[] });
    const [ dataDelete, setDataDelete ]             = useState({});
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



    const OpenModalCategory = (id) => {
        setModalCategory(true);
        if(id>0){
            const category = ListCategory.find(item => item.ID === id);
            setDataCategory(category);
        }
    }

    const OpenModalDelete = (id, idcategory) => {
        if(id===0 && idcategory>0){
            const dataCategory = ListCategory.filter(item => item.ID === idcategory);
            setDataDelete((prevData) => ({
                ...prevData,
                TYPE: 'CATEGORY',
                ID_COMPANY: dataCategory[0].ID_COMPANY,
                ID_CATEGORY: idcategory,
                NAME_CATEGORY: dataCategory[0].TITLE,
                UPDATE_BY: IDUser
            }));    
        }
        if(id>0 && idcategory>0){
            const dataCategory      = ListCategory.filter(cat => cat.ID === idcategory);
            const dataSubcategory   = ListSubCategory.filter(item => item.ID === id);
            setDataDelete((prevData) => ({
                ...prevData,
                TYPE: 'SUBCATEGORY',
                ID_COMPANY: dataCategory[0].ID_COMPANY,
                ID_CATEGORY: idcategory,
                NAME_CATEGORY: dataCategory[0].TITLE,
                ID_SUBCATEGORY: id,
                NAME_SUBCATEGORY: dataSubcategory[0].TITLE,
                UPDATE_BY: IDUser
            }));    
        }
        setModalDelete(true);
    }

    const CloseModalDelete = () => {
        setDataDelete({});
        setModalDelete(false);
    }
    
    const CloseModalCategory = () => {
        setModalCategory(false);
    }

    const OpenModalSubCategory = (id, idcategory) => {
        setModalSubCategory(true);
        if(id===0){
            const selectedCategory = ListCategory.filter(cat => cat.ID === idcategory);
            setDataSubCategory((prevData) => ({
                ...prevData,
                ID_CATEGORY: selectedCategory[0].ID,
                ID_SUBCATEGORY: idcategory,
                ID_COMPANY: selectedCategory[0].ID_COMPANY, 
                NAME_CATEGORY: selectedCategory[0].TITLE
            }));
        } else {
            
            const selectedCategory = ListCategory.filter(cat => cat.ID === idcategory);
            const subcategory = ListSubCategory.find(item => item.ID === id);
            setDataSubCategory(subcategory);
            if(selectedCategory.length>0){
                setDataSubCategory((prevData) => ({
                    ...prevData,
                    NAME_CATEGORY: selectedCategory[0].TITLE
                }));
            }
            
        }
    }

    const OpenModalAdmin = async(idsubcategory) => {
        const selectedSubCategory   = ListSubCategory.filter(cat => cat.ID === idsubcategory);
        const getListUser           = await axios.get(`/user?id_perusahaan=${selectedSubCategory[0].ID_COMPANY}`); 
        const getExistingAdmin      = await axios.get(`/grievance/admin?idcategory=${selectedSubCategory[0].ID_CATEGORY}&idsubcategory=${idsubcategory}`);
        setListUser(getListUser.data);
        setDataAdmin((prevData) => ({
            ...prevData,
            ID_CATEGORY: selectedSubCategory[0].ID_CATEGORY,
            ID_SUBCATEGORY: idsubcategory,
            NAME_SUBCATEGORY: selectedSubCategory[0].TITLE,
            LIST_ADMIN: getExistingAdmin.data.data
        }));
        setModalAdmin(true);
    }

    const CloseModalSubCategory = () => {
        setModalSubCategory(false);
        setDataSubCategory({ ID:'', ID_CATEGORY: 0, NAME_CATEGORY:'', ID_COMPANY: '', TITLE: '', DESCRIPTION: "", PRIORITY: 1, PROCESS_HOUR: 0});
    }

    const CloseModalAdmin = () => {
        setDataAdmin({ ID_CATEGORY:'', ID_SUBCATEGORY:'', LIST_ADMIN:[] });
        setModalAdmin(false);
            
    }

    const actionListCategory = (id) => {
        return [
          { actionLable: "Edit", actExe: () => OpenModalCategory(id)},
          { actionLable: "Delete", actExe:  () => OpenModalDelete(0, id) },
        ];
    }

    const actionListSubCategory = (id, idcategory) => {
        return [
            { actionLable: "Edit", actExe: () => OpenModalSubCategory(id, idcategory)},
            { actionLable: "Set Administrator", actExe: () => OpenModalAdmin(id)},
            { actionLable: "Delete", actExe:  () => OpenModalDelete(id, idcategory) },
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
            CREATE_BY: IDUser,
            ID_COMPANY: IDCompany
        }));
    }

    const ocSubCategory = (event) => {
        const { name, value, checked } = event.target;
        switch(name){
            case 'VISIBLE':
                const newValueVisible = checked===true ? 'Y':'N';
                setDataSubCategory((prevData) => ({
                    ...prevData,
                    VISIBLE: newValueVisible
                }));
            break;
            case 'ANONYMOUS':
                const newValueAnonymous = checked===true ? 1:0;
                setDataSubCategory((prevData) => ({
                    ...prevData,
                    ANONYMOUS: newValueAnonymous
                }));
            break;
            case 'CALLBACK':
                const newValueCallback = checked===true ? 1:0;
                setDataSubCategory((prevData) => ({
                    ...prevData,
                    CALLBACK: newValueCallback
                }));
            break;
            case 'EVALUATION':
                const newValueEvaluation = checked===true ? 1:0;
                setDataSubCategory((prevData) => ({
                    ...prevData,
                    EVALUATION: newValueEvaluation
                }));
            break;
            default:
                setDataSubCategory((prevData) => ({
                    ...prevData,
                    [name]: value,
                    CREATE_BY: IDUser
                }));
            break;
        }
    }

    const ocAdmin = (event, userID) => {
        const { name, checked, value } = event.target;
        const valueChecked  = checked ? 'Y' : 'N';
        const valueInput    = value;

        setDataAdmin((prevData) => {
    
            // Check if user already exists in LIST_ADMIN
            const existingIndex = prevData.LIST_ADMIN.findIndex(obj => obj.USER_ID === userID);
            
            if (existingIndex !== -1) {
                let updatedAdminList;
                if(name==='EMP_USERNAME'){
                    // Update existing object
                    updatedAdminList = prevData.LIST_ADMIN.map((admin, index) =>
                        index === existingIndex ? { ...admin, [name]: valueInput } : admin
                    );
                    return { ...prevData, LIST_ADMIN: updatedAdminList, CREATE_BY: IDUser };
                } else {
                    // Update existing object
                    updatedAdminList = prevData.LIST_ADMIN.map((admin, index) =>
                        index === existingIndex ? { ...admin, [name]: valueChecked } : admin
                    );
                    return { ...prevData, LIST_ADMIN: updatedAdminList, CREATE_BY: IDUser };
                }
            } else {
                // Insert new object
                let newAdmin;
                if(name==='EMP_USERNAME'){
                    newAdmin = { USER_ID: userID, [name]: valueInput };
                    return { ...prevData, LIST_ADMIN: [...prevData.LIST_ADMIN, newAdmin], CREATE_BY: IDUser };
                } else {
                    newAdmin = { USER_ID: userID, [name]: valueChecked };
                    return { ...prevData, LIST_ADMIN: [...prevData.LIST_ADMIN, newAdmin], CREATE_BY: IDUser };
                }
                
            }
        });
    }

    
    const submitCategory = async(event) => {
        event.preventDefault();
        const tryPost = await axios.post('/grievance/category', { dataCategory: dataCategory });
        if(tryPost.status === 200){
            toast.success(tryPost.data.messages);
            setDataCategory({ ID:'', ID_COMPANY:'', TITLE:'', DESCRIPTION:''});
            setModalCategory(false);
            await getCategory();
            await getSubCategory();
        } else {
            toast.error(tryPost.data.messages);
        }
    }

    const submitSubCategory = async(event) => {
        event.preventDefault();
        const tryPost = await axios.post('/grievance/subcategory', { dataSubCategory: dataSubCategory });
        if(tryPost.status === 200){
            await getCategory();
            await getSubCategory();
            setDataSubCategory({ ID:'', ID_CATEGORY: 0, NAME_CATEGORY:'', ID_COMPANY: '', TITLE: '', DESCRIPTION: "", PRIORITY: 1, PROCESS_HOUR: 0});
            setModalSubCategory(false);
            toast.success(tryPost.data.messages);
            
        } else {
            toast.error(tryPost.data.messages);
        }
    }

    const submitAdmin = async(event) => {
        event.preventDefault();
        const tryPost = await axios.post('/grievance/admin', { dataAdmin: dataAdmin });
        if(tryPost.status === 200){
            await getCategory();
            await getSubCategory();
            setDataAdmin({ ID_CATEGORY:'', ID_SUBCATEGORY:'', LIST_ADMIN:[] });
            setModalAdmin(false);
            toast.success(tryPost.data.messages);
            
        } else {
            toast.error(tryPost.data.messages);
        }
    }

    const submitDelete = async(event) => {
        event.preventDefault();
        if(dataDelete.TYPE==='CATEGORY'){
            const tryPost = await axios.post('/grievance/delete-category', { dataDelete: dataDelete });
            if(tryPost.status === 200){
                toast.success(tryPost.data.messages);
                setDataDelete({});
                setModalDelete(false);
                await getCategory();
                await getSubCategory();
            } else {
                toast.error(tryPost.data.messages);
            }
        }
        if(dataDelete.TYPE==='SUBCATEGORY'){
            const tryPost = await axios.post('/grievance/delete-subcategory', { dataDelete: dataDelete });
            if(tryPost.status === 200){
                toast.success(tryPost.data.messages);
                setDataDelete({});
                setModalDelete(false);
                await getCategory();
                await getSubCategory();
            } else {
                toast.error(tryPost.data.messages);
            }
        }
        
    }


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
                    <Button variant={"primary"} size="sm" onClick={() => OpenModalCategory(0)}><FaPlus/> </Button> 
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
                                            <b><Button size="sm" variant="light" onClick={() => OpenModalSubCategory(0, item.ID)}><FaPlus/></Button>&nbsp; &nbsp;{item.TITLE}</b>
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
                                                    dropdownId={`dropdown${subItem.ID}`}
                                                    items={actionListSubCategory(subItem.ID, item.ID)}
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
                                <Form.Select name="ID_COMPANY" defaultValue={dataCategory.ID_COMPANY} onChange={ocCategory}>
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
                                <Form.Control type="text" name="TITLE" defaultValue={dataCategory.TITLE} onChange={ocCategory} required={true}/>
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
                                    defaultValue={dataCategory.DESCRIPTION}
                                    onChange={ocCategory}
                                />
                            </Form.Group>
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
            <Form onSubmit={submitSubCategory}>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title>{dataSubCategory.ID==='' ? 'Tambah' : 'Edit'} SubCategory</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Categori</Form.Label>
                                <Form.Control type="text" name="NAME_CATEGORY" defaultValue={dataSubCategory.NAME_CATEGORY}  readOnly={true}/>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>SubCategory</Form.Label>
                                <Form.Control type="text" name="TITLE" defaultValue={dataSubCategory.TITLE} onChange={ocSubCategory}/>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Prioritas</Form.Label>
                                <Form.Select name="PRIORITY" defaultValue={dataSubCategory.PRIORITY} onChange={ocSubCategory}>
                                    <option value={""} disabled selected>Pilih Level Prioritas</option>
                                    <option value={"1"} className="text-danger">🔴 TINGGI</option>
                                    <option value={"2"} className="text-warning">🟡 MODERATE</option>
                                    <option value={"3"} className="text-success">🟢 RENDAH</option>
                                    
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Batas Waktu Proses (Jam)</Form.Label>
                                <Form.Control type="number" name="PROCESS_HOUR" defaultValue={dataSubCategory.PROCESS_HOUR} onChange={ocSubCategory}/>
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
                                    defaultValue={dataSubCategory.DESCRIPTION}  
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
                                defaultChecked={dataSubCategory.VISIBLE==='Y' ? true:false }
                                label={`Tampilkan dalam aplikasi`}
                            />
                        </Col>
                        <Col lg={12} className="mb-3">
                            <Form.Check // prettier-ignore
                                type='switch'
                                id="radio-callback"
                                name="CALLBACK"
                                onChange={ocSubCategory}
                                defaultChecked={dataSubCategory.CALLBACK==='Y' ? true:false}
                                label={`Aktifkan panggilan balik`}
                            />
                        </Col>
                        <Col lg={12} className="mb-3">
                            <Form.Check // prettier-ignore
                                type='switch'
                                id="radio-evaluation"
                                name="EVALUATION"
                                defaultChecked={dataSubCategory.EVALUATION==='Y' ? true:false}
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
                                defaultChecked={dataSubCategory.ANONYMOUS==='Y' ? true:false}
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

        <Modal show={ModalAdmin} size="lg" onHide={CloseModalAdmin}>
            <Form onSubmit={submitAdmin}>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title> Admin Sub Category</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>SubCategory</Form.Label>
                                <Form.Control type="text" name="NAME_SUBCATEGORY" value={dataAdmin.NAME_SUBCATEGORY}  readOnly={true}/>
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>LIHAT</th>
                                        <th>RESPON</th>
                                        <th>FULL NAME</th>
                                        <th>USERNAME BACKEND</th>
                                        <th>USERNAME APLIKASI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ListUser &&
                                        ListUser.map((user, index) => {
                                        const isReadChecked = dataAdmin?.LIST_ADMIN?.some(
                                            (item) => item.USER_ID === user.USER_ID && item.READ === "Y"
                                        );

                                        const isWriteChecked = dataAdmin?.LIST_ADMIN?.some(
                                            (item) => item.USER_ID === user.USER_ID && item.WRITE === "Y"
                                        );

                                        const empUsername = dataAdmin?.LIST_ADMIN?.find(
                                            (item) => item.USER_ID === user.USER_ID && item.EMP_USERNAME !== ""
                                          )?.EMP_USERNAME || "";

                                        return (
                                            <tr key={index}>
                                            <td>
                                                <Form.Check
                                                type="checkbox"
                                                id={`checkuserread-${user.USER_ID}`} 
                                                name="READ"
                                                defaultChecked={isReadChecked} 
                                                onChange={(e) => ocAdmin(e, user.USER_ID)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                type="checkbox"
                                                id={`checkuserwrite-${user.USER_ID}`} 
                                                name="WRITE"
                                                defaultChecked={isWriteChecked} 
                                                onChange={(e) => ocAdmin(e, user.USER_ID)}
                                                />
                                            </td>
                                            <td>{user.USER_INISIAL}</td>
                                            <td>{user.USER_NAME}</td>
                                            <td>
                                                <Form.Group className="mb-3" controlId="formCategory">
                                                    <Form.Control size={"sm"} type="text" onChange={(e) => ocAdmin(e, user.USER_ID)} defaultValue={empUsername} name="EMP_USERNAME"/>
                                                </Form.Group>    
                                            </td>
                                            </tr>
                                        );
                                        })}
                                    </tbody>

                            </Table>
                            
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

        <Modal show={ModalDelete} size="sm" onHide={CloseModalDelete}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title> HAPUS {dataDelete.TYPE}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12} className="mb-3">
                            Apakah Anda yakin akan menghapus <b>{dataDelete.TYPE} {dataDelete.TYPE==='CATEGORY' ? dataDelete.NAME_CATEGORY : dataDelete.NAME_SUBCATEGORY} </b>? 
                        </Col>
                        <Col lg={12} className="d-flex-1 text-center">
                            <Button variant="danger" onClick={submitDelete}>YA</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="secondary" onClick={CloseModalDelete}>TIDAK</Button>     
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>

        </>
    )
}

export default GrievanceCategory;