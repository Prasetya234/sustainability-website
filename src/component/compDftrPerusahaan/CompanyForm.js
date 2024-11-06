import React, { useContext } from "react";
import { Form, Button, InputGroup, Modal, Row, Col } from "react-bootstrap";
import axios from "../../axios/axios";
import { toast } from "react-toastify";

import { AuthContext } from "../../auth/AuthProvider";
import TypeHeadEdit from "../../partial/TypeHeadEdit";

const CompanyForm = ({
  show,
  handleClose,
  getDataPerusahaan,
  formData,
  setFormData,
  method,
  listKantorPabean,
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

  function kodeKantorLayanan(kantor) {
    if (kantor.length > 0) {
      const dataKantor = {
        value: kantor[0].KODE_KANTOR,
        name: "KODE_KANTOR_PABEAN",
      };
      return handleChange({ target: dataKantor });
    } else {
      return handleChange({
        target: {
          value: "",
          name: "KODE_KANTOR_PABEAN",
        },
      });
    }
  }

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
      dialogClassName="modal-90w"
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
        <div className="text-danger fst-italic">*Semua kolom wajib di isi</div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={12} md={6}>
              <Form.Group className="mb-3" controlId="id_perusahaan">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
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

              <Form.Group className="mb-3" controlId="npwp">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
                    NPWP
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan NPWP"
                    name="NPWP"
                    value={formData.NPWP}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nib">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
                    NIB
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan NIB"
                    name="NIB"
                    value={formData.NIB}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="noSkep">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
                    Nomor Dokumen SKEP
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nomor Dokumen Skep TPB"
                    name="NOMOR_SKEP"
                    value={formData.NOMOR_SKEP}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="tglSkep">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
                    Tgl Dokumen SKEP
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    placeholder="Masukkan Tanggal Skep"
                    name="TANGGAL_SKEP"
                    value={formData.TANGGAL_SKEP}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nama_perusahaan">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
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
                  <InputGroup.Text style={{ width: "170px" }}>
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
                  <InputGroup.Text style={{ width: "170px" }}>
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
                  <InputGroup.Text style={{ width: "170px" }}>
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
                  <InputGroup.Text style={{ width: "170px" }}>
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
              <Form.Group className="mb-3" controlId="JABATAN_PENANGGUNGJAWAB">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
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
            </Col>
            <Col sm={12} md={6}>
              <Form.Group className="mb-3" controlId="kodeStatusPengusaha">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
                    Status Pengusaha
                  </InputGroup.Text>
                  <Form.Select
                    size="sm"
                    name="KODE_STATUS_PENGUSAHA"
                    aria-label="Masukkan Status Pengusaha"
                    onChange={handleChange}
                    value={formData.KODE_STATUS_PENGUSAHA || ""}
                    required
                  >
                    <option value={""}></option>
                    <option value="3">PMDN</option>
                    <option value="5">PMA</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="nama_pic">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
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
                  <InputGroup.Text style={{ width: "170px" }}>
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
                  <InputGroup.Text style={{ width: "170px" }}>
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
              <Form.Group className="mb-3" controlId="kantorPabean">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
                    Kantor Layanan
                  </InputGroup.Text>
                  <TypeHeadEdit
                    id="kantorPabean"
                    // size="sm"
                    labelKey="name"
                    options={listKantorPabean || []}
                    keySelected="KODE_KANTOR"
                    selected={formData.KODE_KANTOR_PABEAN}
                    onChange={kodeKantorLayanan}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="tgl_expire">
                <InputGroup>
                  <InputGroup.Text style={{ width: "170px" }}>
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
      </Modal.Body>
    </Modal>
  );
};

export default CompanyForm;
