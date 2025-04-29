import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import MdlNewsCat from '../component/compNews/MdlNewsCat'
import { AuthContext } from '../auth/AuthProvider'
import axios from '../axios/axios'
import { toast } from 'react-toastify'
import DropdownCus from '../partial/DropdownCus'
import Swal from 'sweetalert2'

const intialNewCat = {
    NEWS_CAT_NAME : '',
    NEWS_CAT_DESC : '',
    NEWS_CAT_ACTIVE : 0,
}


const NewsCategory = () => {
    const { value }                             = useContext(AuthContext);
    const {  idPerusahaan, userId }             = value;
    const [mdlCat, setMdlCat]                   = useState(false)
    const [newCatData, setNewCatData]           = useState(intialNewCat)
    const [listCategory, setListCategory]       = useState([])
    const [activeDropdown, setActiveDropdown]   = useState(null);
    const [type, setType]                       = useState('post');

    function activMdl(){
        setMdlCat(true)
    }
    function offMdl(){
        setMdlCat(false)
        setNewCatData(intialNewCat)
    }

    async function getNewsCategory(idPerusahaan) {
        await axios.get(`/news/category/${idPerusahaan}`)
        .then(res => {
            if(res.status === 200){
                setListCategory(res.data.data)
            }
        }).catch(err=> {
            return toast.error('Somthing whrong when get list category', {autoClose: 2000})
        })
    }


    useEffect(() => {
        getNewsCategory(idPerusahaan)
    }, [idPerusahaan])
    
    function handleOpnEdit(obj){
        setNewCatData(obj)
        setMdlCat(true)
        setType('patch')
    }

    async function deleteCatNews(objCat) {
         Swal.fire({
                 text: `Are You Delete ${objCat.NEWS_CAT_NAME} Category ?`,
                 icon: "question",
                 confirmButtonColor: "#2275f2",
                 showCancelButton: true,
                 confirmButtonText: "Yes",
                 cancelButtonText: "Cancel",
               }).then(async (result) => {
                 if (result.isConfirmed) {
                  const {NEWS_CAT_ID} = objCat
        
                   await axios
                     .delete(`/news/category/${NEWS_CAT_ID}`)
                     .then((res) => {
                       if (res.status === 200) {
                        getNewsCategory(idPerusahaan)
                        toast.success(res.data.message, { autoClose: 2000 });
                       }
                       if(res.status === 202){
                        toast.warning(res.data.message, { autoClose: 2000 });
                       }
                     })
                     .catch((err) => {
                       return toast.error("Somthing wrong when delete news category", {
                         autoClose: 2500,
                       });
                     });
                 }
               });
    }

    function actionList(obj) {
        return [
        //   {
        //     actionLable: "Reset Password",
        //     actExe: () => openMdlResetPass(id),
        //   },
          { actionLable: "Edit", 
            actExe: () => handleOpnEdit(obj)
        },
        //   {
        //     actionLable: "Detail",
        //     actExe: () => opnMdlDeatil(id),
        //   },
          {
            actionLable: "Delete",
            actExe: () => deleteCatNews(obj),
          },
        ];
      }


        function chgData(e){
              const {name, value} = e.target;
              
              if(name !== 'NEWS_CAT_ACTIVE'){
              setNewCatData(prev => {
                  return {...prev, [name]: value};
              });
            }else{            
                  setNewCatData(prev => {
                      return {...prev, [name]: value ? 1 : 0};
                  });
              }
          }
          
      
          async function submitNewCat(data) {        
              if(!data.NEWS_CAT_NAME) return;
              const dataPost = {...data, ID_COMPANY : idPerusahaan, NEWS_CAT_ADD_ID : userId}
              
              await axios[type]('/news/category', dataPost)
              .then(res => {
                  if(res.status === 200){
                      toast.success(res.data.message, {autoClose : 2000})
                      getNewsCategory(idPerusahaan)
                      offMdl()
                  }
                  if(res.status === 202){
                      toast.error(res.data.message, {autoClose : 2000})
                  }
              }).catch(err => {
                  console.log(err)
                  toast.error('Somthing whrong when add new categor y', {autoClose: 2000})
              })
          }
  return (
    <div>
        <Row className="m-0 mt-2">
            <Col>
                <CardShadow>
                    <Row className='mb-3'>
                        <Col>
                            <Button variant="primary" onClick={() => activMdl("Primary")}>
                                New
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Table responsive hover>
                            <thead>
                                <tr className='table-secondary'>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listCategory?.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.NEWS_CAT_NAME}</td>
                                        <td>{item.NEWS_CAT_DESC}</td>
                                        <td>{item.NEWS_CAT_ACTIVE ? 'Enabel' : 'Disabeld'}</td>
                                        <td>
                                            <DropdownCus
                                            label={"Action"}
                                            dropdownId={`dropdown${item.NEWS_CAT_ID}`}
                                            items={actionList(item)}
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
                </CardShadow>
            </Col>
        </Row>
        <MdlNewsCat show={mdlCat} 
        handleClose={offMdl} 
        newCatData={newCatData} 
        chgData={chgData}
        submitNewCat={submitNewCat}
        />
    </div>
  )
}

export default NewsCategory