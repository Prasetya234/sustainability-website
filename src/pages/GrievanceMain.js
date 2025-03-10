import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Form } from "react-bootstrap";
import moment from "moment";
import axios from "../axios/axios.js";
import NewDropDown from "../partial/NewDropDown";
import { useNavigate } from "react-router-dom";


const GrievanceMain = () => {
    const navigate                              = useNavigate();
    const [ Periode, setPeriode ]               = useState({ StartDate: moment().subtract(7, "days").format("YYYY-MM-DD"), EndDate: moment().format('YYYY-MM-DD')});
    const [ dataGrievance, setDataGrievance ]   = useState([]);
    const [ activeDropdown, setActiveDropdown ] = useState(null);

    const getDataGrievance = async(start, end) => {
        try {
            const response = await axios.get(`/grievance/list/${start}/${end}`);
            if(response.status===200){
                setDataGrievance(response.data.data);
            }
        } catch(err){
            console.log(err);
        }
    }

    const selectPeriode = async(event) => {
        const { name, value } = event.target;
        if(name==='StartDate'){
            await getDataGrievance(value, Periode.EndDate);  
        }
        if(name==='EndDate'){
            await getDataGrievance(Periode.StartDate, value);  
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
          { actionLable: "Edit", actExe: () => console.log(id)},
          { actionLable: "Delete", actExe:  () => console.log(0, id) },
        ];
    }

    useEffect(() => {
        const InitDataGrievance = async() => {
            const start = moment().subtract(7, "days").format("YYYY-MM-DD");
            const end   = moment().format('YYYY-MM-DD');
            await getDataGrievance(start, end);
        };
        InitDataGrievance();
    }, [])

    
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
                                _
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formEndDate">
                                    <Form.Control size="sm" type="date" defaultValue={Periode.EndDate} name="EndDate" onChange={selectPeriode}/>
                                </Form.Group>
                            </Col>
                        </Row>         
                    </div>
                    <div>
                        <Form.Group className="mb-3" controlId="formSearch">
                            <Form.Control type="text" placeholder="Pencarian..." name="Search"/>
                        </Form.Group>
                    </div>  
                </Card.Header>
                <Card.Body className="text rounded shadow-sm">
                    <Row>
                        <Col sm={12}>
                            <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th style={{width:'10%'}}>TANGGAL POSTING</th>
                                        <th style={{width:'10%'}}>PENGIRIM</th>
                                        <th style={{width:'30%'}}>TOPIK</th>
                                        <th style={{width:'10%'}}>KATEGORI</th>
                                        <th style={{width:'10%'}}>SUBKATEGORI</th>
                                        <th style={{width:'10%'}}>PRIORITAS</th>
                                        <th style={{width:'10%'}}>BATAS WAKTU PROSES</th>
                                        <th>OPSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { dataGrievance && dataGrievance.map((item,index) => (
                                        <tr key={index} onDoubleClick={()=> navigate(`/grievance-response?id=${item.GRV_ID}`)}>
                                            <td style={{width:'10%'}}>{moment(item.GRV_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td style={{width:'10%'}}>{item.GRV_SUBMIT_NAME}</td>
                                            <td style={{width:'30%'}}>{item.GRV_TITLE}</td>
                                            <td style={{width:'10%'}}>{item.GRV_CATEGORY_NAME}</td>
                                            <td style={{width:'10%'}}>{item.GRV_SUBCATEGORY_NAME}</td>
                                            <td style={{width:'10%'}}>{SignPriorityCat(item.GRV_PRIORITY)}</td>
                                            <td style={{width:'10%'}}>{moment(item.GRV_DEADLINE_PROCESS).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>
                                                <NewDropDown
                                                    label={"Opsi"}
                                                    dropdownId={`dropdown${index}`}
                                                    items={actionList(item.ID)}
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
        </>
    )
}

export default GrievanceMain;