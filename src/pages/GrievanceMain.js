import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Table, Form, Modal, Button } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";
import { Link, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import { FaFileExcel } from "react-icons/fa6";
import { AuthContext } from "../auth/AuthProvider.js";


const GrievanceMain = () => {
    const navigate                                  = useNavigate();
    const { value } = useContext(AuthContext);
    const { userId } = value;
    const IDCompany                                     = value.idPerusahaan;
    
    const [ Periode, setPeriode ]                   = useState({ StartDate: moment().subtract(7, "days").format("YYYY-MM-DD"), EndDate: moment().format('YYYY-MM-DD')});
    const [ dataGrievance, setDataGrievance ]       = useState([]);
    const [ accessGrievance, setAccessGrievance ]     = useState([]);
    const [ activeDropdown, setActiveDropdown ]     = useState(null);
    const [ ModalInfoSender, setModalInfoSender ]   = useState(false);
    const [ DataSender, setDataSender ]             = useState({});

    const getDataGrievance = async(company, start, end) => {
        try {
            const response = await axios.get(`/grievance/list/${company}/${start}/${end}`);
            if(response.status===200){
                setDataGrievance(response.data.data);
            }
        } catch(err){
            console.log(err);
        }
    }

    const getGrievanceAccess = async() => {
        try {
            const response = await axios.get(`/grievance/access/${userId}`);
            if(response.status===200){
                setAccessGrievance(response.data.data);
            }
        } catch(err){
            console.log(err);
        }
        return [];
    }

    const onDeleteGrv  = async(id) => {
        try {
            const tryDelete = await axios.put(`/mobile/grievance/delete`, {dataDelete: {
                GRV_DELETE_BY: `${userId}`,
                GRV_ID: `${id}`
            }});
            if(tryDelete.status===200){
                await getDataGrievance(Periode.StartDate, Periode.EndDate);
            }
        } catch(err){
            console.log(err);
        }
    }

    const selectPeriode = async(event) => {
        const { name, value } = event.target;
        if(name==='StartDate'){
            await getDataGrievance(IDCompany, value, Periode.EndDate);  
        }
        if(name==='EndDate'){
            await getDataGrievance(IDCompany, Periode.StartDate, value);  
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

    const actionList = (id) => {
        return [
          { actionLable: "Detail", actExe: () => navigate(`/grievance-response?id=${id}`)},
          { actionLable: "Hapus", actExe: () => onDeleteGrv(id)},
        ];
    }

    const OpenModalSender = async(event, id) => {
        event.preventDefault();
        const selectedGrv = dataGrievance.filter(item => item.GRV_ID === id);
        const checkID = await axios.get(`/employee/emp-check-id/${selectedGrv[0].GRV_COMPANY}/${selectedGrv[0].GRV_SUBMIT_BY}`);
        setDataSender(checkID.data.data);
        setModalInfoSender(true);
    }

    const exportXLSSummary = async () => {
        const response      = await axios.get(`/grievance/recap/${IDCompany}/${Periode.StartDate}/${Periode.EndDate}`);
        if(response.status===200){
            const workbook      = new ExcelJS.Workbook();
            const worksheet     = workbook.addWorksheet('Sheet1');
            worksheet.columns = [
                { header: "Grievance Status", key: "GRIEVANCE_STATUS", width: 20 },
                { header: "Grievance Date", key: "GRIEVANCE_DATE", width: 20, style: { numFmt: 'dd-mm-yyyy hh:mm:ss' } },
                { header: "Grievance Submit By", key: "GRIEVANCE_SUBMIT_BY", width: 25 },
                { header: "Grievance Category", key: "GRIEVANCE_CATEGORY", width: 25 },
                { header: "Grievance Subcategory", key: "GRIEVANCE_SUBCATEGORY", width: 25 },
                { header: "Grievance Title", key: "GRIEVANCE_TITLE", width: 30 },
                { header: "Grievance Description", key: "GRIEVANCE_DESCRIPTION", width: 40 },
                { header: "Grievance Response", key: "GRIEVANCE_RESPONSE", width: 40 },
                { header: "Grievance Response By", key: "GRIEVANCE_RESPONSE_BY", width: 20 },
                { header: "Grievance Response Date", key: "GRIEVANCE_RESPONSE_DATE", width: 20, style: { numFmt: 'dd-mm-yyyy hh:mm:ss' } },
                { header: "Grievance Close By", key: "GRIEVANCE_CLOSE_BY", width: 20 },
                { header: "Grievance Close Date", key: "GRIEVANCE_CLOSE_DATE", width: 20, style: { numFmt: 'dd-mm-yyyy hh:mm:ss' } },
            ];
            const transformData = (row) => {
                if (row.GRIEVANCE_DATE) row.GRIEVANCE_DATE  = moment(row.GRIEVANCE_DATE).format('YYYY-MM-DD HH:mm:ss');
                if (row.GRIEVANCE_RESPONSE_DATE) row.GRIEVANCE_RESPONSE_DATE  = moment(row.GRIEVANCE_RESPONSE_DATE).format('YYYY-MM-DD HH:mm:ss');
                if (row.GRIEVANCE_CLOSE_DATE) row.GRIEVANCE_CLOSE_DATE  = moment(row.GRIEVANCE_CLOSE_DATE).format('YYYY-MM-DD HH:mm:ss');
                
                return row;
            };
        
            response.data.data.forEach(row => { worksheet.addRow(transformData(row)); });
            const buffer        = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `Grievance-Recap.xlsx`);
        }
    };



    useEffect(() => {
        const InitDataGrievance = async() => {
            const start = moment().subtract(7, "days").format("YYYY-MM-DD");
            const end   = moment().format('YYYY-MM-DD');
            await getDataGrievance(IDCompany, start, end);
            await getGrievanceAccess(userId);
        };
        InitDataGrievance();
    }, [IDCompany, userId])

    console.log(accessGrievance);

    // Convert permission subcategory IDs to string for comparison
    const allowedSubcategoryIds = accessGrievance.map(p => String(p.ID_SUBCATEGORY));

    // Filter grievances that match allowed subcategory IDs
    const filteredGrievances = dataGrievance.filter(g => 
        allowedSubcategoryIds.includes(g.GRV_SUBCATEGORY_ID)
    );
    
    return (
        <>
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
                        <Button size="sm" variant="success" onClick={exportXLSSummary}><FaFileExcel /> Download XLS</Button>
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
                                        <th style={{width:'10%'}}>TANGGAL POSTING</th>
                                        <th style={{width:'10%'}}>PENGIRIM</th>
                                        <th style={{width:'20%'}}>TOPIK</th>
                                        <th style={{width:'10%'}}>KATEGORI</th>
                                        <th style={{width:'10%'}}>SUBKATEGORI</th>
                                        <th style={{width:'10%'}}>BATAS WAKTU PROSES</th>
                                        <th>OPSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { filteredGrievances && filteredGrievances.map((item,index) => (
                                        <tr key={index} onDoubleClick={()=> navigate(`/grievance-response?id=${item.GRV_ID}`)}>
                                            <td className="py-3" style={{width:'10%'}}>{SignPriorityCat(item.GRV_PRIORITY)}</td>
                                            <td className="py-3" style={{width:'10%'}}>{item.GRV_STATUS}</td>
                                            <td className="py-3" style={{width:'10%'}}>{moment(item.GRV_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td className="py-3" style={{width:'10%'}}>
                                                {item.GRV_SUBMIT_NAME==='ANONYM' ? item.GRV_SUBMIT_NAME :  <Link to="#" onClick={(e)=> OpenModalSender(e, item.GRV_ID)}>{item.GRV_SUBMIT_NAME}</Link>} 
                                            </td>
                                            <td className="py-3" style={{width:'20%'}}>{item.GRV_TITLE}</td>
                                            <td className="py-3" style={{width:'10%'}}>{item.GRV_CATEGORY_NAME}</td>
                                            <td className="py-3" style={{width:'10%'}}>{item.GRV_SUBCATEGORY_NAME}</td>
                                            <td className="py-3" style={{width:'10%'}}>{moment(item.GRV_DEADLINE_PROCESS).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td className="py-3">
                                                <NewDropDown
                                                    label={"Opsi"}
                                                    dropdownId={`dropdown${index}`}
                                                    items={actionList(item.GRV_ID)}
                                                    activeDropdown={activeDropdown}
                                                    setActiveDropdown={setActiveDropdown}
                                                />
                                            </td>
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

        <Modal show={ModalInfoSender} size="sm" onHide={()=> setModalInfoSender(false)}>
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title> Info Pengirim </Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12} className="mb-3">
                            <Table>
                                    <tr>
                                        <td>ID</td>
                                        <td>: {DataSender.EMP_ID}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama Lengkap</td>
                                        <td>: {DataSender.EMP_FULL_NAME}</td>
                                    </tr>
                                    <tr>
                                        <td>Gender</td>
                                        <td>: {DataSender.EMP_GENDER==='M' ? 'Laki-Laki':'Perempuan'}</td>
                                    </tr>
                                    <tr>
                                        <td>Tanggal Masuk</td>
                                        <td>: {moment(DataSender.EMP_ONBOARDING_DATE).format('DD-MM-YYYY')}</td>
                                    </tr>
                                    <tr>
                                        <td>DEPARTEMEN</td>
                                        <td>: {DataSender.EMP_DEPARTMENT}</td>
                                    </tr>
                                    <tr>
                                        <td>Jabatan</td>
                                        <td>: {DataSender.EMP_JOB_TITLE}</td>
                                    </tr>
                            </Table> 
                        </Col>
                    </Row>
                </Modal.Body>
        </Modal>

        </>
    )
}

export default GrievanceMain;