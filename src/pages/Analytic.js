import React, { useContext, useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import { AuthContext } from '../auth/AuthProvider';
import axios from '../axios/axios';
import { FormatNumSTD } from '../component/utils/Utils';
import { toast } from 'react-toastify';
import moment from 'moment';
import ChartUserAnalis from '../component/compAnalytics/ChartUserAnalis';
import CompDateRangeWeek from '../partial/CompDateRangeWeek';

const initalsChar = {
    categories : [],
    series : [{
                name: "Total Pengguna",
                data: []
            }]
  }

const Analytic = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;
  const [typeParams, setTypeParams] = useState('date')
  const [cardPengguna, setCardPengguna] = useState({})
  const [chartPenggna, setChartPengguna] = useState(initalsChar)
  const [yearVal, setYearVal] = useState(moment().format('YYYY'))
  const [monthVal, setMonthVal] = useState(moment().format('YYYY-MM'))
  const [datehVal, setDateVal] = useState({
    start: moment(),
    end: moment(),
  })

 

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

        //inital data chart
          async function getDataAnalisPenggunaInit() {
            const startDate = moment().format('YYYY-MM-DD')
            const endDate = moment().format('YYYY-MM-DD')
           let url = `/analytics/chart-pengguna/${idPerusahaan}/date?startDate=${startDate}&endDate=${endDate}`

            await axios.get(url)
            .then(res => {
                if(res.status === 200){
                    const {categories, series} = res.data.data
                  setChartPengguna({
                        categories : categories,
                        series : [{
                                    name: "Total Pengguna",
                                    data: series
                                }]
                    })
                }else{
                    toast.warning(res.data.message, {autoClose: 2000})
                }
            }).catch(err => {
                toast.error('Failed Get data card', {autoClose: 2000})
            })
    }

        getDataCard(idPerusahaan)
        getDataAnalisPenggunaInit()
     }
    }, [idPerusahaan])
    


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

    async function getDataAnalisPengguna(type, params) {
           let url = `/analytics/chart-pengguna/${idPerusahaan}/${type}`

           if(type === 'date'){
            const startDate = params.start.format('YYYY-MM-DD')
            const endDate = params.end.format('YYYY-MM-DD')
            url = url + `?startDate=${startDate}&endDate=${endDate}`
           }

           if(type === 'month'){
            url = url + `?month=${params}`
           }

           if(type === 'year'){
            url = url + `?year=${params}`
           }

            await axios.get(url)
            .then(res => {
                if(res.status === 200){
                    const {categories, series} = res.data.data
                  setChartPengguna({
                        categories : categories,
                        series : [{
                                    name: "Total Pengguna",
                                    data: series
                                }]
                    })
                }else{
                    toast.warning(res.data.message, {autoClose: 2000})
                }
            }).catch(err => {
                toast.error('Failed Get data card', {autoClose: 2000})
            })
    }

    function handleChangeDate(start, end){
        setDateVal({start, end})
        getDataAnalisPengguna('date', {start, end} )
    }

    function ChgMonth(e){
        const {value} = e.target
        setMonthVal(value)
        getDataAnalisPengguna('month', value )
    }

    function ChgYear(e){
        const {value} = e.target
        setYearVal(value)
        getDataAnalisPengguna('year', value )
    }

    function hdlParams(value){
        setTypeParams(value)
        if(value === 'date'){
             getDataAnalisPengguna('date', datehVal )
        }
        if(value === 'month'){
             getDataAnalisPengguna(value, monthVal )
        }
        if(value === 'year'){
             getDataAnalisPengguna(value, yearVal )
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
                            <Col sm={3}>
                             {typeParams === 'date' && (
                                 <CompDateRangeWeek  state={datehVal}  handleCallback={handleChangeDate}/>
                                )}
                                {typeParams === 'month' && (
                                    <Form.Control type="month" size='sm' value={monthVal} onChange={ChgMonth}/>
                                )}
                                {typeParams === 'year' && (
                                    <Form.Control type="year" size='sm' value={yearVal} onChange={ChgYear}/>
                                )}
                            </Col>
                            <Col sm={2}>
                                <ButtonGroup size='sm'  aria-label="Basic example">
                                    <Button onClick={() => hdlParams('date')} variant={typeParams === 'date' ? 'primary' : 'light'}>Tanggal</Button>
                                    <Button onClick={() => hdlParams('month')} variant={typeParams === 'month' ? 'primary' : 'light'}>Bulan</Button>
                                    <Button onClick={() => hdlParams('year')} variant={typeParams === 'year' ? 'primary' : 'light'}>Tahun</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </CardShadow>
                </Col>
            </Row>

            <Row>
                <Col className='ps-0'>
                    <CardShadow >
                        <ChartUserAnalis dataChart={chartPenggna} />
                    </CardShadow>
                </Col>
            </Row>
         </div>
        </Col>
    </Row>
  )
}

export default Analytic