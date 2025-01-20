import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Card, Row, Col, Button } from "react-bootstrap";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillDelete, AiFillEdit, AiOutlineMenuUnfold } from "react-icons/ai";

const TabelPerusahaan = ({
  rowData,
  handleOpenDetail,
  handleDelete,
  handleEdit,
  handleMdlMenu,
}) => {
  //   const [gridApi, setGridApi] = useState();
  //   const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { headerName: "Nama", field: "NAMA_PERUSAHAAN" },
    {
      headerName: "ID",
      field: "ID_PERUSAHAAN",
      cellClass: ["text-center"],
      maxWidth: 120,
    },
    // { headerName: "NPWP", field: "NPWP", cellClass: ["text-center"] },
    // { headerName: "NIB", field: "NIB", cellClass: ["text-center"] },
    { headerName: "Alamat", field: "ALAMAT_PERUSAHAAN" },
    {
      headerName: "Tlp",
      field: "TLP_PERUSAHAAN",
      cellClass: ["text-center"],
      maxWidth: 120,
    },
    { headerName: "Penanggung Jawab", field: "PENANGGUNGJAWAB" },
    { headerName: "Nama PIC", field: "NAMA_PIC" },
    { headerName: "Email PIC", field: "EMAIL_PIC" },
    { headerName: "Phone PIC", field: "PHONE_PIC" },
    {
      headerName: "Tgl Expire",
      field: "TGL_EXPIRE",
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
            onClick={() => handleEdit(params.data)}
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
          <Button
            size="sm"
            className="me-2"
            variant="secondary"
            onClick={() => handleMdlMenu(params.data)}
          >
            <AiOutlineMenuUnfold size={16} />
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
    suppressSizeToFit: true,
    resizable: true,
    // flex: 1,
  };

  //   const onGridReady = (params) => {
  //     setGridApi(params);
  //     params.api.applyTransaction({ add: rowData });
  //     // params.api.sizeColumnsToFit();
  //   };

  //   const handleValRow = (e) => {
  //     const { value } = e.target;

  //     gridApi.api.paginationSetPageSize(value);
  //   };

  return (
    <div className="p-2">
      <Card>
        <Card.Body className="border-0 shadow-sm rounded">
          <Row className="justify-content-end mb-2">
            <Col sm={6} md={2} className="text-end">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleOpenDetail("add")}
              >
                <span>
                  <MdAddCircleOutline size={18} />
                </span>{" "}
                Tambah Perusahaan
              </Button>
            </Col>
          </Row>
          <div
            className="ag-theme-alpine center-header"
            style={{ height: "80vh", width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              //   onGridReady={onGridReady}
              // rowSelection={"multiple"}
              // onSelectionChanged={handleSelection}
              pagination={true}
              // paginationPageSize={25}
              // paginationAutoPageSize={true}
            ></AgGridReact>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabelPerusahaan;
