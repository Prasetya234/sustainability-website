import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import axios from "../axios/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../auth/AuthProvider";

const ExamAnswer = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [assessments, setAssessments] = useState([]);
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]); 
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  
  const getExams = async () => {
    try {
      const response = await axios.get("/exam?EMP_COMPANY=" + idPerusahaan); 
      if (response.status === 200) {
        setExams(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to retrieve exams", { autoClose: 3000 });
    }
  };

  
  const getAssessments = async () => {
    if (!examId) {
      setAssessments([]);
      return;
    }
    try {
      const response = await axios.get(`/assessment?CATEGORY=GENERAL&EXAM_ID=${examId}&COMPANY_ID=${idPerusahaan}`);
      if (response.status === 200) {
        setAssessments(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to retrieve assessments", { autoClose: 3000 });
    }
  };

  
  const deleteAssessment = async (id) => {
    try {
      const response = await axios.delete(`/assessments/${id}`);
      if (response.status === 200) {
        toast.success("Assessment deleted successfully", { autoClose: 3000 });
        getAssessments(); 
      }
    } catch (error) {
      toast.error("Failed to delete assessment", { autoClose: 3000 });
    }
  };

  
  const handleExamChange = (e) => {
    setExamId(e.target.value);
  };

  useEffect(() => {
    getExams();
  }, []);

  useEffect(() => {
    getAssessments();
  }, [examId]);

  return (
    <div className="container">
      {/* Header and Exam Selector */}
      <Row className="m-0 mt-2">
        <Col>
          <Form.Group controlId="examSelect">
            <Form.Label>Select Exam</Form.Label>
            <Form.Select value={examId} onChange={handleExamChange} required>
              <option value="">Select an Exam</option>
              {exams.map((exam) => (
                <option key={exam.ID} value={exam.ID}>
                  {exam.NAME || `Exam ${exam.ID}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Assessments Table */}
      <Row className="mt-3">
        <Col>
          <Table responsive hover className="text-muted">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.ID}>
                  <td>{assessment.EMP_ID}</td>
                  <td>{assessment?.EMPLOYEE?.EMP_FULL_NAME}</td>
                  <td>{assessment.POST_TEST_SCORE || "N/A"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        Swal.fire({
                          text: `Are you sure you want to delete this assessment?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "Cancel",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await deleteAssessment(assessment.ID);
                          }
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default ExamAnswer;