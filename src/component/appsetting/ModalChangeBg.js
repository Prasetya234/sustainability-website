import axios from "../../axios/axios";
import React, { useState, useRef, useContext } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Nav,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../../auth/AuthProvider";
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import '../../styles/MdlBgHeader.css'
import Swal from "sweetalert2";


const ModalChangeBg = ({ mdlChgBg, hdlClsMdlChgBg, listBgHeader, refresTheme, refresImg }) => {
  const { value } = useContext(AuthContext);
  const { userId, idPerusahaan } = value;
  const [activeTab, setActiveTab] = useState("chg");
  const [imgName, setImgName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [typeFile, setTypeFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 25 * 1024 * 1024; // 25MB dalam byte

    if (!allowedTypes.includes(file.type)) {
      return toast.warning("Please select a valid PNG/JPG/JPEG file.", {
        autoClose: 2000,
      });
    }
    if (file.size > maxSize) {
      return toast.warning("Maximum fle size 2.5MB", {
        autoClose: 2000,
      });
    }
    const typesImg = file.type.split("/")[1];
    setTypeFile(typesImg);
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveUpload = async () => {
    if (selectedImage) {
      const blob = await fetch(selectedImage).then((r) => r.blob());
      if (!imgName || !idPerusahaan || !userId) {
        return toast.warning("Please input Image Name", { autoClose: 2500 });
      }
      let formData = new FormData();
      const fileName = `${idPerusahaan}_BG_${imgName}.${typeFile}`;

      formData.append("file", blob, fileName);
      formData.append("userId", userId);
      formData.append("fileName", fileName);
      formData.append("imgName", imgName);
      formData.append("idPerusahaan", idPerusahaan);

      await axios
        .post("/appsetting/upload-bg-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message, { autoClose: 2500 });
            setActiveTab('chg')
            setImgName("")
            setSelectedImage(null)
          }
        }).catch(err => {
          console.log(err);
          
          if(err.response.data){
            return toast.error(err.response.data.message, {autoClose: 2000})
          }else{
            return toast.error('Somthing when wrong',  {autoClose: 2000})

          }
        })
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    fileInputRef.current.value = null;
  };

  function hdlChgName(e) {
    const { value } = e.target;
    const formattedValue = value.replace(/[^a-zA-Z0-9-]/g, ""); // Hanya huruf, angka, dan '-'
    setImgName(formattedValue);
  }

  async function selectBg(items) {
    const {bgId, themesSelect} = items
    const dataBg = {bgId, themesSelect}
    await axios
    .patch("/appsetting/set-bg-image", dataBg)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data.message, { autoClose: 2500 });
        refresTheme()
        hdlClsMdlChgBg()
      }
    }).catch(err => {
      console.log(err);
      
      if(err.response.data){
        return toast.error(err.response.data.message, {autoClose: 2000})
      }else{
        return toast.error('Somthing when wrong',  {autoClose: 2000})

      }
    })
  }
 async function deleteBg(items) {
      Swal.fire({
         text: `Are You Delete This Image ?`,
         icon: "question",
         confirmButtonColor: "#2275f2",
         showCancelButton: true,
         confirmButtonText: "Yes",
         cancelButtonText: "Cancel",
       }).then(async (result) => {
         if (result.isConfirmed) {
          const {bgId} = items

           await axios
             .delete(`/appsetting/bg-image/${bgId}`)
             .then((res) => {
               if (res.status === 200) {
                  refresImg()
                 toast.success(res.data.message, { autoClose: 2000 });
               }
             })
             .catch((err) => {
               return toast.error("Somthing wrong when delete image", {
                 autoClose: 2500,
               });
             });
         }
       });
  }

  const renderItem = (item) => (
    <div className="custom-slide">
      <img src={item.original} alt={item.description} style={{height : '450px', width: '650px'}} />
      <div className="gallery-buttons mt-2">
        <Button variant="primary" className="me-2" size="sm" onClick={() => selectBg(item)}>Select Background</Button>
        {item.headerName !== 'bg-default.png' && (
           <Button variant="danger" size="sm" onClick={() => deleteBg(item)}>Delete</Button>
        )}
      </div>
      </div>
  );
  return (
    <Modal size="lg" show={mdlChgBg} onHide={hdlClsMdlChgBg}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Change Background</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
        >
          <Nav.Item>
            <Nav.Link eventKey="chg">Change Bg</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="upload">Upload</Nav.Link>
          </Nav.Item>
        </Nav>
        <Row className="mt-3">
          {activeTab === "chg" && (
            <Row>
              <Col>
              <ImageGallery items={listBgHeader}  
              renderItem={renderItem} 
              showThumbnails={true} 
              showFullscreenButton={false}
              showPlayButton={false}
              />
              </Col>
              </Row>
          )}
          {activeTab === "upload" && (
            <Col className="text-center">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {!selectedImage && (
                <Button variant="primary" size="sm" onClick={handleUploadClick}>
                  Upload New Background
                </Button>
              )}
              {selectedImage && (
                <div className="mt-3">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{ maxWidth: "450px", height: "350px" }}
                  />
                  <Row className=" justify-content-center">
                    <Col className="text-center my-3" sm={6}>
                      <InputGroup>
                        <InputGroup.Text id="bg-bane">
                          Image Name
                        </InputGroup.Text>
                        <Form.Control
                          aria-label="bgname"
                          aria-describedby="bgname"
                          value={imgName}
                          onChange={hdlChgName}
                        />
                      </InputGroup>
                      <div className="fst-italic">*only A-Z 0-9 and '-'</div>
                    </Col>
                  </Row>
                  <div className="mt-2">
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={handleSaveUpload}
                    >
                      Save Upload
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button size="sm" variant="secondary" onClick={hdlClsMdlChgBg}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChangeBg;
