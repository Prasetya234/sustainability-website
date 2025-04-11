import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'
import MdlNewsCat from '../component/compNews/MdlNewsCat'
import { AuthContext } from '../auth/AuthProvider'
import axios from '../axios/axios'
import { toast } from 'react-toastify'
import DropdownCus from '../partial/DropdownCus'

const intialNewCat = {
    NEWS_CAT_NAME : '',
    NEWS_CAT_DESC : '',
    NEWS_CAT_ACTIVE : 0,
}


const NewsCategory = () => {
    const { value }                     = useContext(AuthContext);
    const {  idPerusahaan, userId }     = value;
    const [mdlCat, setMdlCat]           = useState(false)
    const [newCatData, setNewCatData]   = useState(intialNewCat)
    const [listCategory, setListCategory]   = useState([])
    const [activeDropdown, setActiveDropdown] = useState(null);

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
    

    function actionList(id) {
        return [
        //   {
        //     actionLable: "Reset Password",
        //     actExe: () => openMdlResetPass(id),
        //   },
          { actionLable: "Edit", 
            // actExe: () => editeBe(id)
        },
        //   {
        //     actionLable: "Detail",
        //     actExe: () => opnMdlDeatil(id),
        //   },
          {
            actionLable: "Delete",
            // actExe: () => deleteUser(id),
          },
        ];
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
                                            items={actionList(item.USER_ID)}
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
        setNewCatData={setNewCatData} 
        idPerusahaan={idPerusahaan}
        userId={userId}
        getNewsCategory={getNewsCategory}
        />
    </div>
  )
}

export default NewsCategory