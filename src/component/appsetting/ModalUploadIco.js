import axios from "../../axios/axios";
import React, { useCallback, useState } from "react";
import { Button, Modal, Card, Row, Col, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { MdOutlineCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";

const ModalUploadIco = ({ mdlUplIco, hdlClsMdlUplIco, idPerusahaan, userId, getListIcons }) => {
  const [files, setFiles] = useState([]);
  const [errMsg, setErrorMsg] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const validTypes = ["image/png"];
    const maxSize = 1 * 1024 * 1024; // 1MB

    const filePromises = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        if (!validTypes.includes(file.type)) {
          setErrorMsg("*Only PNG format is allowed");
          return reject();
        }

        if (file.size > maxSize) {
          setErrorMsg("*Maximum file size is 1MB");
          return reject();
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const cleanedName = file.name.replace(/[^a-zA-Z0-9-.]/g, "").replace(/\.png$/, "");
            const iconName = file.name.replace(/[^a-zA-Z0-9-.]/g, "").replace(/\.png$/, ".png")
            resolve({
              id: file.name,
              name: `${idPerusahaan}${iconName}`,
              iconName: cleanedName,
              preview: e.target.result,
              file: file,
              userId: userId
            });
          };
        reader.onerror = () => reject();
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
    .then((newFiles) => {
      setFiles((prev) => {
        const uniqueFiles = [...prev, ...newFiles].reduce((acc, file) => {
          if (!acc.some((f) => f.name === file.name)) {
            acc.push(file);
          }
          return acc;
        }, []);
        return uniqueFiles;
      });
      setErrorMsg("");
    })
    .catch(() => {});
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: "image/png",
  });


  function handleRmv(id){
    const newFile = files.filter(item => item.id !== id)

    setFiles(newFile)
  }

  function clsMdl(){
    setFiles([])
    hdlClsMdlUplIco()
  }

  function fakeChg(e){
    return;
  }

  function hdlChgIcoName(e, id){
    const {value} = e.target
    let newFile = files.map(item => {
        return {...item, iconName: item.id === id ? value : item.iconName }
    })
    setFiles(newFile)
  }

    async function handleSaveIco(filesIco){
      if(!filesIco) return;
      const formData = new FormData();
      filesIco.forEach((file) => {
        formData.append("icons", file.file);
        formData.append("name", file.name);
        formData.append("iconName", file.iconName);
        formData.append("idPerusahaan", idPerusahaan);
        formData.append("userId", userId);
      });
  
      try {
        const response = await axios.post("/appsetting/newicon", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if(response.status === 200){
            toast.success("Upload success:", {autoClose: 2000});
            setFiles([]);
            getListIcons(idPerusahaan);
            hdlClsMdlUplIco();
        }
      } catch (error) {

        if(error.response.status === 400){
            return  toast.error(error.response.data.message, {autoClose: 3000});
        }else{
            toast.error("Failed to upload icons. Please try again.", {autoClose: 2000});
        }
      }
    }
  return (
    <Modal size="lg" show={mdlUplIco} onHide={clsMdl}>
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Upload Icons</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="upload-img container">
          <div className="zone" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="drop-files">
                <MdOutlineCloudUpload size={25} />
                <p>Drop the files here...</p>
              </div>
            ) : (
              <div className="drag-files text-center">
                <div>
                <div>
                    <MdOutlineCloudUpload size={40} />
                </div>
                <p>Drag & drop or click to upload PNG icons</p>
                <p>(Max size: 1MB per file)</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {errMsg && <p className="text-danger text-center">{errMsg}</p>}
        <div className="mt-3">
          {files.map((file) => (
            <Card key={file.id} className="mb-2 p-2">
                <Row>
                    <Col sm={1} className="d-flex flex-row  align-items-center">
                        <img src={file.preview} alt={file.name} width={50} height={50} className="me-3" />
                    </Col>
                    <Col sm={8} className="border-start"> 
                        <Form.Group as={Row} className="mb-2" controlId="iconname">
                            <Form.Label column sm={3}>
                                Icon Name
                            </Form.Label>
                            <Col sm={6}>
                            <Form.Control value={file.iconName} type="text" placeholder="icon name" onChange={(e)=>hdlChgIcoName(e, file.id)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="filename">
                            <Form.Label column sm={3}>
                                File Name
                            </Form.Label>
                            <Col sm={6}>
                            <Form.Control disabled value={file.name} type="text" placeholder="file name" onChange={(e) => fakeChg(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col className="text-end align-content-center">
                        <Button size="sm" variant="secondary" onClick={() => handleRmv(file.id)}>
                            Remove
                        </Button>
                    </Col>
                </Row>
            </Card>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        {files.length > 0 ? 
        <>
            <Button size="sm" className="me-2" variant="warning" onClick={() => setFiles([])}>
                Clear ALL
            </Button>
            <Button size="sm" className="me-2" variant="success" onClick={() => handleSaveIco(files)}>
                 Save
            </Button>
        </>
        : ''}
        <Button size="sm" variant="secondary" onClick={clsMdl}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUploadIco;