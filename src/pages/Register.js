import React, { useState, useEffect, useContext } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import axios from "../axios/axios.js";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Accordion,
  InputGroup,
  Nav,
} from "react-bootstrap";
import MenutAuth from "../component/compRegister/MenutAuth.js";
import ModalDelete from "../component/compRegister/ModalDelete.js";
import ModalSaveAccs from "../component/compRegister/ModalSaveAccs.js";
import TableUsers from "../component/compRegister/TableUsers.js";
import { AuthContext } from "../auth/AuthProvider.js";
import { toast } from "react-toastify";
import EntitasPerusahaan from "../component/compRegister/EntitasPerusahaan.js";

const Register = () => {
  const { value, mainState } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [users, setUsers] = useState([]);
  const [dataPerushaan, setDataPerusahaan] = useState([]);
  const [menus, setMenus] = useState([]);
  const [menuAcces, setMenuAcces] = useState([]);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [perusahaan, setPerushaan] = useState([]);
  const [namaPerushaan, setNamaPerushaan] = useState("");
  const [nibPerushaan, setNibPerusahaan] = useState("");
  const [npwp, setNpwp] = useState("");
  const [idPerushaan, setIdPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [divisi, setDivis] = useState("");
  const [role, setRole] = useState("");
  const [path, setPath] = useState("");
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(true);
  const [active, setActive] = useState(1);
  const [password, setPassword] = useState("");
  const [noTlp, setNoTlp] = useState("");

  const [disabledPerusahaan, setDisabelPerusahaan] = useState(false);
  const [btnSubmit, setbtnSubmit] = useState(true);
  const [validated, setValidated] = useState(false);
  const [urlSave, seturlSave] = useState("/user");
  const [showModal, setshowModal] = useState(false);
  const [idUserDelete, setidUserDelete] = useState("");
  const [tabMenu, settabMenu] = useState(false);

  const [idUserAccess, setidUserAccess] = useState("");
  const [arrView, setarrView] = useState([]);
  const [arrCreate, setarrCreate] = useState([]);
  const [arrUpdate, setarrUpdate] = useState([]);
  const [arrDelete, setarrDelete] = useState([]);
  const [arrPrint, setarrPrint] = useState([]);
  const [showModalAccs, setshowModalAccs] = useState(false);
  const [arrNewMenu, setarrNewMenu] = useState([]);
  const [query, setQuery] = useState("");
  const [tabs, setTabs] = useState("users");

  const getUsers = async (userNpwp) => {
    if (userNpwp) {
      const response = await axios.get(`/user/perusahaan/${userNpwp}`);
      return setUsers(response.data);
    }
    const response = await axios.get("/user");
    return setUsers(response.data);
  };

  //function cari menu
  const getMenus = async (idPerusahaan) => {
    if (idPerusahaan) {
      const response = await axios.get(`/menubynpwp/${idPerusahaan}`);
      return setMenus(response.data);
    }
    const repsons = await axios.get("/menu");
    return setMenus(repsons.data);
  };

  useEffect(() => {
    async function getDataPerusahaan(id) {
      let urlPerushaan =
        id && mainState.userLevel !== "admin"
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
              const {
                ID_PERUSAHAAN,
                NPWP,
                NIB,
                ALAMAT_PERUSAHAAN,
                NAMA_PERUSAHAAN,
              } = res.data.data[0];
              setIdPerusahaan(ID_PERUSAHAAN);
              setNpwp(NPWP);
              setNibPerusahaan(NIB);
              setAlamat(ALAMAT_PERUSAHAAN);
              setNamaPerushaan(NAMA_PERUSAHAAN);
              setDisabelPerusahaan(mainState.userLevel !== "admin");
              setPerushaan(listPerusahaan);
            }
          }
        })
        .catch((err) => console.log(err.data.message));
    }

    getUsers(idPerusahaan);
    // getDepts();
    getMenus(idPerusahaan);
    getDataPerusahaan(idPerusahaan);
  }, [idPerusahaan, mainState.userLevel]);

  const getMenuAccess = async (id, idPerusahaan) => {
    // loadingOn();

    let url = idPerusahaan
      ? `/useraccess/accessuserperusahaan/${id}/${idPerusahaan}`
      : `/useraccess/${id}`;

    const respons = await axios.get(url);
    const arrViewd = [];
    const arrCreated = [];
    const arrUpdated = [];
    const arrDeleted = [];
    const arrPrintd = [];
    respons.data.forEach((ma) => {
      // console.log(ma.USER_ACESS_VIEW);
      arrViewd.push(ma.USER_ACESS_VIEW === 1 ? true : false);
      arrCreated.push(ma.USER_ACESS_ADD === 1 ? true : false);
      arrUpdated.push(ma.USER_ACESS_MOD === 1 ? true : false);
      arrDeleted.push(ma.USER_ACESS_DELETE === 1 ? true : false);
      arrPrintd.push(ma.USER_ACESS_PRINT === 1 ? true : false);
    });
    setarrView(arrViewd);
    setarrCreate(arrCreated);
    setarrUpdate(arrUpdated);
    setarrDelete(arrDeleted);
    setarrPrint(arrPrintd);
    setMenuAcces(respons.data);
    // console.log(arrUpdated);
    settabMenu(true);
    // loadingOff();
  };

  const resetForm = () => {
    setUsername("");
    setName("");
    // setNamaPerushaan("");
    // setNpwp("");
    // setNibPerusahaan("");
    setDivis("");
    // setAlamat("");
    setNoTlp("");
    setRole("");
    setEmail("");
    setChecked(true);
    setActive(1);
    setPassword("");
    setbtnSubmit(true);
    setPath("");
    setValidated(false);
    seturlSave("/user");
  };

  const saveUser = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      try {
        e.preventDefault();
        const dataUser = {
          USER_INISIAL: name,
          USER_PASS: password,
          USER_NAME: username,
          USER_EMAIL: email,
          USER_PERUSAHAAN: namaPerushaan,
          USER_NIB: nibPerushaan,
          USER_ALAMAT: alamat,
          USER_DIVISI: divisi,
          ID_PERUSAHAAN: idPerushaan,
          USER_NPWP: npwp,
          USER_TEL: noTlp,
          USER_LEVEL: role,
          USER_PATH: path,
          USER_AKTIF_STATUS: active,
          USER_DELETE_STATUS: 0,
          USER_ADD_ID: userId,
        };

        if (!btnSubmit) {
          await axios.patch(urlSave, dataUser);
          toast.success("User Update");
        } else {
          await axios.post(urlSave, dataUser);
          toast.success("User Added");
        }
        resetForm();
        setValidated(false);
        getUsers(idPerusahaan);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const findUser = async (id) => {
    resetForm();
    setbtnSubmit(false);
    seturlSave(`/user/${id}`);
    const responseData = await axios.get(`/user/${id}`);
    const resData = responseData.data;
    console.log(resData);
    setUsername(resData.USER_NAME);
    setName(resData.USER_INISIAL);
    setNamaPerushaan(resData.USER_PERUSAHAAN);
    setNibPerusahaan(resData.USER_NIB);
    setIdPerusahaan(resData.ID_PERUSAHAAN);
    setNpwp(resData.USER_NPWP);
    setDivis(resData.USER_DIVISI);
    setAlamat(resData.USER_ALAMAT);
    setNoTlp(resData.USER_TEL);
    setRole(resData.USER_LEVEL);
    setPath(resData.USER_PATH);
    setEmail(resData.USER_EMAIL);
    setActive(resData.USER_AKTIF_STATUS);
    setPassword("");
    resData.USER_AKTIF_STATUS !== 1 ? setChecked(false) : setChecked(true);
  };

  const onChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value.toLowerCase().trim());
  };

  const onChangeName = (e) => {
    const value = e.target.value;
    setName(value);
  };

  // const onChangNamaPerusahaan = (e) => {
  //   const value = e.target.value;
  //   setNamaPerushaan(value);
  // };

  const onChangeRole = (e) => {
    const value = e.target.value;
    value !== "0"
      ? e.target.classList.remove("text-muted")
      : e.target.classList.add("text-muted");
    setRole(value);
  };

  // const onChangePath = (e) => {
  //   const value = e.target.value;
  //   value !== "0"
  //     ? e.target.classList.remove("text-muted")
  //     : e.target.classList.add("text-muted");
  //   setPath(value);
  // };

  const onChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const onChangeActive = (e) => {
    const valCheck = e.target.checked;
    setChecked(valCheck);
    checked ? setActive(0) : setActive(1);
  };

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };
  const onChangeNoTlp = (e) => {
    const value = e.target.value;
    if (value.length < 14) {
      setNoTlp(value);
    }
  };
  const onChangAlamat = (e) => {
    const value = e.target.value;
    setAlamat(value);
  };
  // const onChangDivisi = (e) => {
  //   const value = e.target.value;
  //   setDivis(value);
  // };
  const onChangNpwp = (e) => {
    const value = e.target.value;
    if (value.length < 20) {
      setNpwp(value);
    }
  };
  const onChangNibPerusahaan = (e) => {
    const value = e.target.value;
    if (value.length < 14) {
      setNibPerusahaan(value);
    }
  };

  const confirmModal = (id) => {
    setidUserDelete(id);
    setshowModal(true);
  };

  const resetMenuArr = () => {
    setidUserAccess("");
    setarrView([]);
    setarrCreate([]);
    setarrUpdate([]);
    setarrDelete([]);
    setarrPrint([]);
    setMenuAcces([]);
    setarrNewMenu([]);
  };

  const userAccessMen = (id) => {
    resetMenuArr();
    setidUserAccess(id);
    if (perusahaan.length > 0) {
      return getMenuAccess(id, perusahaan[0].ID_PERUSAHAAN);
    }
    getMenuAccess(id);
  };

  const saveResultbtn = () => {
    const arrNewAccs = [];
    menuAcces.map(async (menu, index) => {
      const dataAcces = {
        USER_ID: idUserAccess,
        MENU_ID: menu.MENU_ID,
        USER_ACESS_VIEW: arrView[index] ? 1 : null,
        USER_ACESS_ADD: arrCreate[index] ? 1 : null,
        USER_ACESS_MOD: arrUpdate[index] ? 1 : null,
        USER_ACESS_DELETE: arrDelete[index] ? 1 : null,
        USER_ACESS_PRINT: arrPrint[index] ? 1 : null,
      };
      arrNewAccs.push(dataAcces);
    });
    setarrNewMenu(arrNewAccs);

    setshowModalAccs(true);
  };

  function handleQuery(e) {
    const { value } = e.target;
    setQuery(value);
  }

  //find user
  function search(rows) {
    if (rows.length === 0) {
      return rows;
    }

    if (query !== "") {
      const newRow = [...rows];
      if (newRow.length === 0) return [];
      return newRow.filter(
        (row) =>
          String(row.USER_NAME)
            .toLowerCase()
            .indexOf(String(query).toLowerCase()) > -1 ||
          String(row.USER_EMAIL)
            .toLowerCase()
            .indexOf(String(query).toLowerCase()) > -1
      );
    }

    return rows;
  }

  function handlePerusahaan(e) {
    setPerushaan(e);
    if (e.length > 0) {
      const { ID_PERUSAHAAN, NPWP, NIB, ALAMAT_PERUSAHAAN, NAMA_PERUSAHAAN } =
        e[0];
      setIdPerusahaan(ID_PERUSAHAAN);
      setNpwp(NPWP);
      setNibPerusahaan(NIB);
      setAlamat(ALAMAT_PERUSAHAAN);
      setNamaPerushaan(NAMA_PERUSAHAAN);
    } else {
      setIdPerusahaan("");
      setNpwp("");
      setNibPerusahaan("");
      setAlamat("");
      setNamaPerushaan("");
    }
  }

  function handleTab(e) {
    setTabs(e);
  }
  return (
    <>
      <div className="pt-4 child px-2">
        <Card className="shadow border-0">
          <Card.Body className="p-2">
            <Nav
              variant="underline"
              className="mx-3"
              defaultActiveKey="users"
              onSelect={handleTab}
            >
              <Nav.Item>
                <Nav.Link eventKey="users">Users</Nav.Link>
              </Nav.Item>
              {mainState.userLevel === "PIC" ||
              mainState.userLevel === "admin" ? (
                <Nav.Item>
                  <Nav.Link eventKey="entitas">Entitas Perusahaan</Nav.Link>
                </Nav.Item>
              ) : (
                ""
              )}
            </Nav>
            {tabs === "users" ? (
              <Row className="mx-2 mt-2">
                <Col lg={!tabMenu ? 12 : 6}>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Register & Edit Users</Accordion.Header>
                      <Accordion.Body>
                        <Form
                          onSubmit={saveUser}
                          noValidate
                          validated={validated}
                        >
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forUsername"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Username
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="text"
                                placeholder="jhondee"
                                value={username}
                                onChange={onChangeUsername}
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input a username.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forName"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Nama User
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Jhon Dee"
                                value={name}
                                onChange={onChangeName}
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input a Name.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forNoTlp"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Phone
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="text"
                                placeholder="081xxxxx"
                                value={noTlp}
                                onChange={onChangeNoTlp}
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input a Name.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forPerusahaan"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Nama Perusahaan
                            </Form.Label>
                            <Col sm={8}>
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
                              {/* <Form.Control
                              size="sm"
                              type="text"
                              placeholder="PT Sample Indonesia"
                              value={namaPerushaan}
                              onChange={onChangNamaPerusahaan}
                              required
                            /> */}
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input a username.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forNpwp"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              NPWP Perusahaan
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="number"
                                placeholder="000000"
                                value={npwp}
                                disabled
                                onChange={onChangNpwp}
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input NPWP.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forNibPerusahaan"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              NIB Perusahaan
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="number"
                                placeholder="000000"
                                value={nibPerushaan}
                                onChange={onChangNibPerusahaan}
                                disabled
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input Nib.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          {/* <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="forDivisi"
                        >
                          <Form.Label className="text" size="sm" column sm="4">
                            Divisi
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              size="sm"
                              type="text"
                              placeholder="divisi"
                              value={divisi}
                              onChange={onChangDivisi}
                              required
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Please input Nib.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group> */}
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forAlamat"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Alamat Perusahaan
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                as="textarea"
                                rows={3}
                                placeholder="alamat"
                                value={alamat}
                                onChange={onChangAlamat}
                                disabled
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please input Nib.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forEmail"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Email address
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={onChangeEmail}
                                required
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="passwordForm"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Password
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                size="sm"
                                type="password"
                                placeholder="Password"
                                minLength={6}
                                value={password}
                                onChange={onChangePassword}
                                autoComplete="on"
                                required
                              />
                              <Form.Control.Feedback>
                                Looks good!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Password minimum length 6 caracther
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="forRole"
                          >
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Role
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Select
                                size="sm"
                                aria-label="select role"
                                className="text-muted"
                                onChange={onChangeRole}
                                value={role}
                              >
                                <option value="0">Select Role</option>
                                <option key={1} value="ADM">
                                  ADM
                                </option>
                                <option key={2} value="PIC">
                                  PIC
                                </option>
                                {/* <option key={4} value="admin">
                                  ADMINISTRATOR
                                </option> */}
                              </Form.Select>
                            </Col>
                          </Form.Group>
                          {/* <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="selectPath"
                        >
                          <Form.Label className="text" size="sm" column sm="4">
                            Direct Path
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Select
                              size="sm"
                              aria-label="select Path"
                              className="text-muted"
                              onChange={onChangePath}
                              value={path}
                            >
                              <option value="">Select Path</option>
                              {menus
                                .filter((men) => men.MENU_PATH !== null)
                                .map((menu) => (
                                  <option
                                    key={menu.MENU_ID}
                                    value={menu.MENU_PATH}
                                  >
                                    {menu.MENU_PATH}
                                  </option>
                                ))}
                            </Form.Select>
                          </Col>
                        </Form.Group> */}
                          <Form.Group as={Row}>
                            <Form.Label
                              className="text"
                              size="sm"
                              column
                              sm="4"
                            >
                              Status Active
                            </Form.Label>
                            <Col sm={4}>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  aria-checked
                                  checked={checked}
                                  value={active}
                                  onChange={onChangeActive}
                                ></input>
                                <label className="form-check-label">
                                  {active === 1 ? "Active" : "Disabled"}
                                </label>
                              </div>
                            </Col>
                          </Form.Group>
                          <Row className="justify-content-end">
                            <Col className="text-end" sm={4}>
                              {btnSubmit ? (
                                <Button
                                  variant="primary"
                                  type="submit"
                                  size="sm"
                                >
                                  Add User
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    className="me-1"
                                    size="sm"
                                    variant="warning"
                                    type="submit"
                                  >
                                    Update
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => resetForm()}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </Col>
                          </Row>
                        </Form>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <Row className="mt-3 px-2">
                    <Col className="shadow">
                      <Row className="mt-2">
                        <Col xs={6} xl={!tabMenu ? 5 : 6}>
                          <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">
                              Cari User
                            </InputGroup.Text>
                            <Form.Control
                              value={query}
                              onChange={handleQuery}
                              placeholder="Username/email"
                              aria-label="finduser"
                              aria-describedby="basic-addon1"
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                      <TableUsers
                        users={search(users)}
                        findUser={findUser}
                        confirmModal={confirmModal}
                        userAccessMen={userAccessMen}
                      />
                    </Col>
                  </Row>
                  {showModal ? (
                    <ModalDelete
                      showModal={showModal}
                      idUserDelete={idUserDelete}
                      handleClose={() => setshowModal(false)}
                      getUsers={() => getUsers(idPerusahaan)}
                    />
                  ) : (
                    ""
                  )}
                </Col>
                {tabMenu ? (
                  <>
                    <MenutAuth
                      colSize={6}
                      menus={menus}
                      setarrView={setarrView}
                      setarrCreate={setarrCreate}
                      setarrUpdate={setarrUpdate}
                      setarrDelete={setarrDelete}
                      setarrPrint={setarrPrint}
                      arrView={arrView}
                      arrCreate={arrCreate}
                      arrUpdate={arrUpdate}
                      arrDelete={arrDelete}
                      arrPrint={arrPrint}
                      menuAcces={menuAcces}
                      tabMenu={tabMenu}
                      saveResultbtn={() => saveResultbtn()}
                      btnFalse={() => settabMenu(false)}
                    />
                  </>
                ) : (
                  ""
                )}
              </Row>
            ) : (
              ""
            )}
            {tabs === "entitas" ? (
              <Row className="mx-2 mt-2">
                <Col>
                  <EntitasPerusahaan
                    perusahaan={perusahaan}
                    dataPerushaan={dataPerushaan}
                    disabledPerusahaan={disabledPerusahaan}
                    handlePerusahaan={handlePerusahaan}
                  />
                </Col>
              </Row>
            ) : (
              ""
            )}
          </Card.Body>
        </Card>
        <ModalSaveAccs
          showModalAccs={showModalAccs}
          handleCloseAccs={() => setshowModalAccs(false)}
          arrNewMenu={arrNewMenu}
        />
      </div>
    </>
  );
};

export default Register;
