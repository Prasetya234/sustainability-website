import React, { useState, useEffect, useContext } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import axios from '../../axios/axios';
import '../../styles/analytic/Survey.css';
import { AuthContext } from '../../auth/AuthProvider';
import moment from 'moment'; 
import { Col, Row } from 'react-bootstrap';

const SurveyList = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [surveys, setSurveys] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(false);

  
  const handleDateRangeChange = (start, end) => {
    setDateRange({
      startDate: start,
      endDate: end,
    });
  };

  
  const getSurveyData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/analytics/survey', {
        params: {
          companyId: idPerusahaan,
          startDate: dateRange.startDate ? dateRange.startDate.format('YYYY-MM-DD') : null,
          endDate: dateRange.endDate ? dateRange.endDate.format('YYYY-MM-DD') : null,
        },
      });
      setSurveys(response.data.surveys || []);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      setSurveys([]); 
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    getSurveyData();
  }, [idPerusahaan, dateRange.startDate, dateRange.endDate]);

  return (
    <div className="report-survey-container">
      <div className="report-survey-filter-section">
        <div className="report-survey-date-picker">
          <Row>
            <Col md={3}>
              <label>Date Range:</label>
              <DateRangePicker
                initialSettings={{
                  autoUpdateInput: false,
                  locale: {
                    format: 'YYYY-MM-DD',
                  },
                  startDate: dateRange.startDate || moment().startOf('month').toDate(),
                  endDate: dateRange.endDate || moment().endOf('month').toDate(),
                }}
                onCallback={handleDateRangeChange}
              >
                <input
                  type="text"
                  className="report-survey-form-control"
                  readOnly
                  value={
                    dateRange.startDate && dateRange.endDate
                      ? `${dateRange.startDate.format('YYYY-MM-DD')} - ${dateRange.endDate.format('YYYY-MM-DD')}`
                      : 'Select date range'
                  }
                  placeholder="Select date range"
                />
              </DateRangePicker>
            </Col>
            <Col md={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                className="report-survey-btn-primary report-survey-mt-2"
                onClick={getSurveyData}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
            </Col>
          </Row>
        </div>
      </div>
      <div className="report-survey-card">
        <h4 className="report-survey-title">Survey List</h4>
        <div className="report-survey-table-container">
          {loading ? (
            <div className="report-survey-loading">Loading...</div>
          ) : (
            <table className="report-survey-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Jumlah Jawaban</th>
                  <th>Jam Mulai</th>
                  <th>Jam Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {surveys.length > 0 ? (
                  surveys.map((survey) => (
                    <tr key={survey.id}>
                      <td>{survey.name || 'N/A'}</td>
                      <td>{survey.category || 'N/A'}</td>
                      <td>{survey.answerCount || 0}</td>
                      <td>{survey.startDate ? moment(survey.startDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</td>
                      <td>{survey.createdDate ? moment(survey.createdDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No surveys found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyList;