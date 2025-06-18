import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";
import "trix/dist/trix.css";
import "trix";

const initialBanner = (companyId) => ({
  COMPANY_ID: companyId,
  IMAGE_URL: "",
  TITLE: "",
  REDIRECT_URL: "",
});

export default function Banner() {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [banners, setBanners] = useState([]);
  const [bannerFormData, setBannerFormData] = useState(initialBanner(idPerusahaan));
  const [modalAdd, setModalAdd] = useState(false);
  const [actType, setActType] = useState("Create");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [imageFile, setImageFile] = useState(null);

  const imageEditorRef = useRef(null); 

  
  const getBanners = async () => {
    try {
      const response = await axios.get(`/banner`, {
        params: { COMPANY_ID: idPerusahaan, page, limit },
      });
      if (response.status === 200) {
        setBanners(response.data.data.items);
        setPagination(response.data.pagination || { totalPages: 1 });
      }
    } catch (error) {
      toast.error("Failed to retrieve banners", { autoClose: 3000 });
    }
  };

  
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/mobile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        return response.data.data;
      }
      return "";
    } catch (error) {
      toast.error("Failed to upload image", { autoClose: 3000 });
      return "";
    }
  };

  
  const createBanner = async (data) => {
    try {
      let imageUrl = data.IMAGE_URL;

      if (imageFile) {
        imageUrl = await uploadSingleFile(imageFile);
      }

      const updatedData = {
        ...data,
        IMAGE_URL: imageUrl,
      };

      const response = await axios.post("/banner", updatedData);
      if (response.status === 201) {
        toast.success("Banner created successfully", { autoClose: 3000 });
        getBanners();
      }
    } catch (error) {
      toast.error("Failed to create banner", { autoClose: 3000 });
    }
  };

  
  const updateBanner = async (id, data) => {
    try {
      let imageUrl = data.IMAGE_URL;

      if (imageFile) {
        imageUrl = await uploadSingleFile(imageFile);
      }

      const updatedData = {
        ...data,
        IMAGE_URL: imageUrl,
      };

      const response = await axios.put(`/banner/${id}`, updatedData);
      if (response.status === 200) {
        toast.success("Banner updated successfully", { autoClose: 3000 });
        getBanners();
      }
    } catch (error) {
      toast.error("Failed to update banner", { autoClose: 3000 });
    }
  };

  
  const deleteBanner = async (id) => {
    try {
      const response = await axios.delete(`/banner/${id}`);
      if (response.status === 200) {
        toast.success("Banner deleted successfully", { autoClose: 3000 });
        getBanners();
      }
    } catch (error) {
      toast.error("Failed to delete banner", { autoClose: 3000 });
    }
  };

  
  const handleOpenModal = (type = "Create", bannerData = null) => {
    if (type === "Edit" && bannerData) {
      setBannerFormData(bannerData);
      setImageFile(null); 
    } else {
      setBannerFormData(initialBanner(idPerusahaan));
      setImageFile(null); 
    }
    setActType(type);
    setModalAdd(true);
  };

  
  const hdlMdlClose = () => {
    setModalAdd(false);
    setBannerFormData(initialBanner(idPerusahaan));
    setImageFile(null);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (actType === "Create") {
        await createBanner(bannerFormData);
      } else {
        await updateBanner(bannerFormData.ID, bannerFormData);
      }
      hdlMdlClose();
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 3000 });
    }
  };

  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  
  useEffect(() => {
    getBanners();
  }, [page, idPerusahaan]);

  return (
    <div className="container">
      {/* Header and Add Button */}
      <Row className="m-0 mt-2">
        <Col>
          <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
            Add Banner
          </Button>
        </Col>
      </Row>

      {/* Banner Table */}
      <Row className="mt-3">
        <Col>
          <Table responsive hover className="text-muted">
            <thead>
              <tr>
                <th>Title</th>
                <th>Image URL</th>
                <th>Redirect URL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.ID}>
                  <td>{banner.TITLE}</td>
                  <td>{banner.IMAGE_URL}</td>
                  <td>{banner.REDIRECT_URL || "N/A"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleOpenModal("Edit", banner)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        Swal.fire({
                          text: `Are you sure you want to delete this banner?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "Cancel",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await deleteBanner(banner.ID);
                          }
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Pagination */}
      <Row className="mt-3">
        <Col>
          <Button
            size="sm"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>{" "}
          <span>
            Page {page} of {pagination.totalPages}
          </span>{" "}
          <Button
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>

      {/* Modal for Add/Edit Banner */}
      <Modal show={modalAdd} onHide={hdlMdlClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actType === "Create" ? "Add Banner" : "Edit Banner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Company ID</Form.Label>
              <Form.Control
                type="text"
                value={bannerFormData.COMPANY_ID}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={bannerFormData.TITLE}
                onChange={(e) =>
                  setBannerFormData({ ...bannerFormData, TITLE: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {actType === "Edit" && bannerFormData.IMAGE_URL && (
                <Form.Text>Current image: {bannerFormData.IMAGE_URL}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Redirect URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Redirect URL"
                value={bannerFormData.REDIRECT_URL}
                onChange={(e) =>
                  setBannerFormData({
                    ...bannerFormData,
                    REDIRECT_URL: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}