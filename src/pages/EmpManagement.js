import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Table, Pagination } from "react-bootstrap";

const EmpManagement = () => {
    // const [ ListEmp, SetListEmp ] = useState([]);
    const [ ItemPagination, setItemPagination ] = useState([]);

    function ConfigPagination(){
        let active = 10;
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active}>
                {number}
                </Pagination.Item>,
            );
        }
        setItemPagination(items);
    }

    useEffect(() => {
        ConfigPagination();
    }, []);


    return (
    <Row className="mx-0 mt-3">
        <Col className="ps-3 p-2">
          <Card className="border-0 ">
            <Card.Header>
                <Button variant={"primary"}>ADD </Button>&nbsp; &nbsp;<Button variant={"success"}>IMPORT IN BATCH</Button>&nbsp; &nbsp;<Button variant={"danger"}>DELETE IN BATCH </Button>
            </Card.Header>
            <Card.Body className="text rounded shadow-sm">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Status</th>
                            <th>Active</th>
                            <th>Username</th>
                            <th>Employee ID</th>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>Department</th>
                            <th>Last Update</th>
                            <th>Action</th>    
                        </tr>    
                    </thead>
                    <tbody>
                        <tr>
                            <td>Avatar</td>
                            <td>Status</td>
                            <td>Active</td>
                            <td>Username</td>
                            <td>Employee ID</td>
                            <td>Full Name</td>
                            <td>Gender</td>
                            <td>Department</td>
                            <td>Last Update</td>
                            <td>Action</td>

                        </tr>    
                    </tbody>    
                </Table>
                <Pagination>{ItemPagination}</Pagination>
                <br />

            </Card.Body>
            </Card>
        </Col>
    </Row>
    )
}

export default EmpManagement;