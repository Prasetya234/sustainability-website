import React from "react";
// import axios from 'axios';
import { Table, Col, Card, Row, Button } from "react-bootstrap";
import TableAccess from "./TableAccess";

const MenutAuth = ({
  colSize,
  menuAcces,
  btnFalse,
  setarrView,
  setarrCreate,
  setarrUpdate,
  setarrDelete,
  setarrPrint,
  arrView,
  arrCreate,
  arrUpdate,
  arrDelete,
  arrPrint,
  saveResultbtn,
}) => {
  const pushArry = (arr, indx) => {
    const arrvalueCheck = arr; //konversi state ke array
    const newValueCheck = arr[indx] ? false : true; //rubah valuenya
    arrvalueCheck[indx] = newValueCheck; //masukan kedalam array
    return arrvalueCheck;
  };

  const handleCheckbox = (e, index) => {
    // console.log(e.target.name);
    // console.log(index);
    if (e.target.name === "view") {
      setarrView(pushArry(arrView, index));
    } else if (e.target.name === "create") {
      setarrCreate(pushArry(arrCreate, index));
    } else if (e.target.name === "update") {
      setarrUpdate(pushArry(arrUpdate, index));
    } else if (e.target.name === "delete") {
      setarrDelete(pushArry(arrDelete, index));
    } else {
      setarrPrint(pushArry(arrPrint, index));
    }
  };

  const findIndx = (arrayAcces, menuId) => {
    return arrayAcces.findIndex((mod) => mod.MENU_ID === menuId);
  };

  return (
    <>
      <Col lg={colSize || 12}>
        <Card className="shadow border-0">
          <Card.Body>
            <Table bordered responsive hover className="text">
              <thead>
                <tr>
                  <th>#</th>
                  <th colSpan={4}>Modul</th>
                  <th>Views</th>
                  <th>Create</th>
                  <th>Update</th>
                  <th>Delete</th>
                  <th>Print</th>
                </tr>
              </thead>
              <tbody>
                {menuAcces
                  .filter((moduls) => moduls.MENU_SUB_KEY === 1)
                  .map((modul, idx) => (
                    <TableAccess
                      key={idx}
                      menuAcces={menuAcces}
                      modul={modul}
                      handleCheckbox={handleCheckbox}
                      arrView={arrView}
                      arrCreate={arrCreate}
                      arrUpdate={arrUpdate}
                      arrDelete={arrDelete}
                      arrPrint={arrPrint}
                      index={idx}
                      findIndx={findIndx}
                    />
                  ))}
              </tbody>
            </Table>
            <Row className="justify-content-end">
              <Col className="text-end" sm={4}>
                <Button
                  className="me-2"
                  size="sm"
                  variant="primary"
                  onClick={() => btnFalse()}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => saveResultbtn()}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default MenutAuth;
