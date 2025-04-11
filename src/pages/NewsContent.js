import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { CardShadow } from '../partial/CardShadow'

const NewsContent = () => {
  return (
    <div>
        <Row className="m-0 mt-2">
            <Col>
                <CardShadow></CardShadow>
            </Col>
        </Row>
    </div>  
    )
}

export default NewsContent