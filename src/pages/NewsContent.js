import React, { useContext, useEffect, useState, useRef } from 'react'
import { Col, Row, Form, Button, Card, Table } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import { FaArrowLeft, FaFileExcel, FaNewspaper, FaPlus, FaCopy, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import axios from "../axios/axios.js";
import { AuthContext } from '../auth/AuthProvider'
import NewDropDown from "../partial/NewDropDown";
import "trix/dist/trix.css";
import "trix";
import { toast } from 'react-toastify'

const NewsContent = () => {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const { value } = useContext(AuthContext);
    const IDCompany = value.idPerusahaan;
    const IDUser = value.userId;

    const [NewsPeriode, setNewsPeriode] = useState({ startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD') });
    const [ListCategory, setListCategory] = useState([]);
    const [NewsList, setNewsList] = useState([]);
    const [CommentList, setCommentList] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeMode, setActiveMode] = useState("view");
    const [readOnly, setReadOnly] = useState(false);
    const [NewsDetail, setNewsDetail] = useState({
        NEWS_CAT_ID: "",
        NEWS_ID: 0,
        TITLE: "",
        CONTENT: "",
        ALLOW_COMMENT: "Y",
        VISIBLE: "Y",
        CREATE_BY: IDUser,
        ATTACHMENT_1: ""
    });
    const [images, setImages] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentLink, setAttachmentLink] = useState("");


    const uploadSingleFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("storage", "news");
        formData.append("return", "link");
        try {
            const response = await axios.post("/mobile/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                return response.data.data;
            }
            return "";
        } catch (error) {
            toast.error("Gagal mengunggah gambar", { autoClose: 3000 });
            return "";
        }
    };

    const getNewsList = async (idPerusahaan, idKategori, startDate, endDate) => {
        try {
            const response = await axios.get(`/news/news/${idPerusahaan}/${idKategori}/${startDate}/${endDate}`);
            if (response.status === 200) {
                setNewsList(response.data.data);
            } else {
                setNewsList([]);
            }
        } catch (err) {
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
        } catch (err) {
            console.log(err);
        }
    }

    const getNewsImages = async (id) => {
        try {
            const response = await axios.get(`/news/download-image/${id}`, {
                responseType: 'blob'
            });
            if (response.status === 200) {
                const blob = new Blob([response.data]);
                const url = URL.createObjectURL(blob);
                setImages(url);
            }
        } catch (err) {
            toast.warning('Gagal mendapatkan gambar berita');
        }
    }

    const getNewsAttachment = async (id) => {
        try {
            const response = await axios.get(`/news/download-attachment/${id}`, {
                responseType: 'blob'
            });
            if (response.status === 200) {
                const blob = new Blob([response.data]);
                const url = URL.createObjectURL(blob);
                setAttachment(url);
            }
        } catch (err) {
            toast.warning('Gagal mendapatkan lampiran berita');
        }
    }

    const getNewsDetailByID = async (id) => {
        try {
            const response = await axios.get(`/news/news-detail/${id}`);
            const comment = await axios.get(`/news/comment/${id}`);

            if (response.status === 200) {
                const data = response.data.data[0]
                setUploadedImageUrl(data.IMAGES_FILE_LINK)
                setAttachmentLink(data.ATTACHMENT_1_LINK)
                setNewsDetail(data);
                if (data.IMAGES_FILE) {
                    await getNewsImages(id);
                }
                if (data.ATTACHMENT_1) {
                    await getNewsAttachment(id);
                }
            }

            if (comment.status === 200) {
                setCommentList(comment.data.data);
            }
        } catch (err) {
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
                    ALLOW_COMMENT: checked ? "Y" : "N"
                }));
                break;
            case "VISIBLE":
                setNewsDetail((prevState) => ({
                    ...prevState,
                    VISIBLE: checked ? "Y" : "N"
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

    const handleOcNewsImages = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImages(file);
        setUploadedImageUrl("");

        const imageUrl = await uploadSingleFile(file);
        if (imageUrl) {
            setUploadedImageUrl(imageUrl);
            toast.success("Gambar berhasil diunggah!", { autoClose: 2000 });
        }
    }

    const handleOcNewsAttachment = async (e) => {
        
        const file = e.target.files[0];
        if (!file) return;

        setAttachment(file);
        setAttachmentLink("");

        const imageUrl = await uploadSingleFile(file);
        if (imageUrl) {
            setAttachmentLink(imageUrl);
            toast.success("Gambar berhasil diunggah!", { autoClose: 2000 });
        }
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setNewsPeriode((prevState) => ({
            ...prevState,
            [name === "StartDate" ? "startDate" : "endDate"]: value
        }));
        getNewsList(IDCompany, 'all', name === "StartDate" ? value : NewsPeriode.startDate, name === "EndDate" ? value : NewsPeriode.endDate);
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Link gambar disalin!", { autoClose: 2000 });
        }).catch(() => {
            toast.error("Gagal menyalin link");
        });
    }

    const handleRemoveImage = () => {
        setImages(null);
        setUploadedImageUrl("");
        if (inputRef.current?.files) {
            inputRef.current.value = "";
        }
    }

    const handleSubmitAddNews = async (e) => {
        e.preventDefault();
        const contentHtml = editorRef.current?.editor?.element?.innerHTML || NewsDetail.CONTENT;

        try {
            const newsPayload = {
                ...NewsDetail,
                CONTENT: contentHtml,
                CREATE_BY: IDUser
            };

            const tryPost = await axios.post("/news/news", newsPayload);
            const newsId = tryPost.data.data.ID_NEWS;
            toast.success("Berita berhasil ditambahkan!", { autoClose: 2000 });


            if (attachment && attachment instanceof File) {
                const formDataAttachment = new FormData();
                formDataAttachment.append("attachment", attachment);
                formDataAttachment.append("ID_NEWS", newsId);
                await axios.post('/news/upload-attachment', formDataAttachment, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }


            if (images && images instanceof File) {
                const formData = new FormData();
                formData.append("images", images);
                formData.append("ID_NEWS", newsId);
                await axios.post('/news/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }


            setActiveMode("view");
            setImages(null);
            setUploadedImageUrl("");
            setAttachment(null);
            setAttachmentLink("")
            await getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);

        } catch (err) {
            console.error(err);
            toast.error("Gagal menyimpan berita", { autoClose: 3000 });
        }
    }

    const handleDeleteNews = async (id) => {
        try {
            const tryDelete = await axios.delete(`/news/news/${id}`);
            if (tryDelete.status === 200) {
                toast.success("Berita berhasil dihapus!", { autoClose: 2000 });
                setActiveMode("view");
                getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
            }
        } catch (err) {
            toast.error("Gagal menghapus berita!", { autoClose: 2000 });
        }
    }

    const handleAddNews = () => {
        setNewsDetail({
            NEWS_CAT_ID: "",
            TITLE: "",
            CONTENT: "",
            ALLOW_COMMENT: "Y",
            VISIBLE: "Y",
            CREATE_BY: IDUser,
            ATTACHMENT_1: ""
        });
        setActiveMode("edit");
        setReadOnly(false);
        setImages(null);
        setUploadedImageUrl("");
        setAttachment(null);
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

    const BackToView = () => {
        setActiveMode('view');
        setAttachment(null);
        setImages(null);
        setUploadedImageUrl(null);
    }

    const actionList = (id) => {
        return [
            { actionLable: "Edit", actExe: () => handleEditNews(id) },
            { actionLable: "Hapus", actExe: () => handleDeleteNews(id) },
        ];
    }

    useEffect(() => {
        getNewsList(IDCompany, "all", NewsPeriode.startDate, NewsPeriode.endDate);
        getListCategory(IDCompany);
    }, [IDCompany, NewsPeriode.startDate, NewsPeriode.endDate]);

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

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.editor.loadHTML(NewsDetail.CONTENT || "");
        }
    }, [NewsDetail]);

    const isImage = (url) => {
        if (!url) return false;
        return url.startsWith('data:image') || /\.(jpg|jpeg|png|gif)$/i.test(url);
    };

    return (
        <div>
            {activeMode === "view" && (
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
                                                <Form.Control size="sm" type="date" defaultValue={NewsPeriode.endDate} name="EndDate" onChange={handleDateChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formEndDate">
                                                <Form.Label>Kategori</Form.Label>
                                                <Form.Select size="sm" onChange={handleCategoryChange} name="NewsCategory">
                                                    <option value="all">Semua</option>
                                                    {ListCategory && ListCategory.map((item, index) => (
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

            {activeMode === "edit" && (
                <Row className="m-0 mt-2">
                    <Col lg={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3>{NewsDetail.ID_NEWS ? "Edit" : "Buat"} Berita</h3>
                                </div>
                                <div>
                                    {!readOnly && (
                                        <Button size='sm' variant="success" onClick={handleSubmitAddNews}><FaPlus /> Simpan</Button>
                                    )}
                                    <Button size='sm' variant="danger" onClick={BackToView}><FaArrowLeft /> Batal</Button>
                                </div>
                            </Card.Header>
                            <Card.Body className="text rounded shadow-sm">
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="formTitle">
                                            <Form.Label>Judul Berita</Form.Label>
                                            <Form.Control type="text" name="TITLE" value={NewsDetail.TITLE || ""} onChange={handleOcNewsDetail} placeholder="Masukkan Judul Berita" disabled={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="formCategory">
                                            <Form.Label>Kategori</Form.Label>
                                            <Form.Select size="sm" name="NEWS_CAT_ID" onChange={handleOcNewsDetail} value={NewsDetail.NEWS_CAT_ID || ""} disabled={readOnly}>
                                                <option value="" disabled>Pilih Kategori</option>
                                                {ListCategory && ListCategory.map((item, index) => (
                                                    <option key={index} value={item.NEWS_CAT_ID}>{item.NEWS_CAT_NAME}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={8}>
                                        <Form.Group className="mb-3" controlId="formAllowComment">
                                            <Form.Check
                                                type="switch"
                                                id="comment-switch"
                                                label="Ijinkan Komentar"
                                                name="ALLOW_COMMENT"
                                                onChange={handleOcNewsDetail}
                                                checked={NewsDetail.ALLOW_COMMENT === "Y"}
                                                disabled={readOnly}
                                            />
                                            <Form.Check
                                                type="switch"
                                                id="visible-switch"
                                                label="Tampilkan di Aplikasi"
                                                name="VISIBLE"
                                                onChange={handleOcNewsDetail}
                                                checked={NewsDetail.VISIBLE === "Y"}
                                                disabled={readOnly}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {!readOnly && (
                                        <>
                                            <Col lg={4}>
                                                <Form.Label>Tambahkan Gambar:</Form.Label>
                                                <Form.Control type="file" accept="image/*" name='IMAGES_FILE' size='sm' onChange={handleOcNewsImages} />
                                            </Col>
                                            <Col lg={4}>
                                                <Form.Label>Tambahkan Lampiran:</Form.Label>
                                                <Form.Control type="file" name='ATTACHMENT_1' size='sm' onChange={handleOcNewsAttachment} />
                                            </Col>
                                        </>
                                    )}
                                </Row>

                                {/* Preview Gambar */}
                                    <Row className="mt-3">

                                {(images || uploadedImageUrl) && (
                                        <Col lg={4}>
                                            <h5>Gambar</h5>
                                            <div style={{ marginTop: '1rem' }}>
                                                <img
                                                    src={
                                                        images instanceof File
                                                            ? URL.createObjectURL(images)
                                                            : uploadedImageUrl || images
                                                    }
                                                    alt="News Image"
                                                    style={{ maxWidth: '100%', maxHeight: '500px', border: '1px solid #ccc' }}
                                                />
                                            </div>
                                            <div className="mt-2">
                                                {uploadedImageUrl && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => copyToClipboard(uploadedImageUrl)}
                                                        >
                                                            <FaCopy /> Copy Link
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <FaTrash /> Hapus
                                                </Button>
                                            </div>
                                        </Col>
                                )}

                                {attachment && (
                                        <Col lg={4}>
                                            <h5>Lampiran</h5>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                href={attachment}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaFileExcel /> Download Lampiran
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() => copyToClipboard(attachmentLink)}

                                            >
                                                <FaCopy /> Copy Link
                                            </Button>
                                        </Col>
                                )}
                                </Row>

                                {!readOnly ? (
                                    <Row className='mt-3'>
                                        <Col lg={12}>
                                            <Form.Group controlId="tweetText">
                                                <input
                                                    id="trixInput"
                                                    type="hidden"
                                                    ref={inputRef}
                                                    defaultValue={NewsDetail.CONTENT || ""}
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
                                                <Card className="p-3 shadow-sm mt-4" style={{ maxWidth: "100%", margin: "auto" }}>
                                                    <div dangerouslySetInnerHTML={{ __html: NewsDetail.CONTENT || "" }} />
                                                    <br />
                                                    <p style={{ textDecoration: 'overline' }}>
                                                        <FaNewspaper /> Dibuat pada {moment(NewsDetail.CREATE_DATE).format('DD-MM-YYYY HH:mm:ss') || ''} oleh <i>{NewsDetail.CREATE_USERNAME || ''}</i>
                                                    </p>
                                                </Card>
                                                <br />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={12}>
                                                <p>Komentar</p>
                                                <Table striped bordered>
                                                    {CommentList && CommentList.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <h5>{item.COMMENT_MESSAGE}</h5>
                                                                <p className='text-right'>
                                                                    By {item?.EMPLOYEE_DETAILS?.EMP_FULL_NAME || item?.EMP_ID} on {moment(item.COMMENT_DATE).format('YYYY-MM-DD HH:mm:ss')}
                                                                </p>
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