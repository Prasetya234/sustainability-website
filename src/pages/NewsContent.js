import React, { useContext, useEffect, useState, useRef } from 'react'
import { Col, Row, Form, Button, Card, Table } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import { FaArrowLeft, FaFileExcel, FaNewspaper, FaPlus } from 'react-icons/fa'
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
    const [ readOnly, setReadOnly ] = useState(false);
    const [ NewsDetail, setNewsDetail ] = useState({NEWS_CAT_ID: "", TITLE: "", CONTENT: "", ALLOW_COMMENT:"Y", VISIBLE:"Y", CREATE_BY: IDUser, ATTACHMENT_1: ""});
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

    const getNewsDetailByID = async(id) => {
        try {
            const response = await axios.get(`/news/news-detail/${id}`);
            if (response.status === 200) {
                setNewsDetail(response.data.data[0]);
            }
        } catch(err) {
            console.log(err);
        }
    }

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        getNewsList(IDCompany, value, NewsPeriode.startDate, NewsPeriode.endDate);
    }

    const handleOcNewsDetail = (e) => {
        const { name, value, checked } = e.target;
        switch (name) {
            case "ALLOW_COMMENT":
                setNewsDetail((prevState) => ({
                    ...prevState,
                    ALLOW_COMMENT: checked===true ? "Y":"N"
                }));
            break;
            case "VISIBLE":
                setNewsDetail((prevState) => ({
                    ...prevState,
                    VISIBLE: checked===true ? "Y":"N"
                }));
            break;
            default:
                setNewsDetail((prevState) => ({
                    ...prevState,
                    [name]: value
                }));
            break;
        }
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
        const tryPost = await axios.post("/news/news", NewsDetail, {
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
        setNewsDetail({NEWS_CAT_ID: "", TITLE: "", CONTENT: "", ALLOW_COMMENT:true, VISIBLE:true, CREATE_BY: IDUser, ATTACHMENT_1: ""});
        setActiveMode("edit");
        setReadOnly(false);
    }

    const handleEditNews = (id) => {
        getNewsDetailByID(id);
        setActiveMode("edit");
        setReadOnly(false);
    }

    const handleViewNews = (id) => {
        getNewsDetailByID(id);
        setActiveMode("edit");
        setReadOnly(true);
    }

    const actionList = (id) => {
        return [
          { actionLable: "Edit", actExe: () => handleEditNews(id)},
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
                const content = document.querySelector("#trixInput").value;
                console.log(event.target.value);
                if (content){
                    setNewsDetail((prevState) => ({
                        ...prevState,
                        CONTENT: content,
                    }));
                } else if(event.target.value) {
                    setNewsDetail((prevData) => ({
                        ...prevData,
                        CONTENT: event.target.value
                    }));
                }
                
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
      
                    setNewsDetail((prevData) => ({
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

          
          console.log(NewsDetail);
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
                                            <tr key={index} onDoubleClick={() => handleViewNews(item.ID_NEWS)}>
                                                <td className="py-3 text-center">{item.NEWS_CAT_NAME}</td>
                                                <td className="py-3 text-center">{item.TITLE}</td>
                                                <td className="py-3 text-center">{moment(item.CREATE_DATE).format('DD/MM/YYYY')}</td>
                                                <td className="py-3 text-center">{item.CREATE_USERNAME}</td>
                                                <td className="py-3 text-center">
                                                <NewDropDown
                                                    label={"Opsi"}
                                                    dropdownId={`dropdown${index}`}
                                                    items={actionList(item.ID_NEWS)}
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

        { activeMode === "edit" && (
            <Row className="m-0 mt-2">
            <Col lg={12}>
            <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <h3>{NewsDetail.ID_NEWS ? "Edit":"Buat"} Berita</h3>
                        </div>
                        <div>
                            {!readOnly && (
                                <Button size='sm' variant="success" onClick={handleSubmitAddNews}><FaPlus /> Simpan</Button>    
                            )}
                            <Button size='sm' variant="danger" onClick={() => setActiveMode("view")}><FaArrowLeft /> Batal</Button>    
                        </div>
                    </Card.Header>
                    <Card.Body className="text rounded shadow-sm">
                        <Row>
                            <Col lg={12}>
                                <Form.Group className="mb-3" controlId="formTitle">
                                    <Form.Label>Judul Berita</Form.Label>
                                    <Form.Control type="text" name="TITLE" defaultValue={NewsDetail.TITLE} onChange={handleOcNewsDetail} placeholder="Masukkan Judul Berita" disabled={readOnly}/>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3" controlId="formCategory">
                                    <Form.Label>Kategori</Form.Label>
                                    <Form.Select size="sm" name="NEWS_CAT_ID" onChange={handleOcNewsDetail} value={NewsDetail.NEWS_CAT_ID}  disabled={readOnly}>
                                        <option value="" disabled>Pilih Kategori</option>
                                        { ListCategory && ListCategory.map((item, index) => (
                                            <option key={index} value={item.NEWS_CAT_ID}>{item.NEWS_CAT_NAME}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col lg={8}>
                                <Form.Group className="mb-3" controlId="formAllowComment">
                                    <Form.Check // prettier-ignore
                                            type="switch"
                                            id="comment-switch"
                                            label="Ijinkan Komentar"
                                            name="ALLOW_COMMENT"
                                            onChange={handleOcNewsDetail}
                                            checked={NewsDetail.ALLOW_COMMENT==="Y" ? true : false}
                                            disabled={readOnly}
                                        />
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            id="visible-switch"
                                            label="Tampilkan di Aplikasi"
                                            name="VISIBLE"
                                            onChange={handleOcNewsDetail}
                                            checked={NewsDetail.VISIBLE==="Y" ? true : false}
                                            disabled={readOnly}
                                        />
                                </Form.Group>
                            </Col>
                        </Row>
                        {!readOnly ? (
                            <Row>
                                <Col lg={12}>
                                    <Form.Group controlId="tweetText">
                                        <input id="trixInput" type="hidden" value={NewsDetail.CONTENT} />
                                        <trix-editor ref={editorRef} input="trixInput"></trix-editor>
                                    </Form.Group>
                                </Col>
                            </Row>    
                        ) : (
                            <Row>
                                <Col sm={12}>
                                    <Card className="p-3 shadow-sm" style={{ maxWidth: "100%", margin: "auto" }} >
                                        <div dangerouslySetInnerHTML={{ __html: NewsDetail.CONTENT }} />
                                        <br/>
                                        <p style={{textDecoration:'overline'}}><FaNewspaper/> Dibuat pada { moment(NewsDetail.CREATE_DATE).format('DD-MM-YYYY HH:mm:ss') || ''} oleh <i>{ NewsDetail.CREATE_USERNAME || ''}</i></p>
                                    </Card>
                                    <br/>
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                    </Card>
            </Col>
        </Row>
        )}
        
    </div>  
    )
}

export default NewsContent;