import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import { FaEdit, FaFileImport, FaPlus, FaTrash } from "react-icons/fa";
import MdlImportCuti from "../component/compCuti/MdlImportCuti";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios";
import '../styles/TableBotstrap.css';
import { toast } from "react-toastify";
import MdlAddCuti from "../component/compCuti/MdlAddCuti";

const Cuti = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;
  const [masterCuti, setMasterCuti] = useState([]);
  const [dataCuti, setDataCuti] = useState([]);
  const [selectedMasterCutiId, setSelectedMasterCutiId] = useState(null);
  const [mdlImport, setMdlImport] = useState(false);
  const [mdlAdd, setMdlAdd] = useState(false);
  const [showCutiModal, setShowCutiModal] = useState(false);
  const [showMasterCutiModal, setShowMasterCutiModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [editMasterCuti, setEditMasterCuti] = useState(null);
  const [formData, setFormData] = useState({ YEAR: "", MONTH: "", DESCRIPTION: "" });
  const [selectedCutiIds, setSelectedCutiIds] = useState([]);

  // Hitung jumlah halaman untuk master_cuti
  const totalPages = Math.ceil(masterCuti.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentMasterData = masterCuti.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  async function getMasterCuti() {
    await axios.get(`/personal/master-cuti?ID_COMPANY=${idPerusahaan}`)
      .then(res => {
        if (res.status === 200) {
          setMasterCuti(res.data.cutis);
        }
      })
      .catch(err => {
        toast.error("Error fetching master cuti data", { autoClose: 2000 });
      });
  }

  async function getDataCuti(masterCutiId) {
    if (!masterCutiId) return;
    await axios.get(`/personal/cuti/${idPerusahaan}/${masterCutiId}`)
      .then(res => {
        if (res.status === 200) {
          setDataCuti(res.data.data.map(item => ({ ...item, selected: false })));
          setSelectedCutiIds([]);
        } else {
          setDataCuti([]);
          setSelectedCutiIds([]);
        }
      })
      .catch(err => {
        setDataCuti([]);
        setSelectedCutiIds([]);
        toast.error("Error fetching cuti data", { autoClose: 2000 });
      });
  }

  const createMasterCuti = async () => {
    const date = `${formData.YEAR}-${formData.MONTH}-01`; // Default to first day of month
    await axios.post(`/personal/master-cuti`, { DATE: date, DESCRIPTION: formData.DESCRIPTION, COMPANY_ID: idPerusahaan })
      .then(res => {
        if (res.status === 201) {
          toast.success("Master cuti created successfully", { autoClose: 2000 });
          getMasterCuti();
          setShowMasterCutiModal(false);
          setFormData({ YEAR: "", MONTH: "", DESCRIPTION: "" });
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Failed to create master cuti", { autoClose: 2000 });
      });
  };

  const updateMasterCuti = async (id) => {
    const date = `${formData.YEAR}-${formData.MONTH}-01`; // Default to first day of month
    await axios.put(`/personal/master-cuti/${id}`, { DATE: date, DESCRIPTION: formData.DESCRIPTION, COMPANY_ID: idPerusahaan })
      .then(res => {
        if (res.status === 200) {
          toast.success("Master cuti updated successfully", { autoClose: 2000 });
          getMasterCuti();
          setShowMasterCutiModal(false);
          setEditMasterCuti(null);
          setFormData({ YEAR: "", MONTH: "", DESCRIPTION: "" });
        }
      })
      .catch(err => {
        toast.error("Failed to update master cuti", { autoClose: 2000 });
      });
  };

  const deleteMasterCuti = async (id) => {
    await axios.delete(`/personal/master-cuti/${id}`)
      .then(res => {
        if (res.status === 200) {
          toast.success("Master cuti deleted successfully", { autoClose: 2000 });
          getMasterCuti();
        }
      })
      .catch(err => {
        toast.error("Failed to delete master cuti", { autoClose: 2000 });
      });
  };

  const deleteSelectedCuti = async () => {
    if (selectedCutiIds.length === 0) return;
    await axios.post(`/personal/delete-cuti/`, { arrIdCuti: selectedCutiIds })
      .then(res => {
        if (res.status === 200) {
          toast.success("Selected cuti deleted successfully", { autoClose: 2000 });
          getDataCuti(selectedMasterCutiId);
          setSelectedCutiIds([]);
        }
      })
      .catch(err => {
        toast.error("Failed to delete selected cuti", { autoClose: 2000 });
      });
  };

  useEffect(() => {
    getMasterCuti();
  }, [idPerusahaan]);

  useEffect(() => {
    if (selectedMasterCutiId) {
      getDataCuti(selectedMasterCutiId);
    }
  }, [selectedMasterCutiId, idPerusahaan]);

  const parseDate = (date) => {
    return date === '0000-00-00' ? null : date;
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const searchData = (arrData, allData, query) => {
    if (!query) return arrData;
    if (!arrData || !query) return arrData;
    const queryString = String(query);
    return allData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(queryString.toLowerCase())
      )
    );
  };

  const openMasterCutiModal = (item = null) => {
    setEditMasterCuti(item);
    if (item) {
      const [year, month] = item.DATE.split('-');
      setFormData({ YEAR: year, MONTH: month, DESCRIPTION: item.DESCRIPTION });
    } else {
      setFormData({ YEAR: "", MONTH: "", DESCRIPTION: "" });
    }
    setShowMasterCutiModal(true);
  };

  const handleDeleteMasterCuti = (id) => {
    if (window.confirm("Are you sure you want to delete this master cuti?")) {
      deleteMasterCuti(id);
    }
  };

  const openCutiModal = (id) => {
    setSelectedMasterCutiId(id);
    setShowCutiModal(true);
  };

  const closeCutiModal = () => {
    setShowCutiModal(false);
    setSelectedMasterCutiId(null);
    setSelectedCutiIds([]);
  };

  const closeMasterCutiModal = () => {
    setShowMasterCutiModal(false);
    setEditMasterCuti(null);
    setFormData({ YEAR: "", MONTH: "", DESCRIPTION: "" });
  };

  function opnMdlImportCuti() {
    if (!selectedMasterCutiId) {
      toast.error("Please select a Master Cuti first", { autoClose: 2000 });
      return;
    }
    setMdlImport(true);
  }

  function opnMdlAddCuti() {
    if (!selectedMasterCutiId) {
      toast.error("Please select a Master Cuti first", { autoClose: 2000 });
      return;
    }
    setMdlAdd(true);
  }

  function clsMdlImportCuti() {
    setMdlImport(false);
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveMasterCuti = () => {
    if (editMasterCuti) {
      updateMasterCuti(editMasterCuti.ID);
    } else {
      createMasterCuti();
    }
  };

  const handleSelectCuti = (id, checked) => {
    setDataCuti(prevData =>
      prevData.map(item =>
        item.ID_CUTI === id ? { ...item, selected: checked } : item
      )
    );
    setSelectedCutiIds(prevIds =>
      checked ? [...prevIds, id] : prevIds.filter(itemId => itemId !== id)
    );
  };

  const handleSelectAllCuti = (checked) => {
    const allIds = dataCuti.map(item => item.ID_CUTI);
    setDataCuti(prevData =>
      prevData.map(item => ({ ...item, selected: checked }))
    );
    setSelectedCutiIds(checked ? allIds : []);
  };

  return (
    <div>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row className="mb-2">
              <Col>
                <Button variant="primary" size="sm" className="me-2" onClick={() => openMasterCutiModal()}><FaPlus /> ADD MASTER CUTI</Button>
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
                <div className="tableFixHead nowrap">
                  <Table striped hover>
                    <thead>
                      <tr className="text-center">
                        <th>Year-Month</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchData(currentMasterData, masterCuti, query).map((item, i) => (
                        <tr key={item.ID}>
                          <td>{`${item.DATE.slice(0, 7)}`}</td>
                          <td>{item.DESCRIPTION || "No Description"}</td>
                          <td>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => openMasterCutiModal(item)}><FaEdit /></Button>
                            <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteMasterCuti(item.ID)}><FaTrash /></Button>
                            <Button variant="info" size="sm" onClick={() => openCutiModal(item.ID)}>View Cuti</Button>
                          </td>
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
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </Form.Select>
                  </Col>
                  <Col sm="5" className="align-content-center">
                    <div className="">
                      Total Data: <span className="fw-bold">{masterCuti.length}</span>
                    </div>
                  </Col>
                </Form.Group>
              </Col>
              <Col md={3} className="pe-4 align-content-center">
                <Pagination className="justify-content-end">
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  <Pagination.Item onClick={() => handlePageChange(1)}>{1}</Pagination.Item>
                  {currentPage > 3 && <Pagination.Ellipsis />}
                  {currentPage > 2 && (
                    <Pagination.Item onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</Pagination.Item>
                  )}
                  <Pagination.Item active>{currentPage}</Pagination.Item>
                  {currentPage < totalPages - 1 && (
                    <Pagination.Item onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</Pagination.Item>
                  )}
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                  <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </Col>
            </Row>
          </CardShadow>
        </Col>
      </Row>

      {/* Modal untuk Data Cuti */}
      <Modal show={showCutiModal} onHide={closeCutiModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cuti Data for Master Cuti ID: {selectedMasterCutiId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <Button variant="success" size="sm" className="me-2" onClick={opnMdlImportCuti}><FaFileImport /> IMPORT</Button>
              <Button variant="primary" size="sm" className="me-2" onClick={opnMdlAddCuti}><FaPlus /> ADD</Button>
              <Button
                variant="danger"
                size="sm"
                onClick={deleteSelectedCuti}
                disabled={selectedCutiIds.length === 0}
              >
                <FaTrash /> DELETE SELECTED
              </Button>
            </Col>
            <Col sm={3} className="text-end">
              <Form.Control
                size="sm"
                type="text"
                placeholder="search cuti"
                value={query || ""}
                onChange={handleSearch}
              />
            </Col>
          </Row>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped hover>
              <thead>
                <tr className="text-center">
                  <th>
                    <input
                      type="checkbox"
                      checked={dataCuti.length > 0 && dataCuti.every(item => item.selected)}
                      onChange={(e) => handleSelectAllCuti(e.target.checked)}
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
                {searchData(dataCuti, dataCuti, query).map((item, i) => (
                  <tr key={item.ID_CUTI}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.selected || false}
                        onChange={(e) => handleSelectCuti(item.ID_CUTI, e.target.checked)}
                      />
                    </td>
                    <td>{i + 1}</td>
                    <td>{item.EMP_ID}</td>
                    <td>{item.EMP_FULL_NAME}</td>
                    <td>{item.EMP_DEPARTMENT}</td>
                    <td>{item.EMP_JOB_TITLE}</td>
                    <td>{item.EMP_ONBOARDINGDATE}</td>
                    <td>{parseDate(item.EMP_RESIGN_DATE)}</td>
                    <td>{Number(item.MASA_KERJA).toFixed(2)}</td>
                    <td>{item.HAK_CUTI}</td>
                    <td>{parseDate(item.CUTI_1)}</td>
                    <td>{parseDate(item.CUTI_2)}</td>
                    <td>{parseDate(item.CUTI_3)}</td>
                    <td>{parseDate(item.CUTI_4)}</td>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCutiModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk Master Cuti */}
      <Modal show={showMasterCutiModal} onHide={closeMasterCutiModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMasterCuti ? "Edit Master Cuti" : "Add Master Cuti"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                as="select"
                name="YEAR"
                value={formData.YEAR}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Year</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Month</Form.Label>
              <Form.Control
                as="select"
                name="MONTH"
                value={formData.MONTH}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="DESCRIPTION"
                value={formData.DESCRIPTION}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeMasterCutiModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveMasterCuti}>Save</Button>
        </Modal.Footer>
      </Modal>

      <MdlImportCuti show={mdlImport} handleClose={clsMdlImportCuti} idPerusahaan={idPerusahaan} masterCutiId={selectedMasterCutiId} getDataCuti={() => getDataCuti(selectedMasterCutiId)} />
      <MdlAddCuti show={mdlAdd} handleClose={() => setMdlAdd(false)} idPerusahaan={idPerusahaan} masterCutiId={selectedMasterCutiId} getDataCuti={() => getDataCuti(selectedMasterCutiId)} />
    </div>
  );
};

export default Cuti;