import React, { useContext, useEffect, useState, useRef } from "react";
import { Col, Row, Form, Card, Button, Table, Modal, Image } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../axios/axios.js";
import moment from "moment";
import { AuthContext } from "../auth/AuthProvider.js";
import { toast } from "react-toastify";
import { FaMessage } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import "trix/dist/trix.css";
import "trix";

const GrievanceResponse = () => {
    const editorRef                     = useRef(null);
    const { value }                     = useContext(AuthContext);
    const IDUser                        = value.userId;
    const [searchParams]                = useSearchParams();
    const grvID                         = searchParams.get("id");
    const [ dataHeader, setDataHeader ] = useState({});
    const [ dataRespon, setDataRespon ] = useState([]);
    const [ ModalClose, setModalClose ] = useState(false);
    const [messages, setMessages ]      = useState({ GRV_MESSAGES:"",GRV_ID: grvID, GRV_RESPON_BY: IDUser });
    const [ attachment, setAttachment ] = useState({file: null, url: null});
    const maxChars = 1000; 
    const [ image1, setImage1 ]         = useState(null);
    const [ image2, setImage2 ]         = useState(null);
    const [ image3, setImage3 ]         = useState(null);
    const [ ModalInvestigation, setModalInvestigation ] = useState(false);
    const [ DataInvestigation, setDataInvestigation] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!grvID) {
          navigate("/grievance"); // Redirect if id is null or undefined
        }
      }, [grvID, navigate]);

    const getImageGrievance = async(id, tipe, filename) => {
        try {
            const imageData = await axios.get(`/grievance/image/${id}/${tipe}/${filename}`, { responseType: "blob" });
            if(imageData.status===200){
                switch(tipe){
                    case 1:
                        const blob1 = await imageData.data; // Convert response to Blob
                        const url1 = URL.createObjectURL(blob1); // Create URL for Blob
                        setImage1(url1);
                    break;
                    case 2:
                        const blob2 = await imageData.data; // Convert response to Blob
                        const url2 = URL.createObjectURL(blob2); // Create URL for Blob
                        setImage2(url2);
                    break;
                    case 3:
                        const blob3 = await imageData.data; // Convert response to Blob
                        const url3 = URL.createObjectURL(blob3); // Create URL for Blob
                        setImage3(url3);
                    break;
                    default:
                        console.log('Tipe tidak ditemukan');
                    break;
                }
            }
        } catch(err){
            console.log(err);
        }
         
    }

    const getDataHeader = async(id) => {
        try {
            const response = await axios.get(`/grievance/header/${id}`);
            if(response.status===200){
                if(response.data.data){
                    setDataHeader(response.data.data[0]);
                } else {
                    setDataHeader({});  
                }
                if(response.data.data[0].GRV_MEDIA_1_FILENAME){
                    getImageGrievance(grvID, 1, response.data.data[0].GRV_MEDIA_1_FILENAME);
                }
                if(response.data.data[0].GRV_MEDIA_2_FILENAME){
                    getImageGrievance(grvID, 2, response.data.data[0].GRV_MEDIA_2_FILENAME);
                }
                if(response.data.data[0].GRV_MEDIA_3_FILENAME){
                    getImageGrievance(grvID, 3, response.data.data[0].GRV_MEDIA_3_FILENAME);
            
                }
                
            }
        } catch(err){
            console.error(err);
        }
    }

    const getDataRespon = async(id) => {
        try {
            const response = await axios.get(`/grievance/respon/${id}`);
            if(response.status===200){
                 // Modify each content object, replacing blob URLs directly inside content property
                const updatedContents = response.data.data.map((item) => {
                    let updatedContent = item.GRV_MESSAGES;
                    let realUrl = `${axios.defaults.baseURL}/grievance/respon-attachment/${item.GRV_ID}/${item.GRV_RESPON_FILENAME}`;
                    item.attachments.forEach(({ blobUrl, realUrl }) => {
                        const regex = new RegExp(blobUrl, "g"); // Replace all occurrences
                        updatedContent = updatedContent.replace(regex, realUrl);
                    });
        
                    return { ...item, GRV_MESSAGES: updatedContent }; // Update content property
                });
        
                setDataRespon(updatedContents);
                // setDataRespon(response.data.data);
            }
        } catch(err){
            console.error(err);
        }
    }

    
    
    const uploadResponAttachments = async (id, files) => {
        if (files.length === 0) {
          console.warn("No files to upload.");
          return;
        }
      
        const formData = new FormData();
        formData.append("attachment", attachment.file); // Append the file
        formData.append("grvID", id); // Custom field
        
        try {
            const response = await axios.post(`/grievance/respon-upload-attachment`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
      
          if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log("Upload successful:", data);
          return data; // You can use this to update the UI if needed
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      };
      
      const submitMessages = async()=> {
        try {
            const action = await axios.post(`/grievance/respon`, { dataRespon: messages });
            const uploadAttahment = await uploadResponAttachments(grvID, attachment);
            if(action.status === 200 && uploadAttahment){
                getDataHeader(grvID);
                getDataRespon(grvID);
                setMessages({ GRV_MESSAGES:"" });
                setAttachment({file: null, url: null});
                toast.success('Berhasil Posting Respon!');
            }
        } catch(err){
            toast.warning('Gagal Posting Respon!');
        }
    }

    const SignPriorityCat = (id) => {
        let status;
        switch(id){
            case 1:
                status = '🔴 TINGGI';
            break;
            case 2:
                status = '🟡 MODERATE';
            break;
            case 3:
                status = '🟢 RENDAH';
            break;
            default:
                status = '🟢 RENDAH';
            break;
        }
        return status;
    }

    const OpenModalClose = () => {
        setModalClose(true);
    }

    const CompleteGrievance = async() => {
        try {
            const action = await axios.post(`/grievance/set-close?grvid=${grvID}&by=${IDUser}`);
            if(action.status===200){
                getDataHeader(grvID);
                getDataRespon(grvID);
                toast.success("Berhasil menutup Grievance!");
                setModalClose(false);
            }
        } catch(err){
            console.error(err);
        }
        
    }

    const FindInvestigationData = async(id) => {
        await axios.get(`/investigation/find-by-grvid/${id}`)
        .then((response) => {
            if(response.status===200){
                setDataInvestigation(response.data.data);
            }
        })
        .catch((err)=> {
            console.error(err);
        })
    
    }

    const SendToInvestigation = async() => {
        try {
            const dataToSend = {
                GRV_ID: grvID,
                INVS_CREATE_BY: IDUser
            };
            await axios.post('/investigation/investigation', { data: dataToSend})
            .then((response)=> {
                if(response.status===200){
                    toast.success('Berhasil kirim Grievance ke Investigation');
                    FindInvestigationData(grvID);
                    setModalInvestigation(false);
                }
            })
            .catch((err)=> {
                toast.warning('Gagal kirim Grievance ke Investigation');
                console.error(err);
            })
        } catch(err){
            console.error(err);
        }
    }

    
    useEffect(() => {
        getDataHeader(grvID);
        getDataRespon(grvID);
        FindInvestigationData(grvID);
    },[grvID]);

    useEffect(() => {
        const editor = editorRef.current;
       
        
        editor.addEventListener("trix-change", (event) => {
            setMessages((prevData) => ({
                ...prevData,
                GRV_MESSAGES: event.target.value
            }));
        });

        
        const handleAttachmentAdd = (event) => {
            const attachmentData = event.attachment;
      
            if (attachment.file!==null) {
              event.preventDefault(); // Prevent adding a new file
              alert("Hanya dapat menambahkan 1 Lampiran!");
              return;
            } else if(attachment.file===null)

            if (attachmentData.file) {
                 // Generate a new file name
                const fileExtension = attachmentData.file.name.split(".").pop();
                const newFileName = `grievance_responfile_${Date.now()}.${fileExtension}`;

                // Create a new File object with the new name
                const renamedFile = new File([attachmentData.file], newFileName, {
                type: attachmentData.file.type,
                });

                // Convert to local URL
                const fileUrl = URL.createObjectURL(renamedFile);
                
                // Store the file
                setAttachment({ file: renamedFile, url: fileUrl });
        
                // Set the file URL in Trix editor
                attachmentData.setAttributes({ url: fileUrl, href: fileUrl });
  
                setMessages((prevData) => ({
                  ...prevData,
                  GRV_RESPON_FILENAME: attachmentData.file.name
                }));
              }
      
            
          };
      
        
          const handleAttachmentRemove = (event) => {
            const attachmentData = event.attachment;
            const removedFileUrl = attachmentData.getAttribute("url"); // Get removed file URL
      
            // Only remove the file if it matches the one stored
            if (attachment && attachment.url === removedFileUrl) {
              setAttachment({file: null, url: null}); // Clear the file from state
              URL.revokeObjectURL(removedFileUrl); // Free up memory
            }
          };

        editor.addEventListener("trix-attachment-add", handleAttachmentAdd);
        editor.addEventListener("trix-attachment-remove", handleAttachmentRemove);
        
        return () => {
          editor.removeEventListener("trix-change", () => {});
          editor.removeEventListener("trix-attachment-add", handleAttachmentAdd);
          editor.removeEventListener("trix-attachment-remove", handleAttachmentRemove);
        };
      }, []);

    return (
        <>
        <Row className="mx-0 mt-3">
            <Col className="ps-3 p-2" lg={8}>
                <Card className="border-0 ">
                    <Card.Header className="align-items-center">
                        <Row>
                            <Col sm={12}>
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", maxHeight:"100%", margin: "auto" }} >
                                    <h1>{dataHeader?.GRV_TITLE}</h1>
                                    <p>{dataHeader?.GRV_DESCRIPTION}</p>
                                    <p>
                                        { dataHeader.GRV_MEDIA_1_FILENAME && (
                                            <Image src={image1} style={{maxWidth:'250px'}} />
                                        )}
                                        
                                        { dataHeader.GRV_MEDIA_2_FILENAME && (
                                            <Image src={image2} style={{maxWidth:'250px'}} />
                                        )}

                                        { dataHeader.GRV_MEDIA_3_FILENAME && (
                                            <Image src={image3} style={{maxWidth:'250px'}}/>
                                        )}
                                        
                                        
                                    </p>
                                    <p style={{textDecoration:'overline'}}>Dilaporkan pada { moment(dataHeader.GRV_SUBMIT_DATE).format('YYYY-MM-DD HH:mm:ss') || ''} oleh { dataHeader.GRV_SUBMIT_NAME}</p>
                                    { DataInvestigation.length > 0 && (
                                        <p><strong><i>Sedang dalam Investigasi</i></strong></p>
                                    )}
                                    <br/>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <br/>    
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                    <i><FaMessage /> Balas dengan respon di bawah </i>
                                </Card>
                                <br/>
                            </Col>
                        </Row>
                        {dataRespon && dataRespon.map((item, index) => 
                        <Row key={index}>
                            <Col sm={12}>
                                <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                    {/* <p>{item.GRV_MESSAGES || ''}</p> */}
                                    <div dangerouslySetInnerHTML={{ __html: item.GRV_MESSAGES }} />
                                    <br/>
                                    <p style={{textDecoration:'overline'}}><FaReply/> Direspon pada { moment(item.GRV_RESPON_DATE).format('DD-MM-YYYY HH:mm:ss') || ''} oleh <i>{ item.GRV_RESPON_NAME || ''}</i></p>
                                </Card>
                                <br/>
                            </Col>
                        </Row>
                        )}   
                </Card.Header>
                <Card.Body className="text rounded">
                    <Row>
                        <Col sm={12}>
                        { dataHeader.GRV_STATUS!=="COMPLETE" && (
                            <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }}>
                                <Form>
                                    <Form.Group controlId="tweetText">
                                        {/* <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Balas..."
                                            value={messages.GRV_MESSAGES}
                                            name="GRV_MESSAGES"
                                            onChange={ocMessages}
                                            maxLength={maxChars}
                                            className="mb-2"
                                        /> */}
                                        <input id="trixInput" type="hidden" value={messages.GRV_MESSAGES} />
                                        <trix-editor ref={editorRef} input="trixInput"></trix-editor>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between align-items-center">
                                    <small className={(messages.GRV_MESSAGES).length === maxChars ? "text-danger" : "text-muted"}>
                                        {messages.GRV_MESSAGES.length}/{maxChars}
                                    </small>
                                    
                                    <Button variant="primary" className="mt-2" disabled={messages.GRV_MESSAGES.trim().length === 0} onClick={submitMessages}>Post</Button>
                                    </div>
                                </Form>
                            </Card>
                        )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
        <Col className="ps-3 p-2" lg={3}>
            <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                <Table>
                    <tr>
                        <td className="py-2"><b>KATEGORI</b></td>
                        <td><b>: {dataHeader.GRV_CATEGORY_NAME}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>SUB KATEGORI</b></td>
                        <td><b>: {dataHeader.GRV_SUBCATEGORY_NAME}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>STATUS</b></td>
                        <td><b>: {dataHeader.GRV_STATUS}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>PRIORITAS</b></td>
                        <td><b>: {SignPriorityCat(dataHeader.GRV_PRIORITY)}</b></td>
                    </tr>
                    <tr>
                        <td className="py-2"><b>BATAS WAKTU RESPON</b></td>
                        <td><b>: {moment(dataHeader.GRV_DEADLINE_PROCESS).format('DD-MM-YYYY HH:mm:ss')}</b></td>
                    </tr>
                    { dataHeader.GRV_STATUS==="COMPLETE" && (
                    <tr>
                        <td className="py-2"><b>DITUTUP OLEH / WAKTU</b></td>
                        <td><b>: {dataHeader.GRV_CLOSE_NAME}  /  {moment(dataHeader.GRV_CLOSE_DATE).format('DD-MM-YYYY HH:mm:ss')}</b></td>
                    </tr>
                    )}
                    <br/>
                    { dataHeader.GRV_STATUS!=="COMPLETE" && (
                        <tr>
                            <td>
                                <div className="d-grid gap-2">
                                    <Button variant="warning" onClick={()=> setModalInvestigation(true)} disabled={DataInvestigation.length > 0 ? true: false}>KIRIM KE INVESTIGASI</Button>
                                    <Button variant="primary" onClick={OpenModalClose}>TUTUP GRIEVANCE</Button>
                                </div>
                            </td>
                        </tr>
                        
                    )}
                    
                </Table>
                
            </Card>
        </Col>
    </Row>

        <Modal show={ModalClose} size="sm" onHide={()=> setModalClose(false)}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title> Tutup Grievance </Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12} className="mb-3">
                            Apakah Anda yakin akan menutup Grievance ini? 
                        </Col>
                        <Col lg={12} className="d-flex-1 text-center">
                            <Button variant="danger" onClick={CompleteGrievance}>YA</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="secondary" onClick={()=> setModalClose(false)}>TIDAK</Button>     
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>

    <Modal show={ModalInvestigation} size="md" onHide={()=> setModalInvestigation(false)}>
            <Form>    
                <Modal.Header className="bg-primary text-mute bg-opacity-50" closeButton>
                    <Modal.Title>Kirim ke Investigasi </Modal.Title>
                </Modal.Header>
                <Modal.Body className="mx-4">
                    <Row>
                        <Col lg={12} className="mb-3 text-center">
                            Apakah Anda yakin akan mengirimkan Grievance ini ke Investigasi? 
                        </Col>
                        <Col lg={12} className="d-flex-1 text-center">
                            <Button className="mx-4" variant="success" onClick={()=>SendToInvestigation(grvID)}>YA</Button>
                            <Button className="mx-4" variant="secondary" onClick={()=> setModalInvestigation(false)}>TIDAK</Button>     
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>

        </>
    )
}

export default GrievanceResponse;