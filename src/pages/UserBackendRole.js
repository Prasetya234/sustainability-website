import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Button, Table, Modal, Form } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import { AuthContext } from "../auth/AuthProvider";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import DropdownCus from "../partial/DropdownCus";
import MenutAuth from "../component/compRegister/MenutAuth";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const intialBeObj = {
  BE_ROLE_NAME: "",
  BE_STATUS: 1,
  BE_ROLE_TYPE: 3,
  BE_PATH: "",
  BE_NOTE: "",
};

const UserBackendRole = () => {
  const { value, mainState } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [show, setShow] = useState(false);
  const [listBE, setListBe] = useState([]);
  const [listTypeRole, setListTypeRole] = useState([]);
  const [method, setMethod] = useState("post");
  const [beId, setBeId] = useState("post");
  const [actType, setActionType] = useState("CREATE");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menus, setMenus] = useState([]);
  const [tabMenu, settabMenu] = useState(false);
  const [dataPerushaan, setDataPerusahaan] = useState([]);
  const [idPerushaan, setIdPerusahaan] = useState("");
  const [perusahaan, setPerushaan] = useState([]);
  const [disabledPerusahaan, setDisabelPerusahaan] = useState(false);

  //menu access perushaan
  const [arrView, setarrView] = useState([]);
  const [menuAcces, setMenuAcces] = useState([]);

  const [formData, setFormData] = useState(intialBeObj);

  //function cari menu
  const getMenus = async (idPerusahaan) => {
    if (idPerusahaan) {
      const response = await axios.get(`/menubynpwp/${idPerusahaan}`);
      return setMenus(response.data);
    }
    const repsons = await axios.get("/menu");
    return setMenus(repsons.data);
  };

  function handleClose() {
    setShow(false);
    setFormData(intialBeObj);
    setActionType("Create");
  }

  function handleShow() {
    handleMethodChange("post");
    setShow(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  function handleStatus(value) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        BE_STATUS: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dataPost = {
      ...formData,
      BE_ID_PERUSAHAAN: idPerushaan,
      BE_ADD_ID: userId,
    };

    await axios[method](`/backend-role`, dataPost)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message, { autoClose: 3000 });
          getListBe(idPerusahaan);
          handleClose();
          setFormData(intialBeObj);
        }
      })
      .catch((err) => toast.error(err.data.message, { autoClose: 3000 }));
  }

  function handleMethodChange(chgMethod) {
    setMethod(chgMethod);
  }

  async function getListBe(idPerusahaan) {
    let url = `/backend-role`;

    if (idPerusahaan) {
      url = `/backend-role?idperusahaan=${idPerusahaan}`;
    }

    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          setListBe(res.data.data);
        }
      })
      .catch((err) => toast.error(err.data.message, { autoClose: 3000 }));
  }

  //for getlist type role
  async function getLisTypeRole(userLevel) {
    let url = `/backend-role/type-role`;

    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          // const filterType = res.data.data.filter(item => item.TYPE_ROLE_ID === 3);
          setListTypeRole(res.data.data);
        }
      })
      .catch((err) => toast.error(err.data.message, { autoClose: 3000 }));
  }

  const resetMenuArr = () => {
    setBeId("");
    setarrView([]);
  };

  const getMenuAccess = async (id, idPerusahaan) => {
    // loadingOn();

    let url = `/backend-role/detail-role/${id}/${idPerusahaan}`;

    const respons = await axios.get(url);
    const arrViewd = [];
    if(respons.data.data.length === 0) return toast.warning('No Permission Menu For Company Please call Administrator', {autoClose: 3500})
    respons.data.data.forEach((ma) => {
      arrViewd.push(ma.USER_ACESS_VIEW === 1 ? true : false);
    });

    setarrView(arrViewd);
    setMenuAcces(respons.data.data);
    settabMenu(true);
    setIdPerusahaan(idPerusahaan);
  };

  //model open funct role \ menu auth
  function openMdlMenu(idBe) {
    resetMenuArr();
    setBeId(idBe);
    const findBe = listBE.filter((item) => item.BE_ID === idBe);

    return getMenuAccess(idBe, findBe[0].BE_ID_PERUSAHAAN);
  }

  function editeBe(idBe) {
    const findBe = listBE.filter((item) => item.BE_ID === idBe);
    setActionType("Edit");

    if (findBe.length > 0) {
      setFormData(findBe[0]);
    }
    setShow(true);
  }

  function actionList(id) {
    return [
      { actionLable: "Edit", actExe: () => editeBe(id) },
      {
        actionLable: "Fucntion Role",
        actExe: () => openMdlMenu(id),
      },
    ];
  }
  function handleMenuClose() {
    setarrView([]);

    setMenuAcces([]);
    settabMenu(false);
    setBeId("");
  }

  //fake function
  function fake(a) {
    return;
  }

  const saveResultbtn = async () => {
    const arrNewAccs = menuAcces.map((menu, index) => {
      const dataAcces = {
        ID_PERUSAHAAN: idPerushaan,
        BE_ID: beId,
        ACCESS_MENU_ID: arrView[index] ? menu.MENU_ID : null,
        USER_ACESS_VIEW: arrView[index] ? 1 : null,
        ADD_ID: userId,
        MENU_NAME: menu.MENU_TITLE,
      };
      return dataAcces;
    });

    const filterAccKosong = arrNewAccs.filter(
      (acc) => acc.ACCESS_MENU_ID !== null
    );

    await axios
      .post(`/backend-role/detail-role/${beId}`, filterAccKosong)
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
        toast.error("Something wrong call administrator", { autoClose: 3000 });
      });
  };

  useEffect(() => {
    async function getDataPerusahaan(id) {
      let urlPerushaan =
        id && mainState.userLevel !== "sa"
          ? `/perusahaan/${id}`
          : `/perusahaan`;
      await axios
        .get(urlPerushaan)
        .then((res) => {
          if (res.status === 200 && res.data.data?.length > 0) {
            const listPerusahaan = res.data.data.map((per) => ({
              ...per,
              id: per.ID_PERUSAHAAN,
              name: `${per.ID_PERUSAHAAN} - ${per.NAMA_PERUSAHAAN}`,
            }));
            setDataPerusahaan(listPerusahaan);

            if (res.data.data?.length === 1) {
              const { ID_PERUSAHAAN } = res.data.data[0];
              setIdPerusahaan(ID_PERUSAHAAN);
              setPerushaan(listPerusahaan);
              setDisabelPerusahaan(mainState.userLevel !== "sa");
            }
          }
        })
        .catch((err) => console.log(err.data.message));
    }

    getMenus(idPerusahaan);
    getDataPerusahaan(idPerusahaan);
    getListBe(idPerusahaan);
    getLisTypeRole(mainState.userLevel);
  }, [idPerusahaan, mainState.userLevel]);

  function handlePerusahaan(e) {
    setPerushaan(e);
    if (e.length > 0) {
      const { ID_PERUSAHAAN } = e[0];
      setIdPerusahaan(ID_PERUSAHAAN);
    } else {
      setIdPerusahaan("");
    }
  }
  return (
    <>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row>
              <Col>
                <Button size="sm" ariant="primary" onClick={() => handleShow()}>
                  Add
                </Button>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Table responsive hover>
                  <thead>
                    <tr >
                      <th className="text-muted">Role Name</th>
                      <th className="text-muted">Status</th>
                      <th className="text-muted">Note</th>
                      <th className="text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBE?.map((item) => (
                      <tr
                        key={item.BE_ID}
                        style={{ height: "50px" }}
                        className=" align-middle "
                      >
                        <td className="text-muted">{item.BE_ROLE_NAME}</td>
                        <td className="text-muted">
                          {item.BE_STATUS ? (
                            <span className="text-success">ENABLED</span>
                          ) : (
                            <span className="text-danger">DISABLED"</span>
                          )}
                        </td>
                        <td className="text-muted">{item.BE_NOTE}</td>
                        <td className="text-muted">
                          <DropdownCus
                            label={"Action"}
                            dropdownId={`dropdown${item.BE_ID}`}
                            items={actionList(item.BE_ID)}
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardShadow>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>{actType}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mx-3">
              <Form.Group as={Row} className="mb-3" controlId="forPerusahaan">
                <Form.Label className="text text-end" size="sm" column sm={3}>
                  Perusahaan
                </Form.Label>
                <Col sm={9}>
                  <Typeahead
                    clearButton
                    id="perusahaan"
                    labelKey="name"
                    onChange={handlePerusahaan}
                    options={dataPerushaan}
                    selected={perusahaan}
                    disabled={disabledPerusahaan}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-4"
                controlId="formHorizontalEmail"
              >
                <Form.Label column sm={3} className="text-end">
                  <span className="text-danger">*</span> Role Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="BE_ROLE_NAME"
                    onChange={handleChange}
                    value={formData.BE_ROLE_NAME}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4">
                <Form.Label as="legend" column sm={3} className="text-end">
                  Status
                </Form.Label>
                <Col sm={2} className="align-content-center">
                  <Form.Check
                    type="radio"
                    label="Enable"
                    name="enable"
                    checked={formData.BE_STATUS}
                    id="formEnable"
                    onChange={() => handleStatus(1)}
                  />
                </Col>
                <Col className="align-content-center">
                  <Form.Check
                    type="radio"
                    label="Disabled"
                    name="disabled"
                    checked={!formData.BE_STATUS}
                    onChange={() => handleStatus(0)}
                    id="formDisabled"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="roleType">
                <Form.Label column sm={3} className="text-end">
                  Role Type
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    aria-label="Default select role"
                    name="BE_ROLE_TYPE"
                    defaultValue={3}
                    onChange={handleChange}
                  >
                    {listTypeRole?.map((item) => (
                      <option key={item.TYPE_ROLE_ID} value={item.TYPE_ROLE_ID}>
                        {item.TYPE_ROLE_NAME}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="path">
                <Form.Label column sm={3} className="text-end">
                  Path/Url
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="BE_PATH"
                    onChange={handleChange}
                    value={formData.BE_PATH}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="formNote">
                <Form.Label column sm={3} className="text-end">
                  Note
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="textarea"
                    row={4}
                    name="BE_NOTE"
                    onChange={handleChange}
                    value={formData.BE_NOTE}
                  />
                </Col>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              size="sm"
              className="me-2"
              variant="outline-secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

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
              saveResultbtn={() => saveResultbtn(idPerushaan)}
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

export default UserBackendRole;
