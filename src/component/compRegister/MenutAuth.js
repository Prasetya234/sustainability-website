import React from "react";
// import axios from 'axios';
import { Table, Col, Card, Row, Button } from "react-bootstrap";
import TableAccess from "./TableAccess";
import CardListAuth from "./CardListAuth";

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

  const handleCheckbox = (e, menuId) => {
    // console.log(e.target.name);
    // console.log(index);
    // if (e.target.name === "view") {
    const menuObj = menuAcces.find(item => item.MENU_ID === menuId)
    const idx = menuAcces.findIndex(item => item.MENU_ID === menuId)
    const value = e.target.checked

    let newArrView = [...arrView]

    if(menuObj.MENU_SUB_KEY === 2){
      newArrView[idx] = value      
      const findIdxKey1 = menuAcces.findIndex(item => item.MENU_MODUL ===  menuObj.MENU_MODUL) //idx module
      const arrID = menuAcces.filter(item => item.MENU_GROUP === menuObj.MENU_GROUP).map(grp => grp.MENU_ID) //arr sub grup
      
      if(value){
        //jika checked jangan lupa check juga modulenya
        newArrView[findIdxKey1] = true
        //cari arr ID dibawahnya
        if(arrID){
          //jika ada arr id dibawahnya lakukan looping untuk checked
          arrID.forEach(el => {
            const theIdx = menuAcces.findIndex(itm => itm.MENU_ID === el)
            newArrView[theIdx] = true
          });
        }
      }else{
        if(arrID){
        //jika ada arr id dibawahnya lakukan looping untuk checked
          arrID.forEach(el => {
            const theIdx = menuAcces.findIndex(itm => itm.MENU_ID === el)
            newArrView[theIdx] = false
          });
        }
        
      }
    }
    if(menuObj.MENU_SUB_KEY === 3){
      newArrView[idx] = value
      const findIdxKey1 = menuAcces.findIndex(item => item.MENU_MODUL ===  menuObj.MENU_MODUL)
      const findIdxKey2 = menuAcces.findIndex(item => item.MENU_GROUP ===  menuObj.MENU_GROUP)
      const arrID = menuAcces.filter(item => item.MENU_GROUP_SUB === menuObj.MENU_GROUP_SUB).map(grp => grp.MENU_ID) //arr sub grup
      if(value){
        newArrView[findIdxKey1] = true
        newArrView[findIdxKey2] = true
        if(arrID){
          //jika ada arr id dibawahnya lakukan looping untuk checked
          arrID.forEach(el => {
            const theIdx = menuAcces.findIndex(itm => itm.MENU_ID === el)
            newArrView[theIdx] = true
          });
        }
      }else{
        if(arrID){
          //jika ada arr id dibawahnya lakukan looping untuk checked
          arrID.forEach(el => {
            const theIdx = menuAcces.findIndex(itm => itm.MENU_ID === el)
            newArrView[theIdx] = false
          });
        }
      }
    }
    if(menuObj.MENU_SUB_KEY === 4){
      newArrView[idx] = value
      const findIdxKey1 = menuAcces.findIndex(item => item.MENU_MODUL ===  menuObj.MENU_MODUL)
      const findIdxKey2 = menuAcces.findIndex(item => item.MENU_GROUP ===  menuObj.MENU_GROUP)
      const findIdxKey3 = menuAcces.findIndex(item => item.MENU_GROUP_SUB ===  menuObj.MENU_GROUP_SUB)
      if(value){
        newArrView[findIdxKey1] = true
        newArrView[findIdxKey2] = true
        newArrView[findIdxKey3] = true
      }
    }
    
      setarrView(newArrView);
    // } else if (e.target.name === "create") {
    //   setarrCreate(pushArry(arrCreate, index));
    // } else if (e.target.name === "update") {
    //   setarrUpdate(pushArry(arrUpdate, index));
    // } else if (e.target.name === "delete") {
    //   setarrDelete(pushArry(arrDelete, index));
    // } else {
    //   setarrPrint(pushArry(arrPrint, index));
    // }
  };

  const findValue = (arrayAcces, arrView, menuId) => {
    const idxAcc = arrayAcces.findIndex((mod) => mod.MENU_ID === menuId) || false  
    
    return arrView[idxAcc];
  };

  return (
    <>
      <Col lg={colSize || 12}>
        <Card className="shadow border-0">
          <Card.Body>
            <div>
              <h5 className="heading-small text-muted mb-2">Role Permission</h5>
            </div>
            <CardListAuth
              menuAcces={menuAcces}
              arrView={arrView}
              findValue={findValue}
              handleCheckbox={handleCheckbox}
            />
            {/* <Table borderless responsive hover className="text">
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
                      findValue={findValue}
                    />
                  ))}
              </tbody>
            </Table> */}
            <Row className="justify-content-end mt-3">
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
