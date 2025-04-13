import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Form, Button, Card, Table } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import { FaFileExcel } from 'react-icons/fa'
import moment from 'moment'
import axios from "../axios/axios.js";
import { AuthContext } from '../auth/AuthProvider'
import NewDropDown from "../partial/NewDropDown";


const NewsContent = () => {
    const [ NewsPeriode, setNewsPeriode ] = useState({startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')});
    const [ NewsList, setNewsList ] = useState([]);
    const [ activeDropdown, setActiveDropdown ] = useState(null);
    const { value } = useContext(AuthContext);
    const IDCompany = value.idPerusahaan;
    const IDUser = value.userId;
    
    
    const getNewsList = async (idPerusahaan, startDate, endDate) => {
        try {
            const response = await axios.get(`/news/news/${idPerusahaan}/${startDate}/${endDate}`);
            if (response.status === 200) {
                setNewsList(response.data.data);
            } else {
                setNewsList([]);
            }
        } catch(err){
            console.log(err);
        }
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setNewsPeriode((prevState) => ({
            ...prevState,
            [name]: value
        }));
        switch (name) {
            case "StartDate":
                getNewsList(IDCompany, value, NewsPeriode.endDate);
            break;
            case "EndDate":
                getNewsList(IDCompany, NewsPeriode.startDate, value);
            break;
            default:
                break;
        }

    }

    const actionList = (id) => {
        return [
          { actionLable: "Edit", actExe: () => console.log("Edit")},
          { actionLable: "Hapus", actExe: () => console.log("Hapus")},
        ];
    }


    useEffect(() => {
        getNewsList(IDCompany, NewsPeriode.startDate, NewsPeriode.endDate);
    }
    , [IDCompany, NewsPeriode.startDate, NewsPeriode.endDate]);

  return (
    <div>
        <Row className="m-0 mt-2">
            <Col>
                <CardShadow>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formStartDate">
                                        <Form.Label>Tanggal Awal</Form.Label>
                                        <Form.Control size="sm" type="date" defaultValue={NewsPeriode.startDate} name="StartDate" onChange={handleDateChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEndDate">
                                        <Form.Label>Tanggal Akhir</Form.Label>
                                        <Form.Control size="sm" type="date" defaultValue={NewsPeriode.endDate} name="EndDate" onChange={handleDateChange}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEndDate">
                                        <Form.Label>Kategori</Form.Label>
                                        <Form.Select size="sm" name="NewsCategory">
                                            <option value="">Semua Kategori</option>
                                            <option value="1">Kategori 1</option>
                                            <option value="2">Kategori 2</option>
                                            <option value="3">Kategori 3</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>         
                        </div>
                        <div>
                            <Button size="sm" variant="success"><FaFileExcel /> Download XLS</Button>
                        </div>  
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        <Row>
                            <Col sm={12}>
                                <Table hover size="sm">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Kategori</th>
                                            <th className="text-center">Judul</th>
                                            <th className="text-center">Tanggal Posting</th>
                                            <th className="text-center">Diposting Oleh</th>
                                            <th className="text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {NewsList && NewsList.map((item, index) => (
                                            <tr key={index}>
                                                <td className="py-3 text-center">{item.NEWS_CAT_NAME}</td>
                                                <td className="py-3 text-center">{item.TITLE}</td>
                                                <td className="py-3 text-center">{moment(item.CREATE_DATE).format('DD/MM/YYYY')}</td>
                                                <td className="py-3 text-center">{item.CREATE_BY}</td>
                                                <td className="py-3 text-center">
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
                </CardShadow>
            </Col>
        </Row>
    </div>  
    )
}

export default NewsContent;