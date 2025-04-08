import React, { useState } from 'react'
import { Button, Col, Modal, Row, Form } from 'react-bootstrap'
import { FaUpload } from 'react-icons/fa'
import TemplateCuti from "../../assets/excel/template-cuti.xlsx";
import * as XLSX from "xlsx";
import moment from 'moment';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';

const MdlImportCuti = ({show, handleClose, idPerusahaan, getDataCuti}) => {
    const [dataExlCuti, setDataExlCuti] = useState([])

    const hdlUploadCuti = (event) => {
            const file = event.target.files[0];
        
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const binaryStr = e.target.result;
                  const workbook = XLSX.read(binaryStr, { type: "binary" });
                  const sheetName = workbook.SheetNames[0];
                  const sheet = workbook.Sheets[sheetName];
                  
                  // Read data as an array of arrays
                  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
                  if (rawData.length > 1) {
                    const headers = rawData[0]; // First row as keys
                    const values = rawData.slice(1); // Rest as data
                    // Function to check if a value is an Excel date
                    
                    const isExcelDate = (value) => {
                        return typeof value === "number" && value > 0 && value < 2958465; // Excel's valid date range
                    };
                    
                        // Convert array into array of objects
                            const formattedData = values.map((row) => {
                                let obj = {};
                                headers.forEach((key, index) => {
                                    let value = row[index];

                                    // Convert only if the column is 'BIRTHDAY' or 'ONBOARDING_DATE'
                                    if (["TANGGAL MASUK", "TANGGAL MASUK", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(key) && isExcelDate(value)) {
                                        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel starts at Dec 30, 1899
                                        value = moment.utc(excelEpoch.getTime() + value * 86400000).format('YYYY-MM-DD');
                                    }

                                    
                                    obj[key] = value || ""; // Assign each value to the corresponding key
                                });
                        return obj;
                    });
      
          
                 setDataExlCuti(formattedData);
                  }
                };
                reader.readAsBinaryString(file);
            }
          };

   async function submitCutti(data){
        if(!data) return;

        const construcData = data.map(({
            NIK : EMP_ID,
            'SISA CUTI' : SISA_CUTI,
            'MASA KERJA' : MASA_KERJA,
            'HAK CUTI' : HAK_CUTI,
            '1' : CUTI_1,
            '2' : CUTI_2,
            '3' : CUTI_3,
            '4' : CUTI_4,
            '5' : CUTI_5,
            '6' : CUTI_6,
            '7' : CUTI_7,
            '8' : CUTI_8,
            '9' : CUTI_9,
            '10' : CUTI_10,
            '11' : CUTI_11,
            '11' : CUTI_12,
        })=>({
            ID_COMPANY : idPerusahaan,
            EMP_ID,
            SISA_CUTI,
            MASA_KERJA,
            HAK_CUTI,
            CUTI_1,
            CUTI_2,
            CUTI_3,
            CUTI_4,
            CUTI_5,
            CUTI_6,
            CUTI_7,
            CUTI_8,
            CUTI_9,
            CUTI_10,
            CUTI_11,
            CUTI_12,
        }))

         await axios.post('/personal/cuti', { dataCuti: construcData, idPerusahaan })
        .then(res => {
            if(res.status === 200){ 
                toast.success(res.data.message, {autoClose: 2000})
                getDataCuti(idPerusahaan)
                handleClose()
            }
        }).catch(err => {
            toast.error('soomthing whrong when upload', {autoClose: 2000})
        })
    }
  return (
    <Modal show={show}>
        <Modal.Header className="bg-success text-mute bg-opacity-50" closeButton>
            <Modal.Title>Cuti Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <Row>
                    <Col sm={12} md={12} lg={12}>
                        <a href={TemplateCuti} download>Download Template Excel</a>
                    </Col>
                    <Col sm={12} md={12} lg={12}>  
                        <Form.Label>Upload File</Form.Label>
                        <Form.Control type="file" name="EmpImportFile" onChange={hdlUploadCuti}/>
                    </Col>
                </Row>
        </Modal.Body>
        <Modal.Footer className="border-0">
            <Button variant="success" size="sm" onClick={() => submitCutti(dataExlCuti)} disabled={dataExlCuti.length===0 ? true:false}><FaUpload/> Upload</Button>
            <Button variant="secondary" size="sm" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>    
  )
}

export default MdlImportCuti