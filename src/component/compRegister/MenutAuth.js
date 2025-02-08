import React from "react";
// import axios from 'axios';
import {  Col, Card, Row, Button } from "react-bootstrap";
// import TableAccess from "./TableAccess";
import CardListAuth from "./CardListAuth";
import Swal from "sweetalert2";

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
        //jika ada arr id dibawahnya lakukan looping untuk unchecked
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
          //jika ada arr id dibawahnya lakukan looping untuk unchecked
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
      }else{
        //lakukan pengecekan uncheck 
      }
    }

    //lakukan pengecekan uncheck 
    if(!value){
      //uncheck sub group
      const arrSubGrpId = menuAcces.map((item, indx) => item.MENU_GROUP_SUB === menuObj.MENU_GROUP_SUB ? indx : null).filter(itm => itm !== null)
      const arrViewThisMdlSubGrp = newArrView.filter((item, indx) => arrSubGrpId.includes(indx)).slice(1);
      const uncheckAllSubGrp = arrViewThisMdlSubGrp.every(item => !item)
      if(uncheckAllSubGrp){
        const findIdxKey3 = menuAcces.findIndex(item => item.MENU_GROUP_SUB ===  menuObj.MENU_GROUP_SUB) //idx module
        newArrView[findIdxKey3] = false
      }
      
      
      //uncheck group
      const arrGrpId = menuAcces.map((item, indx) => item.MENU_GROUP === menuObj.MENU_GROUP ? indx : null).filter(itm => itm !== null)
      const arrViewThisMdlGrp = newArrView.filter((item, indx) => arrGrpId.includes(indx)).slice(1);
      
      const uncheckAllGrp = arrViewThisMdlGrp.every(item => !item)
      if(uncheckAllGrp){
        const findIdxKey2 = menuAcces.findIndex(item => item.MENU_GROUP ===  menuObj.MENU_GROUP) //idx module
        newArrView[findIdxKey2] = false
      }

      //uncheck module
      const arrModuleId = menuAcces.map((item, indx) => item.MENU_MODUL === menuObj.MENU_MODUL ? indx : null).filter(itm => itm !== null)
      const arrViewThisMdl = newArrView.filter((item, indx) => arrModuleId.includes(indx)).slice(1);
      const uncheckAll = arrViewThisMdl.every(item => !item)
      if(uncheckAll){
        const findIdxKey1 = menuAcces.findIndex(item => item.MENU_MODUL ===  menuObj.MENU_MODUL) //idx module
        newArrView[findIdxKey1] = false
      }
      
      
    }
    
      setarrView(newArrView);
  };

  function handleChecModule(modulId){
    
      Swal.fire({
        text: `Are You Sure Check ALL This Group ?`,
        icon: "question",
        confirmButtonColor : '#2275f2',
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batalkan",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const menuObj = menuAcces.find(item => item.MENU_ID === modulId)
          const idx = menuAcces.findIndex(item => item.MENU_ID === modulId)
          const currentValue = arrView[idx]
          let newArrView = [...arrView]
      
          const arrID = menuAcces.filter(item => item.MENU_MODUL === menuObj.MENU_MODUL).map(grp => grp.MENU_ID) //arr sub grup
          
          arrID.forEach(el => {
            const theIdx = menuAcces.findIndex(itm => itm.MENU_ID === el)
            newArrView[theIdx] = !currentValue 
          });
          setarrView(newArrView);
        }
      });

  }

  const findValue = (arrayAcces, arrView, menuId) => {
    const idxAcc = arrayAcces.findIndex((mod) => mod.MENU_ID === menuId) 
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
              handleChecModule={handleChecModule}
            />
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
