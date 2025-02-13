import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import ModalAddUser from "../component/compBeUser/ModalAddUser";

const BackendUsers = () => {
  const { value, mainState } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [listPerusahaan, setListPerusahaan] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [disabledPerusahaan, setDisabelPerusahaan] = useState(false);
  const [idPerushaan, setIdPerusahaan] = useState("");
  const [actType, setActType] = useState("Create");
  const [modalAdd, setModalAdd] = useState(false);

  async function getListBe(idPerusahaan) {
    let url = `/backend-role`;

    if (idPerusahaan) {
      url = `/backend-role?idperusahaan=${idPerusahaan}`;
    }

    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          setListRole(res.data.data);
        }
      })
      .catch((err) => toast.error(err.data.message, { autoClose: 3000 }));
  }

 
  useEffect(() => {
    async function getDataPerusahaan(id) {
        let urlPerushaan =
          id && mainState.userLevel !== "sa" ? `/perusahaan/${id}` : `/perusahaan`;
    
        await axios
          .get(urlPerushaan)
          .then((res) => {
            if (res.status === 200 && res.data.data?.length > 0) {
              const listPerusahaan = res.data.data.map((per) => ({
                ...per,
                id: per.ID_PERUSAHAAN,
                name: `${per.ID_PERUSAHAAN} - ${per.NAMA_PERUSAHAAN}`,
              }));
              setListPerusahaan(listPerusahaan);
    
              if (res.data.data?.length === 1) {
                const { ID_PERUSAHAAN } = res.data.data[0];
                setIdPerusahaan(ID_PERUSAHAAN);
                setDisabelPerusahaan(mainState.userLevel !== "sa");
              }
            }
          })
          .catch((err) => console.log(err.data.message));
      }
    
      getDataPerusahaan(idPerusahaan);
      getListBe(idPerusahaan);

    }, [idPerusahaan, mainState.userLevel]);
  
    function handleOpnMdl(){
        setModalAdd(true)
        setActType('Create')
    }

    function hdlMdlClose(){
        setModalAdd(false)
    }

    function handleSubmit(e){
        console.log(e)
    }
    
  return (
    <>
    <Row className="m-0 mt-2">
      <Col>
        <CardShadow>
          <Row>
            <Col>
              <Button size="sm" ariant="primary" onClick={() => handleOpnMdl()}>
                Add
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Table responsive hover className="text-muted">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Role Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-middle" style={{ height: "60px" }}>
                    <td>egifirmansyah.it@gmail.com</td>
                    <td>Egi</td>
                    <td>PT Sumber Bintang Rejeki</td>
                    <td>Enable</td>
                    <td>Actio</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardShadow>
      </Col>
    </Row>
    <ModalAddUser 
    show={modalAdd}
    disabledPerusahaan={disabledPerusahaan}
    handleClose={hdlMdlClose} 
    actType={actType} 
    handleSubmit={handleSubmit} 
    listRole={listRole} listPerushaan={listPerusahaan}
    idPerushaan={idPerushaan}
    userId={userId}
    />
    </>
  );
};

export default BackendUsers;
