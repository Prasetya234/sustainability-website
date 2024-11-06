import React, { useState } from "react";
import { Col, Row, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import axios from "../../axios/axios";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useEffect } from "react";
import MdlCfrmDelPer from "../compDftrPerusahaan/MdlCfrmDelPer";

const intials = {
  ID_PERUSAHAAN: "",
  NAMA_PERUSAHAAN: "",
  JENIS_DOKUMEN: "",
  NOMOR_DOKUMEN: "",
  TANGGAL_DOKUMEN: "",
};

const EntitasPerusahaan = ({
  perusahaan,
  dataPerushaan,
  disabledPerusahaan,
  handlePerusahaan,
}) => {
  const [modalActiv, setModalActiv] = useState(false);
  const [formData, setFormData] = useState(intials);
  const [msg, setMsg] = useState("");
  const [method, setMethod] = useState("post");
  const [dataDelete, setDataDelete] = useState(false);

  const [listEntitas, setListEntitas] = useState([]);

  const [columnDefs] = useState([
    {
      headerName: "ID",
      field: "ID_PERUSAHAAN",
      cellClass: ["text-center"],
      maxWidth: 120,
    },
    { headerName: "Nama Perusahaan", field: "NAMA_PERUSAHAAN" },
    // { headerName: "NPWP", field: "NPWP", cellClass: ["text-center"] },
    // { headerName: "NIB", field: "NIB", cellClass: ["text-center"] },
    {
      headerName: "Jenis Dokumen",
      field: "JENIS_DOKUMEN",
      cellClass: ["text-center"],
    },
    {
      headerName: "Nomor Dokumen",
      field: "NOMOR_DOKUMEN",
      cellClass: ["text-center"],
    },
    {
      headerName: "Tanggal Dokumen",
      field: "TANGGAL_DOKUMEN",
      cellClass: "text-center",
      maxWidth: 120,
    },
    {
      headerName: "Aksi",
      cellClass: "text-center",
      cellRenderer: (params) => (
        <>
          <Button
            size="sm"
            variant="warning"
            className="me-2"
            onClick={() => handleBtnEdit(params.data)}
          >
            <AiFillEdit size={16} />
          </Button>
          <Button
            size="sm"
            className="me-2"
            variant="danger"
            onClick={() => handleDelete(params.data)}
          >
            <AiFillDelete size={16} />
          </Button>
        </>
      ),
    },
  ]);

  const defaultColDef = {
    sortable: true,
    editable: true,
    filter: true,
    floatingFilter: true,
    // suppressSizeToFit: true,
    resizable: true,
    flex: 1,
  };

  function handleModalActive() {
    setMethod("post");
    setModalActiv(true);
  }

  function handleDelete(data) {
    setDataDelete(data);
  }

  function handleBtnEdit(params) {
    if (perusahaan.length < 1) {
      const dtaPers = dataPerushaan.filter(
        (dt) => dt.ID_PERUSAHAAN === params.ID_PERUSAHAAN
      );

      handlePerusahaan(dtaPers);
    }
    setMethod("patch");
    setFormData(params);
    setModalActiv(true);
  }

  function handleModalClose() {
    setModalActiv(false);
    setMsg("");
    setFormData(intials);
    setMethod("post");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perusahaan[0]) {
      return setMsg("Mohon Pilih ID atau Nama Perusahaan");
    }
    const { ID_PERUSAHAAN, NAMA_PERUSAHAAN } = perusahaan[0];
    const dataPost = { ...formData, ID_PERUSAHAAN, NAMA_PERUSAHAAN };

    await axios[method](`/entitas-perusahaan/entitas`, dataPost)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message, { autoClose: 3000 });
          if (perusahaan.length > 0) {
            const { ID_PERUSAHAAN } = perusahaan[0];
            getDataEntitas(ID_PERUSAHAAN);
          } else {
            getDataEntitas();
          }
          handleModalClose();
        }
      })
      .catch((err) =>
        toast.error(err.response.data.message, { autoClose: 3000 })
      );
  };

  async function getDataEntitas(id) {
    let urlEntitas = id
      ? `/entitas-perusahaan/entitas?id=${id}`
      : `/entitas-perusahaan/entitas`;

    await axios
      .get(urlEntitas)
      .then((res) => {
        if (res.status === 200) {
          setListEntitas(res.data.data);
        }
      })
      .catch((err) =>
        toast.error(err.response.data.message, { autoClose: 3000 })
      );
  }

  function closedMdlDelete() {
    setDataDelete(false);
  }

  //handle delete
  async function exeDelete(id) {
    await axios
      .delete(`/entitas-perusahaan/entitas/${id}`)
      .then((res) => {
        setDataDelete(false);
        toast.success(res.data.message, { autoClose: 3000 });

        if (perusahaan.length > 0) {
          const { ID_PERUSAHAAN } = perusahaan[0];
          getDataEntitas(ID_PERUSAHAAN);
        } else {
          getDataEntitas();
        }
      })
      .catch((err) => console.log(err.response.data));
  }

  useEffect(() => {
    if (perusahaan.length > 0) {
      const { ID_PERUSAHAAN } = perusahaan[0];
      getDataEntitas(ID_PERUSAHAAN);
    } else {
      getDataEntitas();
    }
  }, [perusahaan]);

  return (
    <>
      <Row>
        <Col>
          <Row className="mb-2">
            <Col sm={2}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleModalActive("Primary")}
              >
                <span>
                  <MdAddCircleOutline size={18} />
                </span>{" "}
                Tambah Dokumen
              </Button>
            </Col>
          </Row>

          <div
            className="ag-theme-alpine center-header"
            style={{ height: "80vh", width: "100%" }}
          >
            <AgGridReact
              rowData={listEntitas}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              // isFullWidthRow={true}
              // pagination={true}
            ></AgGridReact>
          </div>
        </Col>
      </Row>
      {modalActiv ? (
        <Modal
          // size="lg"
          backdrop="static"
          show={modalActiv}
          onHide={handleModalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {/* {method === "post" ? "Tambah Daftar" : "Edit Data"} Perusahaan */}
              Entitas Perusahaan
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" ? (
              <div className="fst-italic text-danger mb-2">{msg}</div>
            ) : (
              ""
            )}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="id_perusahaan">
                    <InputGroup>
                      <InputGroup.Text style={{ width: "170px" }}>
                        ID/Nama Perusahaan
                      </InputGroup.Text>
                      <Typeahead
                        clearButton
                        size="sm"
                        id="perusahaan"
                        labelKey="name"
                        onChange={handlePerusahaan}
                        options={dataPerushaan}
                        placeholder="perusahaan..."
                        selected={perusahaan}
                        disabled={disabledPerusahaan}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="jenisdokumen">
                    <InputGroup>
                      <InputGroup.Text style={{ width: "170px" }}>
                        Jenis Dokumen
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="contoh : SKEP"
                        name="JENIS_DOKUMEN"
                        value={formData.JENIS_DOKUMEN}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="nomordokumen">
                    <InputGroup>
                      <InputGroup.Text style={{ width: "170px" }}>
                        Nomor Dokumen
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="contoh : NK-xx/KKP.xxx/2019"
                        name="NOMOR_DOKUMEN"
                        value={formData.NOMOR_DOKUMEN}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="tanggaldokumen">
                    <InputGroup>
                      <InputGroup.Text style={{ width: "170px" }}>
                        Tanggal Dokumen
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        // placeholder="contoh : NK-xx/KKP.xxx/2019"
                        name="TANGGAL_DOKUMEN"
                        value={formData.TANGGAL_DOKUMEN}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button size="sm" variant="primary" type="submit">
                  Simpan
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      ) : null}
      {dataDelete.ID_PERUSAHAAN ? (
        <MdlCfrmDelPer
          show={dataDelete.ID_PERUSAHAAN}
          modalClose={closedMdlDelete}
          perushaan={dataDelete}
          handleExeDelete={exeDelete}
          type="entitas"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default EntitasPerusahaan;
