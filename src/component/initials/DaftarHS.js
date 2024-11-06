import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

import axios from "../../axios/axios";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";

const DaftarHS = ({ show, handleClose }) => {
  const { value } = useContext(AuthContext);
  const { userId } = value;
  const [validated, setValidated] = useState(false);
  const [dataHs, setDataHs] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [valHs, setValHS] = useState({});

  //function save HS
  async function saveHs(e) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setErrMsg("");

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      const data = { ...valHs, ADD_ID: userId };

      await axios
        .post("/referensi/kode-hs", data)
        .then((res) => {
          if (res.status === 200) {
            const newData = [...dataHs, res.data.data];

            setDataHs(newData);
            setValHS({});
          }
        })
        .catch((err) => {
          setErrMsg(err.response.data.message);
        });
    }
  }

  function handleChangeHS(e) {
    const { name, value } = e.target;
    const newValue = { ...valHs };
    if (name === "NOMOR_HS" && value < 0) return;
    newValue[name] =
      name === "URAIAN_HS" && name !== "" ? value.toUpperCase() : value;
    setValHS(newValue);
  }

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Daftar HS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="text-danger fst-italic ">{errMsg}</Col>
        </Row>
        <Form onSubmit={saveHs} noValidate validated={validated}>
          <Row>
            <Col sm={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="noHS">Nomor HS</InputGroup.Text>
                <Form.Control
                  aria-label="nomorHs"
                  aria-describedby="noHS"
                  type="number"
                  value={valHs.NOMOR_HS}
                  onChange={handleChangeHS}
                  name="NOMOR_HS"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Harap Isi Nomor HS
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="uraianHS">Uraian HS</InputGroup.Text>
                <Form.Control
                  aria-label="uraianhs"
                  aria-describedby="uraianHS"
                  type="text"
                  name="URAIAN_HS"
                  value={valHs.URAIAN_HS}
                  onChange={handleChangeHS}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Harap Isi Uraian HS
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
            <Col sm={3}>
              <Button size="sm" variant="primary" type="submit">
                Simpan
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col>
            <Table size="sm" striped bordered responsive hover>
              <thead>
                <tr className="text-center table-secondary">
                  <th className="text-start">Nomor HS</th>
                  <th>Uraian</th>
                  {/* <th>Kode Jenis Pungutan</th>
                  <th>Kode Jenis Tarif BM</th>
                  <th>Tarif</th>
                  <th>Lartas</th>
                  <th>Kode Satuan</th>
                  <th>Kode Fasilitas</th> */}
                </tr>
              </thead>
              <tbody>
                {dataHs.map((hs) => (
                  <tr key={hs.NOMOR_HS}>
                    <td>{hs.NOMOR_HS}</td>
                    <td>{hs.URAIAN_HS}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {/* <Row>
          <Col>
            <Button variant="secondary" onClick={handleClose}>
              Tutup
            </Button>
          </Col>
        </Row> */}
      </Modal.Body>
    </Modal>
  );
};

export default DaftarHS;
