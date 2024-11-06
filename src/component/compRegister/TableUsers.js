import React from "react";
import { Col, Row, Table, Button } from "react-bootstrap";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { HiOutlineKey } from "react-icons/hi";

const TableUsers = ({ users, findUser, confirmModal, userAccessMen }) => {
  return (
    <Row className=" px-2 border-top">
      <Col className=" mt-3 ">
        <Table size="sm" responsive hover className="text">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Nama PIC</th>
              <th>Nama Perusahaan</th>
              <th>No Tlp</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((userd) => userd.USER_DELETE_STATUS !== 1)
              .map((user, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{user.USER_NAME}</td>
                  <td>{user.USER_INISIAL}</td>
                  <td>{user?.USER_PERUSAHAAN}</td>
                  <td>{user?.USER_TEL}</td>
                  <td>{user.USER_LEVEL === null ? "-" : user.USER_LEVEL}</td>
                  <td>{user.USER_EMAIL}</td>
                  <td>
                    {user.USER_AKTIF_STATUS === 1 ? "Active" : "Disabled"}
                  </td>

                  <td className="">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => findUser(user.USER_ID)}
                    >
                      <AiOutlineEdit />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => confirmModal(user.USER_ID)}
                    >
                      <AiOutlineDelete />
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => userAccessMen(user.USER_ID)}
                    >
                      <HiOutlineKey />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default TableUsers;
