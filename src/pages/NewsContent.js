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
import { toast } from 'react-toastify'


const NewsContent = () => {
    const editorRef                     = useRef(null);
    const inputRef = useRef(null);
    const { value } = useContext(AuthContext);
    const IDCompany = value.idPerusahaan;
    const IDUser = value.userId;
    
    const [ NewsPeriode, setNewsPeriode ] = useState({startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')});
    const [ ListCategory, setListCategory ] = useState([]);
    const [ NewsList, setNewsList ] = useState([]);
    const [ CommentList, setCommentList ] = useState([]);
    const [ activeDropdown, setActiveDropdown ] = useState(null);
    const [ activeMode, setActiveMode ] = useState("view");
    const [ readOnly, setReadOnly ] = useState(false);
    const [ NewsDetail, setNewsDetail ] = useState({NEWS_CAT_ID: "", NEWS_ID:0, TITLE: "", CONTENT: "", ALLOW_COMMENT:"Y", VISIBLE:"Y", CREATE_BY: IDUser, ATTACHMENT_1: ""});
    const [ attachment, setAttachment ] = useState(null);
    
    
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
            const comment = await axios.get(`/news/comment/${id}`);
            
            if (response.status === 200) {
                setNewsDetail(response.data.data[0]);
            }

            if(comment.status===200){
                setCommentList(comment.data.data);
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

    const handleOcNewsAttachment = (e) => {
        setAttachment(e.target.files[0]);
    }

    
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setNewsPeriode((prevState) => ({
            ...prevState,
            [name]: value
        }));
        switch (name) {
            case "StartDate":
                getNewsList(IDCompany, 'all', value, NewsPeriode.endDate);
            break;
            case "EndDate":
                getNewsList(IDCompany, 'all', NewsPeriode.startDate, value);
            break;
            default:
                break;
        }
    }

    const handleSubmitAddNews = async (e) => {
        e.preventDefault();
        const data1 = editorRef.current.editor.element.innerHTML
        
        const tryPost = await axios.post("/news/news", {...NewsDetail, CONTENT: data1});
        if (tryPost.status === 200) {
            toast.success("Berita berhasil ditambahkan!", {autoClose: 2000});
            setActiveMode("view");
            await getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
            if(attachment){
                const formData = new FormData();
                formData.append("attachment", attachment);
                formData.append("ID_NEWS", tryPost.data.data.ID_NEWS);
                await axios.post('/news/upload-attachment', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                });
            }
        } else {
            toast.error("Gagal menambahkan berita!", {autoClose: 2000});
        }
    }

    const handleDeleteNews = async(id) => {
        try {
            const tryDelete = await axios.delete(`/news/news/${id}`);
            if(tryDelete.status===200){
                toast.success("Berita berhasil dihapus!", {autoClose: 2000});
                setActiveMode("view");
                getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
            }
        } catch(err){
            toast.error("Gagal menghapus berita!", {autoClose: 2000});
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
          { actionLable: "Hapus", actExe: () => handleDeleteNews(id)},
        ];
    }

    

    useEffect(() => {
        getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
        getListCategory(IDCompany);
    }
    , [IDCompany, NewsPeriode.startDate, NewsPeriode.endDate]);


useEffect(() => {
  const editor = editorRef.current;
  const input = inputRef.current;


  if (!editor || !input) return;

  
  const handleTrixChange = () => {
    setNewsDetail((prevData) => ({
      ...prevData,
      CONTENT: input.value,
    }));
  };

  editor.addEventListener("trix-change", handleTrixChange);

  return () => {
    editor.removeEventListener("trix-change", handleTrixChange);
  };
}, []);



 // If content state changes externally, load it into Trix
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.loadHTML(NewsDetail.CONTENT);
    }
  }, [NewsDetail]);

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
                                            <th className="text-center">Like</th>
                                            <th className="text-center">Dislike</th>
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
                                                <td className="py-3 text-center">{item.COUNT_LIKE}</td>
                                                <td className="py-3 text-center">{item.COUNT_DISLIKE}</td>
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
                            <Col lg={4}>
                            { readOnly===false ? (
                            <>
                                <Form.Label>Tambahkan Lampiran:</Form.Label>
                                <Form.Control type="file" name='ATTACHMENT_1' size='sm' onChange={handleOcNewsAttachment} /><br/>
                            </>
                            ) : (
                                <>
                                <h5>Lampiran</h5>
                                    <p>{NewsDetail.ATTACHMENT_1}</p>
                                </>
                            )}
                               
                            </Col>
                        </Row>
                        {!readOnly ? (
                            <Row className='mt-3'>
                                <Col lg={12}>
                                    <Form.Group controlId="tweetText">
                                        <input
                                            id="trixInput"
                                            type="hidden"
                                            ref={inputRef}
                                            defaultValue={NewsDetail.CONTENT}
                                        />
                                        <trix-editor ref={editorRef} input="trixInput"></trix-editor>
                                        </Form.Group>

                                    <style>
                                        {`trix-toolbar [data-trix-action="attachFiles"] { display: none; }`}
                                    </style>

                                </Col>
                            </Row>    
                        ) : (
                            <>
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
                            <Row>
                                <Col sm={12}>
                                    <p>Comment</p>
                                    <Table striped bordered>
                                        {CommentList && CommentList.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <h5>{item.COMMENT_MESSAGE}</h5>
                                                <p className='text-right'>By {item.EMP_ID} on {moment(item.COMMENT_DATE).format('YYYY-MM-DD HH:mm:ss')}</p>
                                            </td>
                                        </tr>
                                        ))}
                                    </Table>
                                </Col>
                            </Row>
                            </>
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