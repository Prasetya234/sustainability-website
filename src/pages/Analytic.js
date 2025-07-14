import React, { useContext, useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import { AuthContext } from '../auth/AuthProvider';
import axios from '../axios/axios';
import { FormatNumSTD } from '../component/utils/Utils';
import { toast } from 'react-toastify';
import moment from 'moment';

const Analytic = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;
  const [paramStatus, setParamStatus] = useState('date')
  const [cardPengguna, setCardPengguna] = useState({})
  const [monthVal, setMonthVal] = useState(moment().format('YYYY-MM'))

    function hdlParams(value){
        setParamStatus(value)
    }

    useEffect(() => {
     if(idPerusahaan){
        async function getDataCard(idPerusahaan){
            await axios.get(`/analytics/card/${idPerusahaan}`)
            .then(res => {
                if(res.status === 200){
                  setCardPengguna(res.data.data)
                }
            }).catch(err => {
                toast.error('Failed Get data card', {autoClose: 2000})
            })
        }

        getDataCard(idPerusahaan)
     }
    }, [idPerusahaan])
    

    function ChgMonth(e){
        const {value} = e.target
        setMonthVal(value)
    }

    function findPercentPengguna(objPengguna){
        if(objPengguna?.jumlahEmp && objPengguna?.jumlahEmpActive){
            const perCnt = (objPengguna.jumlahEmpActive/objPengguna.jumlahEmp)*100
            return perCnt.toFixed(2)
        }else{
            return 0
        }
    }
    function findPercentLastMonth(objPengguna){
        if(objPengguna?.totalLastMonth && objPengguna?.totalThisMonth){
            const perCnt = (objPengguna.totalThisMonth/objPengguna.totalLastMonth)*100
            return perCnt.toFixed(2)
        }else{
            return 0
        }
    }
  return (
    <Row className="m-0 mt-2 ms">
         <Col>
         <div className='ms-2'>
            <Row>
                <Col className='p-3 shadow rounded me-2 text-light' style={{background : `linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)`}}>
                    <Row>
                        <Col>
                            <div className='fw-bold mb-2'>
                                Jumlah Karyawan
                            </div>
                            <div className='fw-bold fs-3'>
                                {cardPengguna?.jumlahEmp ? FormatNumSTD(cardPengguna?.jumlahEmp) : 0}
                            </div>
                        </Col>
                        <Col>
                            <div className='fw-bold mb-2'>
                                Jumlah Pengguna
                            </div>
                            <div className='fw-bold fs-3'>
                                {cardPengguna?.jumlahEmpActive ? FormatNumSTD(cardPengguna?.jumlahEmpActive) : 0}
                            </div>
                        </Col>
                        <Col>
                            <div className='fw-bold mb-2'>
                                Pengguna Baru
                            </div>
                            <div className='fw-bold fs-3'>
                                {cardPengguna?.jumlahEmpNewActive ? FormatNumSTD(cardPengguna?.jumlahEmpNewActive) : 0}
                            </div>
                        </Col>
                    </Row>
                    <div>Tingkat pengguna aktif : {findPercentPengguna(cardPengguna)}% </div>
                </Col>
                <Col className='p-3 shadow rounded me-2 text-light' style={{background: `linear-gradient(to right, #2c3e50,rgb(119, 119, 119))`}}>
                    <Row>
                        <Col>
                            <div className='fw-bold mb-2'>
                                Pengguna Aktif Bulan Lalu
                            </div>
                            <div className='fw-bold fs-3'>
                                {cardPengguna?.totalLastMonth ? FormatNumSTD(cardPengguna?.totalLastMonth) : 0}
                            </div>
                        </Col>
                        <Col>
                            <div className='fw-bold mb-2'>
                                Pengguna Aktif Bulan Ini
                            </div>
                            <div className='fw-bold fs-3'>
                                {cardPengguna?.totalThisMonth ? FormatNumSTD(cardPengguna?.totalThisMonth) : 0}
                            </div>
                        </Col>
                        <Col>
                            <div className='fw-bold mb-2'>
                                Pengguna Aktif Hari Ini
                            </div>
                            <div className='fw-bold fs-3'>
                                {cardPengguna?.totalToday ? FormatNumSTD(cardPengguna?.totalToday) : 0}
                            </div>
                        </Col>
                    </Row>
                      <div>Tingkat pengguna aktif dibanding bulan sebelumnya : {findPercentLastMonth(cardPengguna)}% </div>
                </Col>
            </Row>
            
            <Row className='my-2'>
                <Col className='ps-0'>
                    <CardShadow >
                        <Row>
                            <Col sm={2}>
                              <Form.Control type="month" size='sm' value={monthVal} onChange={ChgMonth}/>
                            </Col>
                            <Col sm={2}>
                                <ButtonGroup size='sm'  aria-label="Basic example">
                                    <Button onClick={() => hdlParams('date')} variant={paramStatus === 'date' ? 'primary' : 'light'}>Hari</Button>
                                    <Button onClick={() => hdlParams('month')} variant={paramStatus === 'month' ? 'primary' : 'light'}>Bulan</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </CardShadow>
                </Col>
            </Row>
         </div>
        </Col>
    </Row>
  )
}

export default Analytic