import React, { useContext, useEffect, useState, useRef } from 'react'
import { Col, Row, Form, Button, Card, Table, ButtonGroup } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import { FaArrowLeft, FaFileExcel, FaPlus } from 'react-icons/fa'
import moment from 'moment'
import axios from "../axios/axios.js";
import { AuthContext } from '../auth/AuthProvider'
import NewDropDown from "../partial/NewDropDown";
import "trix/dist/trix.css";
import "trix";


const NewsContent = () => {
    const editorRef                     = useRef(null);
    const { value } = useContext(AuthContext);
    const IDCompany = value.idPerusahaan;
    const IDUser = value.userId;
    
    const [ NewsPeriode, setNewsPeriode ] = useState({startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')});
    const [ ListCategory, setListCategory ] = useState([]);
    const [ NewsList, setNewsList ] = useState([]);
    const [ activeDropdown, setActiveDropdown ] = useState(null);
    const [ activeMode, setActiveMode ] = useState("view");
    const [ messages, setMessages ] = useState({NEWS_CAT_ID: "", TITLE: "", CONTENT: "", CREATE_BY: IDUser, ATTACHMENT_1: ""});
    const [ attachment, setAttachment ] = useState({file: null, url: null});
    
    
    const getNewsList = async (idPerusahaan, idKategori, startDate, endDate) => {
        try {
            const response = await axios.get(`/news/news/${idPerusahaan}/${idKategori}/${startDate}/${endDate}`);
            if (response.status === 200) {
                setNewsList(response.data.data);
            } else {
                setNewsList([]);
            }
        } catch(err){
            console.log(err);
        }
    }

    const getListCategory = async (idPerusahaan) => {
        try {
            const response = await axios.get(`/news/category/${idPerusahaan}`);
            if (response.status === 200) {
                setListCategory(response.data.data);
            } else {
                setListCategory([]);
            }
        } catch(err){
            console.log(err);
        }
    }

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        getNewsList(IDCompany, value, NewsPeriode.startDate, NewsPeriode.endDate);
    }

    const handleOcAddNews = (e) => {
        const { name, value } = e.target;
        setMessages((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setNewsPeriode((prevState) => ({
            ...prevState,
            [name]: value
        }));
        switch (name) {
            case "StartDate":
                getNewsList(IDCompany, value, NewsPeriode.endDate);
            break;
            case "EndDate":
                getNewsList(IDCompany, NewsPeriode.startDate, value);
            break;
            default:
                break;
        }
    }

    const handleSubmitAddNews = async (e) => {
        e.preventDefault();
        const tryPost = await axios.post("/news/news", messages, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (tryPost.status === 200) {
            alert("Berita berhasil ditambahkan!");
            setActiveMode("view");
            getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
        } else {
            alert("Gagal menambahkan berita!");
        }
    }

    const handleAddNews = () => {
        setActiveMode("create");
    }

    const actionList = (id) => {
        return [
          { actionLable: "Edit", actExe: () => console.log("Edit")},
          { actionLable: "Hapus", actExe: () => console.log("Hapus")},
        ];
    }


    useEffect(() => {
        getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
        getListCategory(IDCompany);
    }
    , [IDCompany, NewsPeriode.startDate, NewsPeriode.endDate]);

    useEffect(() => {
            const editor = editorRef.current;
            if (!editor) return; 
            
            editor.addEventListener("trix-change", (event) => {
                setMessages((prevData) => ({
                    ...prevData,
                    CONTENT: event.target.value
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
                      ATTACHMENT_1: attachmentData.file.name
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
    console.log(messages);
  return (
    <div>
        { activeMode === "view" && (
            <Row className="m-0 mt-2">
            <Col>
                <CardShadow>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formStartDate">
                                        <Form.Label>Tanggal Awal</Form.Label>
                                        <Form.Control size="sm" type="date" defaultValue={NewsPeriode.startDate} name="StartDate" onChange={handleDateChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEndDate">
                                        <Form.Label>Tanggal Akhir</Form.Label>
                                        <Form.Control size="sm" type="date" defaultValue={NewsPeriode.endDate} name="EndDate" onChange={handleDateChange}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEndDate">
                                        <Form.Label>Kategori</Form.Label>
                                        <Form.Select size="sm" onChange={handleCategoryChange} name="NewsCategory">
                                            <option value="all">Semua</option>
                                            { ListCategory && ListCategory.map((item, index) => (
                                                <option key={index} value={item.NEWS_CAT_ID}>{item.NEWS_CAT_NAME}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>         
                        </div>
                        <div>
                            <Button size='sm' onClick={handleAddNews}><FaPlus /> Tambah Berita</Button>&nbsp;
                            <Button size="sm" variant="success"><FaFileExcel /> Download XLS</Button>
                        </div>  
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        <Row>
                            <Col sm={12}>
                                <Table hover size="sm">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Kategori</th>
                                            <th className="text-center">Judul</th>
                                            <th className="text-center">Tanggal Posting</th>
                                            <th className="text-center">Diposting Oleh</th>
                                            <th className="text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {NewsList && NewsList.map((item, index) => (
                                            <tr key={index}>
                                                <td className="py-3 text-center">{item.NEWS_CAT_NAME}</td>
                                                <td className="py-3 text-center">{item.TITLE}</td>
                                                <td className="py-3 text-center">{moment(item.CREATE_DATE).format('DD/MM/YYYY')}</td>
                                                <td className="py-3 text-center">{item.CREATE_BY}</td>
                                                <td className="py-3 text-center">
                                                <NewDropDown
                                                    label={"Opsi"}
                                                    dropdownId={`dropdown${index}`}
                                                    items={actionList(item.GRV_ID)}
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
                    </Card.Body>
                </CardShadow>
            </Col>
        </Row>
        )}

        { activeMode === "create" && (
            <Row className="m-0 mt-2">
            <Col lg={12}>
            <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <h3>Buat Berita</h3>
                        </div>
                        <div>
                            <Button size='sm' variant="success" onClick={handleSubmitAddNews}><FaPlus /> Simpan</Button>
                            <Button size='sm' variant="danger" onClick={() => setActiveMode("view")}><FaArrowLeft /> Batal</Button>    
                        </div>
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        <Row>
                            <Col lg={12}>
                                <Form.Group className="mb-3" controlId="formTitle">
                                    <Form.Label>Judul Berita</Form.Label>
                                    <Form.Control type="text" name="TITLE" onChange={handleOcAddNews} placeholder="Masukkan Judul Berita" />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-3" controlId="formCategory">
                                    <Form.Label>Kategori</Form.Label>
                                    <Form.Select size="sm" name="NEWS_CAT_ID" onChange={handleOcAddNews}>
                                        <option value="" disabled selected>Pilih Kategori</option>
                                        { ListCategory && ListCategory.map((item, index) => (
                                            <option key={index} value={item.NEWS_CAT_ID}>{item.NEWS_CAT_NAME}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col lg={12}>
                                <Form.Group controlId="tweetText">
                                    <input id="trixInput" type="hidden" value={messages.CONTENT} />
                                    <trix-editor ref={editorRef} input="trixInput"></trix-editor>
                                </Form.Group>
                                </Col>
                        </Row>
                    </Card.Body>
                    </Card>
            </Col>
        </Row>
        )}
        
    </div>  
    )
}

export default NewsContent;