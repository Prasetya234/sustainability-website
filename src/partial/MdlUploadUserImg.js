import React, { useCallback, useRef, useState } from "react";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import "../styles/AvatarEdit.css";
import { MdOutlineCloudUpload } from "react-icons/md";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import axios from "../axios/axios.js";
import { toast } from "react-toastify";

const MdlUploadUserImg = ({ show, handleClose, userId, idPerusahaan, setUserImg }) => {
  const [dataURL, setDataURL] = useState(null);
  const [typeFile, setTypeFile] = useState(null);
  const [streaming, setStreaming] = useState(false);

  const [errMsg, setErrorMsg] = useState("");
  const [tabs, setTabs] = useState("upload");

  const videoRef = useRef();
  const canvasRef = useRef(null);

  function handleActiveTab(tab) {
    if (tab === "upload" && streaming) {
      stopCamera();
    }
    setStreaming(false);
    setTabs(tab);
    setDataURL(null);
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(file.type)) {
      setErrorMsg("*Only JPG, JPEG, and PNG formats are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setErrorMsg("*Maximum file size is 5MB");
      return;
    }
    const typesImg = file.type.split("/")[1];
    setTypeFile(typesImg);

    const reader = new FileReader();
    reader.onload = () => {
      setDataURL(reader.result);
      setErrorMsg(""); // Hapus pesan error jika sukses
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Hanya satu file
    maxFiles: 1,
  });

  //   const selectedFile = acceptedFiles[0];

  //   const uploadImage = async () => {
  //     let formData = new FormData();

  //     formData.append("file", selectedFile);
  //     formData.append(
  //       "upload_preset",
  //       import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  //     );
  //     formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

  //     await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then(r => {
  //         return r.json()
  //       })
  //       .then(data => {
  //         setUploadedURL(data.url)
  //       })
  //   };

  function removeImg() {
    setDataURL(null);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  }

  function capturePhoto() {
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setDataURL(canvas.toDataURL("image/png"));
      stopCamera();
    } catch (err) {
      //   toast.error("Gagal set Foto");
    }
  }

  async function stopCamera() {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks(); // Ambil semua track (video/audio)

        tracks.forEach((track) => track.stop()); // Hentikan semua track
        videoRef.current.srcObject = null; // Hapus stream dari video element
        setStreaming(false); // Update state agar tombol berubah ke "Start Camera"
      }
    } catch (err) {
      console.error("Error stopping camera: ", err);
    }
  }

  async function onSaveUserImg(dataImg, userId, idPerusahaan) {
    const blob      = await fetch(dataImg).then(r => r.blob());

    let formData = new FormData();
    const fileName = `${idPerusahaan}_BE_${userId}.${typeFile}`;

    formData.append("file", blob, fileName);
    formData.append("userId", userId);
    formData.append("fileName", fileName);

    await axios
      .post("/user/upload-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if(res.status === 200){
            setUserImg(dataURL)
            closeMdl()
            toast.success(res.data.message, {autoClose: 2500})
        }
      });
  }

  function closeMdl(){
    stopCamera()
    handleClose()
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Setting Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className=" justify-content-center">
          <Col xs={12} sm={6}>
            <div className="border-1 rounded-2 border bg-secondary bg-opacity-25">
              <Row>
                <Col
                  className={`align-content-center text-center py-2 ${
                    tabs === "upload" ? "btn btn-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleActiveTab("upload")}
                >
                  Upload
                </Col>
                <Col
                  className={`align-content-center text-center py-2 ${
                    tabs === "take" ? "btn btn-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleActiveTab("take")}
                >
                  Take Picture
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="upload-img container">
              <div className="zone">
                {dataURL ? (
                  <div className="selected">
                    <Image
                      src={dataURL}
                      roundedCircle
                      width={300}
                      height={300}
                    />
                    <div className="actions text-center">
                      {/* {uploadedURL ? (
                        <span className="uploaded-txt">Uploaded!</span>
                      ) : (
                        <button onClick={uploadImage} className="upload-btn">
                          remove
                        </button>
                      )} */}
                      <Button
                        onClick={() => removeImg(null)}
                        variant="dark"
                        // className="upload-btn"
                      >
                        Remove <IoMdRemoveCircleOutline size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {tabs === "upload" ? (
                      <div className="drop-zone" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <div className="drop-files">
                            <MdOutlineCloudUpload size={25} />
                          </div>
                        ) : (
                          <div className="drag-files">
                            <div>
                              <p className="text-center">
                                Dorp your file image or click here to borwse
                              </p>
                              <em>
                                (only 1 files and the 5MB maximum size of files
                                you can drop here)
                              </em>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="video-container">
                          <video ref={videoRef} autoPlay />
                          <div className="overlay"></div>
                        </div>
                        <div className="text-center">
                          {streaming ? (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => capturePhoto()}
                                className="mb-3 me-2"
                              >
                                Capture Photo
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => stopCamera()}
                                className="mb-3"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => startCamera()}
                              className="mb-3"
                            >
                              Start Camera
                            </Button>
                          )}
                        </div>
                        {/* Hidden Canvas Element for Capturing the Photo */}
                        <canvas
                          ref={canvasRef}
                          style={{ display: "none" }}
                        ></canvas>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <div className="fst-italic text-danger">{errMsg}</div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onSaveUserImg(dataURL, userId, idPerusahaan)}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MdlUploadUserImg;
