import { useContext, useEffect, useState } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import CompanyForm from "../component/compDftrPerusahaan/CompanyForm";
import TabelPerusahaan from "../component/compDftrPerusahaan/TabelPerusahaan";
import MdlCfrmDelPer from "../component/compDftrPerusahaan/MdlCfrmDelPer";
import MenutAuth from "../component/compRegister/MenutAuth";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const intials = {
  ID_PERUSAHAAN: "",
  NAMA_PERUSAHAAN: "",
  EMAIL_PIC: "",
  NAMA_PIC: "",
  PHONE_PIC: "",
  ALAMAT_PERUSAHAAN: "",
  TLP_PERUSAHAAN: "",
  PENANGGUNGJAWAB: "",
  JABTAN_PENANGGUNGJAWAB: "",
  KOTA_PERUSAHAAN: "",
  TGL_EXPIRE: "",
};

const DaftarPerusahaan = () => {
  const { value } = useContext(AuthContext);
  const { userId } = value;
  const [rowData, setRowData] = useState([]);
  const [formData, setFormData] = useState(intials);

  const [modalsDetail, setModalsDetail] = useState(false);
  const [method, setMethod] = useState("post");
  const [dataDelete, setDataDelete] = useState(false);

  const [menus, setMenus] = useState([]);
  const [tabMenu, settabMenu] = useState(false);


  //menu access perushaan
  const [arrView, setarrView] = useState([]);
  const [menuAcces, setMenuAcces] = useState([]);

  async function getDataPerusahaan() {
    await axios
      .get(`/perusahaan`)
      .then((res) => {
        setRowData(res.data.data);
      })
      .catch((err) => console.log(err.data.message));
  }
  //handle delete
  async function exeDelete(id) {
    await axios
      .delete(`/perusahaan/${id}`)
      .then((res) => {
        setDataDelete(false);
        getDataPerusahaan();
      })
      .catch((err) => console.log(err.data));
  }

  const getMenus = async () => {
    const repsons = await axios.get("/menu");
    setMenus(repsons.data);
  };


  useEffect(() => {
    getDataPerusahaan();
    getMenus();
  }, []);

  // batas kebawah untuk function atas untuk fatch
  function handleClose() {
    setModalsDetail(false);
    setFormData(intials);
    setMethod("post");
  }
  function handleOpenDetail() {
    setModalsDetail(true);
  }

  function handleDelete(data) {
    setDataDelete(data);
  }

  function handleEdit(data) {
    setFormData(data);
    setMethod("patch");
    setModalsDetail(true);
  }

  function closedMdlDelete() {
    setDataDelete(false);
  }

  //handle modal menu view
  async function handleMdlMenu(data) {
    const { ID_PERUSAHAAN } = data;
    const respons = await axios.get(`/perushaanacc/${ID_PERUSAHAAN}`);
    const arrViewd = [];

    respons.data.forEach((ma) => {
      arrViewd.push(ma.ACCESS_MENU_ID ? true : false);
    });

    setarrView(arrViewd);

    setMenuAcces(respons.data);
    settabMenu(data);
  }

  function handleMenuClose() {
    setarrView([]);

    setMenuAcces([]);
    settabMenu(false);
  }

  const saveResultbtn = async () => {
    const arrNewAccs = [];
    menuAcces.map(async (menu, index) => {
      const dataAcces = {
        ACCESS_ID_PERUSAHAAN: tabMenu.ID_PERUSAHAAN,
        ACCESS_NPWP: tabMenu.NPWP,
        ACCESS_MENU_ID: arrView[index] ? menu.MENU_ID : null,
        ACCESS_ADD_ID: userId,
        ACCESS_UPDATE_ID: userId,
        MENU_NAME: menu.MENU_TITLE,
      };
      arrNewAccs.push(dataAcces);
    });
    const filterAccKosong = arrNewAccs.filter(
      (acc) => acc.access_menu_id !== null
    );

    await axios
      .post(`/perushaanacc/${tabMenu.ID_PERUSAHAAN}`, filterAccKosong)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message, { autoClose: 3000 });
          setarrView([]);

          setMenuAcces([]);
          settabMenu(false);
        } else {
          toast.error(res.data.message, { autoClose: 3000 });
        }
      })
      .catch((err) => {
        toast.error(err.message, { autoClose: 3000 });
      });
  };

  //fake function
  function fake(a) {
    return;
  }
  return (
    <>
      <Row className="m-0 pt-3">
        {/* <Col>
        <div className="shadow rounded p-2 bg-light">
        </div>
    </Col> */}
        <Col>
          <TabelPerusahaan
            rowData={rowData}
            handleOpenDetail={handleOpenDetail}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleMdlMenu={handleMdlMenu}
          />
        </Col>
      </Row>
      {modalsDetail ? (
        <CompanyForm
          show={modalsDetail}
          handleClose={handleClose}
          getDataPerusahaan={getDataPerusahaan}
          formData={formData}
          setFormData={setFormData}
          method={method}
        />
      ) : (
        ""
      )}
      {dataDelete.ID_PERUSAHAAN ? (
        <MdlCfrmDelPer
          show={dataDelete.ID_PERUSAHAAN}
          modalClose={closedMdlDelete}
          perushaan={dataDelete}
          handleExeDelete={exeDelete}
        />
      ) : (
        ""
      )}
      {tabMenu ? (
        <Modal show={tabMenu} onHide={() => handleMenuClose()} size="lg">
          <Modal.Body>
            <MenutAuth
              menus={menus}
              setarrView={setarrView}
              setarrCreate={fake}
              setarrUpdate={fake}
              setarrDelete={fake}
              setarrPrint={fake}
              arrView={arrView}
              arrCreate={[]}
              arrUpdate={[]}
              arrDelete={[]}
              arrPrint={[]}
              menuAcces={menuAcces}
              saveResultbtn={() => saveResultbtn()}
              btnFalse={() => handleMenuClose()}
            />
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default DaftarPerusahaan;
