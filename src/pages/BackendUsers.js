import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { CardShadow } from "../partial/CardShadow";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import ModalAddUser from "../component/compBeUser/ModalAddUser";
import DropdownCus from "../partial/DropdownCus";
import ModalResetPass from "../component/compBeUser/ModalResetPass";
import ModalDetailUser from "../component/compBeUser/ModalDetailUser";
import Swal from "sweetalert2";

const initalObj = {
  USER_INISIAL: "",
  USER_PASS: "",
  CONFIRM_PASS: "",
  USER_NAME: "",
  USER_EMAIL: "",
  USER_PERUSAHAAN: "",
  ID_PERUSAHAAN: "",
  USER_JOB_TITLE: "",
  USER_TEL: "",
  KODE_TEL: "+62",
  USER_LEVEL: "",
  USER_PATH: "",
  USER_AKTIF_STATUS: 1,
  USER_DELETE_STATUS: 0,
  USER_ADD_ID: "",
  SUMMARY: "",
  BE_ID: "",
};

const BackendUsers = () => {
  const { value, mainState } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [listPerusahaan, setListPerusahaan] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [perusahaan, setPerusahaan] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [disabledPerusahaan, setDisabelPerusahaan] = useState(false);
  const [idPerushaan, setIdPerusahaan] = useState("");
  const [actType, setActType] = useState("Create");
  const [modalAdd, setModalAdd] = useState(false);
  const [mdlDetail, setMdlDetail] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const [formData, setFormData] = useState(initalObj);
  const [validated, setValidated] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [queryFilter, setQueryFilter] = useState({
    role: "",
    userName: "",
    status: "",
  });
  const [errors, setErrors] = useState({
    passwordError: "",
    confirmPassError: "",
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const getUsers = async (idcomp) => {
    let urlGetUser = `/user`;

    if (idcomp) {
      urlGetUser = urlGetUser + `?id_perusahaan=${idcomp}`;
    }
    const response = await axios.get(urlGetUser);

    return setListUser(response.data);
  };

  async function getListBe(idPerusahaan) {
    let url = `/backend-role`;

    if (idPerusahaan) {
      url = `/backend-role?idperusahaan=${idPerusahaan}`;
    }

    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          
          const filterZeroAccess = res.data.data.filter(item => item.TTL_ID_ACCESS > 0)
          setListRole(filterZeroAccess);
        }
      })
      .catch((err) => toast.error(err.data.message, { autoClose: 3000 }));
  }

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
            setListPerusahaan(listPerusahaan);

            if (res.data.data?.length === 1) {
              const { ID_PERUSAHAAN } = res.data.data[0];
              setIdPerusahaan(ID_PERUSAHAAN);
              setPerusahaan(listPerusahaan)
              setDisabelPerusahaan(mainState.userLevel !== "sa");
            }
          }
        })
        .catch((err) => console.log(err.data.message));
    }

    getDataPerusahaan(idPerusahaan);
    getListBe(idPerusahaan);
    getUsers(idPerusahaan);
  }, [idPerusahaan, mainState.userLevel]);

  function handleOpnMdl() {
    setModalAdd(true);
    setActType("Create");
  }

  function hdlMdlClose() {
    setModalAdd(false);
    setFormData(initalObj);
    setValidated(false);
    setPerusahaan([]);
  }

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!validateEmail(formData.USER_EMAIL)) {
      setIsValidEmail(false);
      return;
    }

    if (actType === "Create") {
      if (
        formData.USER_PASS.length < 8 ||
        formData.USER_PASS !== formData.CONFIRM_PASS
      ) {
        setErrors({
          passwordError:
            formData.USER_PASS.length < 8
              ? "Password length min 8 charcter"
              : "",
          confirmPassError:
            formData.USER_PASS !== formData.CONFIRM_PASS
              ? "Password not match"
              : "",
        });
        return;
      }
    }

    if (perusahaan.length === 0) {
      return toast.warning("Please Select Perusahaan", { autoClose: 2000 });
    }

    if (e.currentTarget.checkValidity() === false) {
      setValidated(true);
    } else {
      const { ID_PERUSAHAAN } = perusahaan[0];
      let dataPost = {
        ...formData,
        ID_PERUSAHAAN: ID_PERUSAHAAN,
        USER_ADD_ID: userId,
      };
      if (actType === "Create") {
        await axios
          .post("/user", dataPost)
          .then((res) => {
            if (res.status === 200) {
              getUsers(idPerusahaan);
              toast.success(res.data.message, { autoClose: 2000 });
              hdlMdlClose();
            }
            if (res.status === 202) {              
              toast.warning(res.data.message, { autoClose: 2000 });
            }
          })
          .catch((err) => {
            
            toast.danger("Something went wrong", { autoClose: 2000 });
          });
      } else {
        delete dataPost.USER_PASS;
        dataPost.USER_MOD_ID = userId;
        await axios
          .patch(`/user/${formData.USER_ID}`, dataPost)
          .then((res) => {
            if (res.status === 200) {
              getUsers(idPerusahaan);
              toast.success(res.data.message, { autoClose: 2000 });
              hdlMdlClose();
            }
          })
          .catch((err) => {
            toast.danger("Something went wrong", { autoClose: 2000 });
          });
      }
    }
  }

  function editeBe(idUser) {
    const findUser = listUser.find((item) => item.USER_ID === idUser);

    if (listPerusahaan.length > 1) {
      const findPerushaan = listPerusahaan.filter(
        (item) => item.ID_PERUSAHAAN === findUser.ID_PERUSAHAAN
      );
      setPerusahaan(findPerushaan);
    } else {
      setDisabelPerusahaan(true);
      setPerusahaan(listPerusahaan);
    }

    if (findUser.USER_ID) {
      setActType("Edit");
      setFormData(findUser);
      setModalAdd(true);
    }
  }

  function openMdlResetPass(id) {
    const findUser = listUser.find((item) => item.USER_ID === id);
    findUser.USER_PASS = "";
    findUser.CONFIRM_PASS = "";
    setFormData(findUser);
    setShowResetPass(true);
  }

  function clsMdlResetPass() {
    setFormData(initalObj);
    setShowResetPass(false);
  }

  async function hdlSubmitResetPass(e) {
    e.preventDefault();
    e.stopPropagation();
    if (
      formData.USER_PASS.length < 8 ||
      formData.USER_PASS !== formData.CONFIRM_PASS
    ) {
      setErrors({
        passwordError:
          formData.USER_PASS.length < 8 ? "Password length min 8 charcter" : "",
        confirmPassError:
          formData.USER_PASS !== formData.CONFIRM_PASS
            ? "Password not match"
            : "",
      });
      return;
    }
    if (e.currentTarget.checkValidity() === false) {
      setValidated(true);
    } else {
      const dataPost = { ...formData, USER_MOD_ID: userId };
      await axios
        .patch(`/user/${formData.USER_ID}`, dataPost)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message, { autoClose: 2000 });
            clsMdlResetPass();
          }
        })
        .catch((err) => {
          toast.danger("Something went wrong", { autoClose: 2000 });
        });
    }
  }

  function opnMdlDeatil(id) {
    const findUser = listUser.find((item) => item.USER_ID === id);
    findUser.USER_PASS = "";
    findUser.CONFIRM_PASS = "";
    setFormData(findUser);
    setMdlDetail(true);
  }

  function hdlClsMdlDetail() {
    setMdlDetail(false);
    setFormData(initalObj);
  }

  async function deleteUser(id) {
    Swal.fire({
      text: `Are You Sure Delete User ?`,
      icon: "question",
      confirmButtonColor: "#2275f2",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const dataPost = { USER_AKTIF_STATUS: 0, USER_DELETE_STATUS: 1 };
        await axios
          .patch(`/user/${id}`, dataPost)
          .then((res) => {
            if (res.status === 200) {
              getUsers(idPerusahaan);
              toast.success("Success Deleted Users", { autoClose: 2000 });
            }
          })
          .catch((err) => {
            toast.danger("Something went wrong", { autoClose: 2000 });
          });
      }
    });
  }

  function actionList(id) {
    return [
      {
        actionLable: "Reset Password",
        actExe: () => openMdlResetPass(id),
      },
      { actionLable: "Edit", actExe: () => editeBe(id) },
      {
        actionLable: "Detail",
        actExe: () => opnMdlDeatil(id),
      },
      {
        actionLable: "Delete",
        actExe: () => deleteUser(id),
      },
    ];
  }

  function hdlChgQuery(e) {
    const {value, name} = e.target
    setQueryFilter((prevFormData) => {
      return {
        ...prevFormData,
        [name]:value,
      };
    });
  }

  function filtersUsers(users, queryFilter) {
    if (!users) return [];
    const { role, userName, status } = queryFilter;
    let newUser = [...users];

    if (status) {
      newUser = newUser.filter(
        (item) => item.USER_AKTIF_STATUS === parseInt(status)
      );
    }
    if (role) {
      newUser = newUser
        .filter((item) => item.BE_ROLE_NAME)
        .filter((neitem) => neitem.BE_ROLE_NAME.toLowerCase().includes(role));
    }
    if (userName) {
      newUser = newUser
        .filter((item) => item.USER_NAME)
        .filter((neitem) => neitem.USER_NAME.toLowerCase().includes(userName));
    }
    return newUser;
  }
  return (
    <>
      <Row className="m-0 mt-2">
        <Col>
          <CardShadow>
            <Row>
              <Col sm={3}>
                <Button
                  size="sm"
                  ariant="primary"
                  onClick={() => handleOpnMdl()}
                >
                  Add
                </Button>
              </Col>
              <Col className="">
                <Form.Group as={Row} className="mb-4" controlId="summary">
                  <Col className=" align-content-center text-end">Filter :</Col>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      name="role"
                      size="sm"
                      placeholder="Please enter the role"
                      value={queryFilter.role}
                      onChange={hdlChgQuery}
                    />
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      name="userName"
                      size="sm"
                      placeholder="Please enter the Username"
                      value={queryFilter.userName}
                      onChange={hdlChgQuery}
                    />
                  </Col>
                  <Col sm={3}>
                    <Form.Select
                      aria-label="Default select status"
                      value={queryFilter.status}
                      onChange={hdlChgQuery}
                      name="status"
                      placeholder="Select status"
                      size="sm"
                    >
                      <option value=""></option>
                      <option value="1">Enabled</option>
                      <option value="0">Disabled</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
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
                    {filtersUsers(listUser, queryFilter)?.map((item) => (
                      <tr
                        key={item.USER_ID}
                        className="align-middle"
                        style={{ height: "60px" }}
                      >
                        <td>{item.USER_NAME}</td>
                        <td>{item.USER_INISIAL}</td>
                        <td>{item.BE_ROLE_NAME}</td>
                        <td>
                          {item.USER_AKTIF_STATUS ? (
                            <span className="text-success">Enabled</span>
                          ) : (
                            <span className="text-danger">Disabled</span>
                          )}
                        </td>
                        <td>
                          <DropdownCus
                            label={"Action"}
                            dropdownId={`dropdown${item.USER_ID}`}
                            items={actionList(item.USER_ID)}
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
      <ModalAddUser
        show={modalAdd}
        disabledPerusahaan={disabledPerusahaan}
        handleClose={hdlMdlClose}
        actType={actType}
        handleSubmit={handleSubmit}
        listRole={listRole}
        listPerushaan={listPerusahaan}
        perusahaan={perusahaan}
        setPerusahaan={setPerusahaan}
        idPerushaan={idPerushaan}
        userId={userId}
        formData={formData}
        setFormData={setFormData}
        validated={validated}
        errors={errors}
        setErrors={setErrors}
        isValidEmail={isValidEmail}
        setIsValidEmail={setIsValidEmail}
        validateEmail={validateEmail}
      />
      <ModalResetPass
        show={showResetPass}
        handleClose={clsMdlResetPass}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        setFormData={setFormData}
        validated={validated}
        handleSubmit={hdlSubmitResetPass}
      />
      <ModalDetailUser
        dataUser={formData}
        show={mdlDetail}
        handleClose={hdlClsMdlDetail}
      />
    </>
  );
};

export default BackendUsers;
