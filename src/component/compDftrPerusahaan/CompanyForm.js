import React, { useContext } from "react";
import {
  Form,
  Button,
  InputGroup,
  Modal,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import axios from "../../axios/axios";
import { toast } from "react-toastify";

import { AuthContext } from "../../auth/AuthProvider";
// import TypeHeadEdit from "../../partial/TypeHeadEdit";

const CompanyForm = ({
  show,
  handleClose,
  getDataPerusahaan,
  formData,
  setFormData,
  method,
}) => {
  const { value } = useContext(AuthContext);
  const { userId } = value;

  const onlyNumber = [
    // "ID_PERUSAHAAN",
    "NPWP",
    "NIB",
    "PHONE_PIC",
    "TLP_PERUSAHAAN",
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    const pattern = /^[0-9]*$/;
    if (onlyNumber.includes(name) && !pattern.test(value)) {
      return;
    }
    if (name === "ID_PERUSAHAAN" && value.length > 10) {
      return;
    }
    if (onlyNumber.includes(name) && value.length > 15) {
      return;
    }
    if (!onlyNumber.includes(name) && name !== "EMAIL_PIC") {
      return setFormData((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase(),
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataPost = { ...formData, user_add_id: userId };
    await axios[method](`/perusahaan`, dataPost)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message, { autoClose: 3000 });
          getDataPerusahaan();
          handleClose();
        }
      })
      .catch((err) => console.log(err.data));
  };

  return (
    <Modal
      // dialogClassName="modal-90w"
      size="lg"
      backdrop="static"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {method === "post" ? "Tambah Daftar" : "Edit Data"} Perusahaan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <div className="text-danger fst-italic">
            *Semua kolom wajib di isi
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3" controlId="id_perusahaan">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      ID Perusahaan
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan ID Perusahaan"
                      name="ID_PERUSAHAAN"
                      value={formData.ID_PERUSAHAAN}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="nama_perusahaan">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Nama Perusahaan
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Nama Perusahaan"
                      name="NAMA_PERUSAHAAN"
                      value={formData.NAMA_PERUSAHAAN}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="alamat_perushaan">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Alamat Perusahaan
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      placeholder="Masukkan Alamat Perusahaan"
                      name="ALAMAT_PERUSAHAAN"
                      value={formData.ALAMAT_PERUSAHAAN}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="KOTA_PERUSAHAAN">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Kota Perusahaan
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Kota Perusahaan"
                      name="KOTA_PERUSAHAAN"
                      value={formData.KOTA_PERUSAHAAN}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="TLP_PERUSAHAAN">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Telepon Perusahaan
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Telepon Perusahaan"
                      name="TLP_PERUSAHAAN"
                      value={formData.TLP_PERUSAHAAN}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="penanggungjawab">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Penanggung Jawab
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Penanggung Jawab Perusahaan"
                      name="PENANGGUNGJAWAB"
                      value={formData.PENANGGUNGJAWAB}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="JABATAN_PENANGGUNGJAWAB"
                >
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Jabatan Penanggungjawab
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Jabatan Penanggungjawab"
                      name="JABATAN_PENANGGUNGJAWAB"
                      value={formData.JABATAN_PENANGGUNGJAWAB}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nama_pic">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Nama PIC
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Nama PIC"
                      name="NAMA_PIC"
                      value={formData.NAMA_PIC}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email_pic">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Email PIC
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Masukkan Email PIC"
                      name="EMAIL_PIC"
                      value={formData.EMAIL_PIC}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone_pic">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Phone PIC
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Phone PIC"
                      name="PHONE_PIC"
                      value={formData.PHONE_PIC}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="tgl_expire">
                  <InputGroup>
                    <InputGroup.Text style={{ width: "250px" }}>
                      Tanggal Expire
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      // format="dd/mm/yyyy"
                      // placeholder=""
                      name="TGL_EXPIRE"
                      value={formData.TGL_EXPIRE}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="primary" type="submit">
                Simpan
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyForm;
