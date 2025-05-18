import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Form, Button, Image,Modal } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";
import { FaFileExcel } from "react-icons/fa6";
import { AuthContext } from "../auth/AuthProvider.js";
import { FaArrowLeft, FaReply } from "react-icons/fa";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';


const InvestigationMain = () => {
    const { value } = useContext(AuthContext);
    const { userId } = value;
    const [ Periode, setPeriode ]                   = useState({ StartDate: moment().subtract(7, "days").format("YYYY-MM-DD"), EndDate: moment().format('YYYY-MM-DD')});
    const [ dataInvestigation, setDataInvestigation ]       = useState([]);
    const [ dataResponse, setDataResponse ]             = useState([]);
    const [ detailInvestigation, setDetailInvestigation ]       = useState({});
    const [ detailResponse, setDetailResponse ] = useState({INVS_RES_MESSAGE:''});
    const [ Mode, setMode ] = useState('List');
    const [ image1, setImage1 ]         = useState(null);
    const [ image2, setImage2 ]         = useState(null);
    const [ image3, setImage3 ]         = useState(null);
    const [ ModalCloseInvestigation, setModalCloseInvestigation ] = useState(false);
    const [ ModalCloseInvestigationNGrievance, setModalCloseInvestigationNGrievance ] = useState(false);
    
    const getImageGrievance = async(id, tipe, filename) => {
        try {
            const imageData = await axios.get(`/grievance/image/${id}/${tipe}/${filename}`, { responseType: "blob" });
            if(imageData.status===200){
                switch(tipe){
                    case 1:
                        const blob1 = await imageData.data; // Convert response to Blob
                        const url1 = URL.createObjectURL(blob1); // Create URL for Blob
                        setImage1(url1);
                    break;
                    case 2:
                        const blob2 = await imageData.data; // Convert response to Blob
                        const url2 = URL.createObjectURL(blob2); // Create URL for Blob
                        setImage2(url2);
                    break;
                    case 3:
                        const blob3 = await imageData.data; // Convert response to Blob
                        const url3 = URL.createObjectURL(blob3); // Create URL for Blob
                        setImage3(url3);
                    break;
                    default:
                        console.log('Tipe tidak ditemukan');
                    break;
                }
            }
        } catch(err){
            console.log(err);
        }             
    }


    const getDataInvestigation = async(start, end) => {
        try {
            const response = await axios.get(`/investigation/find-by-date/${start}/${end}`);
            if(response.status===200){
                setDataInvestigation(response.data.data);
            }
        } catch(err){
            console.log(err);
        }
    }

    const getDataInvestigationById = async(id) => {
        try {
            const response = await axios.get(`/investigation/find-by-id/${id}`);
            if(response.status===200){
                setDetailInvestigation(response.data.data[0]);
                if(response.data.data[0].GRV_MEDIA_1_FILENAME){
                    getImageGrievance(response.data.data[0].GRV_ID, 1, response.data.data[0].GRV_MEDIA_1_FILENAME);
                }
                if(response.data.data[0].GRV_MEDIA_2_FILENAME){
                    getImageGrievance(response.data.data[0].GRV_ID, 2, response.data.data[0].GRV_MEDIA_2_FILENAME);
                }
                if(response.data.data[0].GRV_MEDIA_3_FILENAME){
                    getImageGrievance(response.data.data[0].GRV_ID, 3, response.data.data[0].GRV_MEDIA_3_FILENAME);
                }
            }
        } catch(err){
            console.log(err);
        }
    }

    const getDataInvestigationResponById = async(id) => {
        try {
            const response = await axios.get(`/investigation/respons/find-by-id/${id}`);
            if(response.status===200){
                setDataResponse(response.data.data);
            }
        } catch(err){
            console.log(err);
        }
    }

    
    
    const selectPeriode = async(event) => {
        const { name, value } = event.target;
        if(name==='StartDate'){
            await getDataInvestigation(value, Periode.EndDate);  
        }
        if(name==='EndDate'){
            await getDataInvestigation(Periode.StartDate, value);  
        }
        setPeriode({ ...Periode, [name]: value });
    }

    const SignPriorityCat = (id) => {
        let status;
        switch(id){
            case 1:
                status = '🔴 TINGGI';
            break;
            case 2:
                status = '🟡 MODERATE';
            break;
            case 3:
                status = '🟢 RENDAH';
            break;
            default:
                status = '🟢 RENDAH';
            break;
        }
        return status;
    }

    const onClickDetail = async(id) => {
        try {
            setMode('Detail');
            await getDataInvestigationById(id);
            await getDataInvestigationResponById(id);
        } catch(err){
            console.log(err);
        }
    }

    const ocPostMessage = async(event) => {
        event.preventDefault();
        const { value } = event.target;
        console.log(value);
        const data = {
            INVS_ID: detailInvestigation.INVS_ID,
            INVS_RES_CREATE_BY: userId,
            INVS_RES_MESSAGE: value,
        };
        setDetailResponse(data);
    }

    
    const postMessage = async() => {
        try {   
            const response = await axios.post('/investigation/respons', { data: detailResponse});
            if(response.status===200){
                setDetailResponse({INVS_RES_MESSAGE:''});
                getDataInvestigationResponById(detailInvestigation.INVS_ID);
            }
        } catch(err){
            console.log(err);
        }
    }

    const closeInvestigation = async() => {
        try {
            const data = {
                INVS_ID: detailInvestigation.INVS_ID,
                INVS_STATUS: 'COMPLETE',
                INVS_UPDATE_BY: userId,
            };
            const response = await axios.post(`/investigation/update-status/${detailInvestigation.INVS_ID}`, { data: data });
            if(response.status===200){
                toast.success('Investigation telah ditutup');
                setModalCloseInvestigation(false);
                setDetailResponse({INVS_RES_MESSAGE:''});
                setMode('List');
                getDataInvestigation(Periode.StartDate, Periode.EndDate);
            }
        } catch(err){
            console.log(err);
        }
    }    


    const exportXLSSummary = async () => {
            const response      = await axios.get(`/investigation/report/${Periode.StartDate}/${Periode.EndDate}`);
            if(response.status===200){
                const workbook      = new ExcelJS.Workbook();
                const worksheet     = workbook.addWorksheet('Sheet1');
                worksheet.columns = [
                    { header: 'CATEGORY', key: 'CATEGORY' },
                    { header: 'SUBCATEGORY', key: 'SUBCATEGORY' },
                    { header: 'PRIORITY', key: 'PRIORITY' },
                    { header: 'PROCESS_TIME', key: 'PROCESS_TIME' },
                    { header: 'TITLE', key: 'GRV_TITLE' },
                    { header: 'DESCRIPTION', key: 'GRV_DESCRIPTION' },
                    { header: 'COMPANY', key: 'GRV_COMPANY' },
                    { header: 'GRV SUBMIT_BY', key: 'GRV_SUBMIT_BY' }, // IF clause result
                    { header: 'GRV SUBMIT_DATE', key: 'GRV_SUBMIT_DATE', style: { numFmt: 'dd-mm-yyyy hh:mm:ss' } },
                    { header: 'INVS STATUS', key: 'INVS_STATUS' },
                    { header: 'INVS CREATE BY', key: 'INVS_CREATE_NAME' },
                    { header: 'INVS CREATE DATE', key: 'INVS_CREATE_DATE', style: { numFmt: 'dd-mm-yyyy hh:mm:ss' } },
                    { header: 'INVS UPDATE BY', key: 'INVS_UPDATE_NAME' },
                    { header: 'INVS UPDATE DATE', key: 'INVS_UPDATE_DATE', style: { numFmt: 'dd-mm-yyyy hh:mm:ss' } },
                    { header: 'INVS RES MESSAGE', key: 'INVS_RES_MESSAGE' },
                    { header: 'INVS RES CREATE BY', key: 'INVS_RES_CREATE_NAME' },
                    { header: 'INVS RES CREATE DATE', key: 'INVS_RES_CREATE_DATE' },
                ];
                const transformData = (row) => {
                    if (row.GRV_SUBMIT_DATE) row.GRV_SUBMIT_DATE  = moment(row.GRV_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss');
                    if (row.INVS_CREATE_DATE) row.INVS_CREATE_DATE  = moment(row.INVS_CREATE_DATE).format('YYYY-MM-DD HH:mm:ss');
                    if (row.INVS_UPDATE_DATE) row.INVS_UPDATE_DATE  = moment(row.INVS_UPDATE_DATE).format('YYYY-MM-DD HH:mm:ss');
                    if (row.INVS_RES_CREATE_DATE) row.INVS_RES_CREATE_DATE  = moment(row.INVS_RES_CREATE_DATE).format('YYYY-MM-DD HH:mm:ss');
                    
                    return row;
                };
            
                response.data.data.forEach(row => { worksheet.addRow(transformData(row)); });
                const buffer        = await workbook.xlsx.writeBuffer();
                saveAs(new Blob([buffer]), `Investigation-Recap.xlsx`);
            }
        };
    
    


    

    useEffect(() => {
        const InitDataInvestigation = async() => {
            const start = moment().subtract(7, "days").format("YYYY-MM-DD");
            const end   = moment().format('YYYY-MM-DD');
            await getDataInvestigation(start, end);
        };
        InitDataInvestigation();
    }, [])

    
    return (
        <>
        { Mode === 'List' && (
            <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2">
            <Card className="border-0 ">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formStartDate">
                                    <Form.Control size="sm" type="date" defaultValue={Periode.StartDate} name="StartDate" onChange={selectPeriode}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                -
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formEndDate">
                                    <Form.Control size="sm" type="date" defaultValue={Periode.EndDate} name="EndDate" onChange={selectPeriode}/>
                                </Form.Group>
                            </Col>
                        </Row>         
                    </div>
                    <div>
                        <Button variant="success" size="sm" onClick={exportXLSSummary} className="me-2">
                            <FaFileExcel/> Export
                        </Button>
                    </div>  
                </Card.Header>
                <Card.Body className="text rounded shadow-sm">
                    <Row>
                        <Col sm={12}>
                            <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th style={{width:'10%'}}>PRIORITAS</th>
                                        <th style={{width:'10%'}}>STATUS</th>
                                        <th style={{width:'10%'}}>KATEGORI</th>
                                        <th style={{width:'10%'}}>SUBKATEGORI</th>
                                        <th style={{width:'10%'}}>BATAS WAKTU PROSES</th>
                                        <th style={{width:'10%'}}>TANGGAL SUBMIT</th>
                                        <th style={{width:'10%'}}>INVESTIGATOR</th>
                                        <th style={{width:'20%'}}>TOPIK</th>
                                        
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    { dataInvestigation && dataInvestigation.map((item,index) => (
                                        <tr key={item.INVS_ID} onDoubleClick={()=> onClickDetail(item.INVS_ID)}>
                                            <td className="py-3" style={{width:'10%'}}>{SignPriorityCat(item.PRIORITY)}</td>
                                            <td className="py-3" style={{width:'10%'}}>{item.INVS_STATUS}</td>
                                            <td className="py-3" style={{width:'10%'}}>{item.CATEGORY}</td>
                                            <td className="py-3" style={{width:'10%'}}>{item.SUBCATEGORY}</td>
                                            <td className="py-3" style={{width:'10%'}}>{moment(item.GRV_DEADLINE_PROCESS).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            
                                            <td className="py-3" style={{width:'10%'}}>{moment(item.INVS_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td className="py-3" style={{width:'10%'}}>
                                                {item.INVS_CREATE_NAME} 
                                            </td>
                                            <td className="py-3" style={{width:'20%'}}>{item.GRV_TITLE}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        )}

        { Mode === 'Detail' && (
            <Row className="mx-0 mt-3 bg-light">
                        <Col className="ps-3 p-2 bg-light" lg={9}>
                            <Card className="border-0 ">
                                <Card.Header className="align-items-center">
                                    <Row>
                                        <Col sm={12}>
                                            <h5><Button variant="danger" onClick={()=> setMode('List')} ><FaArrowLeft/></Button> Detail Investigation</h5>
                                        </Col>
                                        
                                    </Row>
                                    <Row>
                                        <Col sm={12} className="mt-3">
                                            <h1>{detailInvestigation.GRV_TITLE}</h1>
                                        </Col>
                                        <Col sm={12} className="mt-3">
                                            <p>{detailInvestigation.GRV_DESCRIPTION}</p>
                                        </Col>
                                        <Col sm={12} className="mt-3">
                                            <p>
                                            { detailInvestigation.GRV_MEDIA_1_FILENAME && (
                                                <Image src={image1} style={{maxWidth:'250px'}} />
                                            )}
                                            
                                            { detailInvestigation.GRV_MEDIA_2_FILENAME && (
                                                <Image src={image2} style={{maxWidth:'250px'}} />
                                            )}

                                            { detailInvestigation.GRV_MEDIA_3_FILENAME && (
                                                <Image src={image3} style={{maxWidth:'250px'}}/>
                                            )}
                                            
                                            
                                        </p>
                                        </Col>
                                    </Row>
                                    {dataResponse && dataResponse.map((item, index) => 
                                        <Row key={index}>
                                            <Col sm={12}>
                                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                                    <div dangerouslySetInnerHTML={{ __html: item.INVS_RES_MESSAGE }} />
                                                    <br/>
                                                    <p style={{textDecoration:'overline'}}><FaReply/> Direspon pada { moment(item.INVS_RES_CREATE_DATE).format('DD-MM-YYYY HH:mm:ss') || ''} oleh <i>{ item.INVS_RES_CREATE_NAME || ''}</i></p>
                                                </Card>
                                                <br/>
                                            </Col>
                                        </Row>
                                        )}
                                        { detailInvestigation.INVS_STATUS!=="COMPLETE" && (
                                        <Row>
                                            <Col sm={12}>
                                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                                    <Form.Group className="mb-3" controlId="formMessage">
                                                        <Form.Label>Pesan</Form.Label>
                                                        <Form.Control as="textarea" rows={3} value={detailResponse.INVS_RES_MESSAGE} onChange={ocPostMessage} />
                                                    </Form.Group>
                                                    <div className="d-grid gap-2">
                                                        <Button variant="primary" onClick={postMessage}>POST</Button>
                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>    
                                        )}
                                </Card.Header>
                            </Card>
                        </Col>
                        <Col className="ps-3 p-2" lg={3}>
                            <Card className="border-0 ">
                                <Card.Header className="align-items-center">
                                    <Row>
                                        <Col sm={12} className="mt-3">
                                            <Table>
                                                <tr>
                                                    <td className="py-2"><b>KATEGORI</b></td>
                                                    <td><b>: {detailInvestigation.CATEGORY}</b></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><b>SUB KATEGORI</b></td>
                                                    <td><b>: {detailInvestigation.SUBCATEGORY}</b></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><b>STATUS INVESTIGASI</b></td>
                                                    <td><b>: {detailInvestigation.INVS_STATUS}</b></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><b>PRIORITAS</b></td>
                                                    <td><b>: {SignPriorityCat(detailInvestigation.GRV_PRIORITY)}</b></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><b>BATAS WAKTU RESPON</b></td>
                                                    <td><b>: {moment(detailInvestigation.GRV_DEADLINE_PROCESS).format('DD-MM-YYYY HH:mm:ss')}</b></td>
                                                </tr>
                                                { detailInvestigation.INVS_STATUS==="COMPLETE" && (
                                                <tr>
                                                    <td className="py-2"><b>DITUTUP OLEH / WAKTU</b></td>
                                                    <td><b>: {detailInvestigation.INVS_UPDATE_NAME}  /  {moment(detailInvestigation.INVS_UPDATE_DATE).format('DD-MM-YYYY HH:mm:ss')}</b></td>
                                                </tr>
                                                )}
                                                <br/>
                                                { detailInvestigation.INVS_STATUS!=="COMPLETE" && (
                                                    <tr>
                                                        <td>
                                                            <div className="d-grid gap-2">
                                                                <Button variant="primary" onClick={()=> setModalCloseInvestigation(true)}>TUTUP INVESTIGASI</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                )}
                                                
                                            </Table>
                                            
                                        </Col>
                                    </Row>
                                </Card.Header>
                            </Card>
                        </Col>
                    </Row>
        )}


        <Modal show={ModalCloseInvestigation} onHide={() => setModalCloseInvestigation(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Konfirmasi Tutup Investigasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Apakah anda yakin ingin menutup investigasi ini ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalCloseInvestigation(false)}>
                    Batal
                </Button>
                <Button variant="primary" onClick={closeInvestigation}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>


        <Modal show={ModalCloseInvestigationNGrievance} onHide={() => setModalCloseInvestigationNGrievance(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Konfirmasi Tutup Investigasi & Grievance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Apakah anda yakin ingin menutup investigasi dan Grievance terkait ini ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalCloseInvestigationNGrievance(false)}>
                    Batal
                </Button>
                <Button variant="primary" onClick={closeInvestigation}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>

        
        </>
    )
}

export default InvestigationMain;