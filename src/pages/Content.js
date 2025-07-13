import axios from '../axios/axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import logos from "../assets/logosa.png";

const Content = () => {
    const [compConent, setCompContent] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
         const searchParams = new URLSearchParams(window.location.search);
         const concentId = searchParams.get('contentId');

         if(!concentId){
            navigate('/login');
         }else{
               const getNewsDetailByID = async(id) => {
                    try {
                        const response = await axios.get(`/news/news-detail/${id}`);
                        // const comment = await axios.get(`/news/comment/${id}`);
                        
                        if (response.status === 200) {
                            setCompContent(response.data.data[0]);
                        }
            
                        // if(comment.status===200){
                        //     setCommentList(comment.data.data);
                        // }
                    } catch(err) {
                        console.log(err);
                    }
                }
                getNewsDetailByID(concentId)
         }

        
    }, [navigate])
    
  return (
    <Container>
        <Row className='mt-4'>
            <Col className='bg-primary rounded py-3 align-content-center'>
                <img
                    src={logos}
                    alt="logo"
                    style={{ width: "50px", height: "50px", cursor: 'pointer' }}
                ></img>
                <span className='fw-bold fs-3 text-light align-middle ms-2' >
                    ONTIDE
                </span>
            </Col>
        </Row>
        <Row className='my-3'>
            <Col>
            {compConent ? 
                <div dangerouslySetInnerHTML={{ __html: compConent.CONTENT }} />
            : ''}
            </Col>
        </Row>
    </Container>
  )
}

export default Content