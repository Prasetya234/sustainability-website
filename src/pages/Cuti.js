import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import { FaFileImport, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import MdlImportCuti from "../component/compCuti/MdlImportCuti";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios";
import '../styles/TableBotstrap.css'
import { toast } from "react-toastify";
import MdlAddCuti from "../component/compCuti/MdlAddCuti";

const Cuti = () => {
  const { value } = useContext(AuthContext);
  const {  idPerusahaan } = value;
    const [mdlImport, setMdlImport] = useState(false)
    const [mdlAdd, setMdlAdd] = useState(false)
    const [dataCuti, setDataCuti] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [query, setQuery] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
    // Hitung jumlah halaman
    const totalPages = Math.ceil(dataCuti.length / rowsPerPage);

    // Ambil data yang sesuai dengan halaman saat ini
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = dataCuti.slice(indexOfFirstRow, indexOfLastRow);
   
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

  function opnMdlAddCuti(){
    setMdlAdd(true)
  }
  function opnMdlImportCuti(){
    setMdlImport(true)
  }
  function clsMdlImportCuti(){
    setMdlImport(false)
  }

  async function getDataCuti(idPerusahaan) {
    await axios.get(`/personal/cuti/${idPerusahaan}` )
    .then(res => {
      if(res.status === 200){
        setDataCuti(res.data.data)
      }else(
        setDataCuti([])
      )
    })
  }

  useEffect(() => {
    getDataCuti(idPerusahaan)
  }, [idPerusahaan])
  
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset ke halaman pertama saat jumlah baris berubah
  };

  const parseDate = (date) => {
    return date === '0000-00-00' ? null : date;
  };

    //fungsi check all
    const toggleSelectAll = () => {
      const arrayDataCuti = [...dataCuti];
  
      const newData = arrayDataCuti.map((item) => ({
        ...item,
        selected: !selectAll,
      }));
  
      setDataCuti(newData)
      setSelectAll(!selectAll);
      setLastSelectedIndex(null);
    };

      //fungsi cek row dan cek row by shift
  const toggleSelectItem = (itemId, e) => {
    const arrayDataCuti = [...dataCuti];
    let newData;
    let newSelectAll = false;
    const shiftKey = e.nativeEvent.shiftKey;

    const checkIndex = arrayDataCuti.findIndex((dta) => dta.ID_CUTI === itemId);

    if (shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, checkIndex);
      const end = Math.max(lastSelectedIndex, checkIndex);

      newData = arrayDataCuti.map((item, i) => ({
        ...item,
        selected: item.selected || (i >= start && i <= end),
      }));

      newSelectAll = false;
    } else {
      newData = arrayDataCuti.map((item) =>
        item.ID_CUTI === itemId ? { ...item, selected: !item.selected } : item
      );

      if (e.target.checked) {
        setLastSelectedIndex(checkIndex);
      }
      newSelectAll = newData.every((item) => item.selected);
    }

      setDataCuti(newData)
    setSelectAll(newSelectAll);
  };
  
  function handleSearch(e) {
    const { value } = e.target;
    setQuery(value);
  }

   //fungsi untuk search data header schedule sewing
   function searchData(arrData, query) {
    //jika tdak ada data atau query return langsung object nya
    if (!arrData || !query) return arrData;
    //jika ada query maka convert ke string

    //ubah query ke string
    const queryString = String(query); //karena parsing ke data baru
    //search data dengan cara rubah datanya ke string dan masukan includes
    const resultSerch = arrData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(queryString.toLowerCase())
      )
    );


    return resultSerch;
  }

  function checkDisabled(data){
    if(data.length === 0) return true
    const checkSelect = data.filter(item => item.selected)
    
    if(checkSelect.length === 0){
      return true
    }else{
      return false
    }
  }

  async function deleteSelect(data) {
    if(!data) return;
    const dataSelect = data.filter(item => item.selected).map(sel => sel.ID_CUTI)
    if(dataSelect.length === 0) return;

    await axios.post(`/personal/delete-cuti/`, {arrIdCuti : dataSelect})
    .then(res => {
      if(res.status === 200){
        getDataCuti(idPerusahaan)
        toast.success(res.data.message, {autoClose: 2000})
      }
    }).catch(err => {
      toast.error('Soomthing whrong when delete cuti', {autoClose: 2000})
    })

  }
  return (
    <div>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row className="mb-2">
              <Col>
                <Button variant={"primary"} size="sm" className="me-2" onClick={opnMdlAddCuti}><FaPlus/> ADD </Button>
                <Button variant={"success"} size="sm" className="me-2" onClick={opnMdlImportCuti}><FaFileImport/> IMPORT IN BATCH</Button>
                <Button variant={"danger"} size="sm" disabled={checkDisabled(dataCuti)} onClick={() => deleteSelect(dataCuti)}><MdDelete /> DELETE SELECTED</Button>
              </Col>
              <Col sm={3} className="text-end">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="search"
                  value={query || ""}
                  onChange={handleSearch}
                />
              </Col>
            </Row>  
            <Row>
              <Col>
                <div className="tableFixHead nowrap" >
                  <Table striped hover>
                    <thead>
                      <tr className="text-center">
                        <th>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={toggleSelectAll}
                            />
                          </th>
                        <th>No</th>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Departemen</th>
                        <th>Job Title</th>
                        <th>Tanggal Masuk</th>
                        <th>Tanggal Keluar</th>
                        <th>Masa Kerja</th>
                        <th>Hak Cuti</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                        <th>9</th>
                        <th>10</th>
                        <th>11</th>
                        <th>12</th>
                        <th>Sisa Cuti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchData(currentData, query)?.map((item, i) => (
                        <tr key={i}>
                          <td>
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={(e) => toggleSelectItem(item.ID_CUTI, e)}
                          />
                        </td>
                        <td>{indexOfFirstRow + i + 1}</td>
                        <td>{item.EMP_ID}</td>
                        <td>{item.EMP_FULL_NAME}</td>
                        <td>{item.EMP_DEPARTMENT}</td>
                        <td>{item.EMP_JOB_TITLE}</td>
                        <td>{item.EMP_ONBOARDINGDATE}</td>
                        <td>{parseDate(item.EMP_RESIGN_DATE)}</td>
                        <td>{Number(item.MASA_KERJA).toFixed(2)}</td>
                        <td>{item.HAK_CUTI}</td>
                        <td>{parseDate(item.CUTI_1)}</td>
                        <td>{parseDate(item.CUTI_4)}</td>
                        <td>{parseDate(item.CUTI_3)}</td>
                        <td>{parseDate(item.CUTI_2)}</td>
                        <td>{parseDate(item.CUTI_5)}</td>
                        <td>{parseDate(item.CUTI_6)}</td>
                        <td>{parseDate(item.CUTI_7)}</td>
                        <td>{parseDate(item.CUTI_8)}</td>
                        <td>{parseDate(item.CUTI_9)}</td>
                        <td>{parseDate(item.CUTI_10)}</td>
                        <td>{parseDate(item.CUTI_11)}</td>
                        <td>{parseDate(item.CUTI_12)}</td>
                        <td>{item.SISA_CUTI}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>      
            
            <Row className="mt-3 justify-content-between">
              <Col md={5}>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                  <Form.Label column sm="3" className="text-end">
                    Rows per page:
                  </Form.Label>
                  <Col sm="3">
                    <Form.Select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Form.Select>{" "}
                  </Col>
                  <Col sm="5" className=" align-content-center">
                    <div className="">
                      Total Data :{" "}
                      <span className="fw-bold">{dataCuti.length}</span>
                    </div>
                  </Col>
                </Form.Group>
              </Col>
              <Col md={3} className="pe-4 align-content-center">
                <Pagination className=" justify-content-end">
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Item onClick={() => handlePageChange(1)}>
                    {1}
                  </Pagination.Item>
                  {currentPage > 3 && <Pagination.Ellipsis />}
                  {currentPage > 2 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Pagination.Item>
                  )}
                  <Pagination.Item active>{currentPage}</Pagination.Item>
                  {currentPage < totalPages - 1 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Pagination.Item>
                  )}
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                  <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </Pagination.Item>
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Col>
            </Row>    
          </CardShadow>
        </Col>
      </Row>
      <MdlImportCuti show={mdlImport} handleClose={clsMdlImportCuti} idPerusahaan={idPerusahaan} getDataCuti={getDataCuti} />
      <MdlAddCuti show={mdlAdd} handleClose={() => setMdlAdd(false)} idPerusahaan={idPerusahaan} getDataCuti={getDataCuti} />
    </div>
  );
};

export default Cuti;
