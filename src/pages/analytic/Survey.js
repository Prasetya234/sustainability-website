import React, { useState, useEffect, useContext } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import axios from '../../axios/axios';
import '../../styles/analytic/Survey.css';
import { AuthContext } from '../../auth/AuthProvider';

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
    setDateRange({ startDate: start, endDate: end });
  };

  const getSurveyData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/analytics/survey', {
        params: {
          companyId: idPerusahaan,
          startDate: dateRange.startDate ? dateRange.startDate.toISOString().split('T')[0] : null,
          endDate: dateRange.endDate ? dateRange.endDate.toISOString().split('T')[0] : null,
        },
      });
      setSurveys(response.data.surveys || []);
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurveyData();
  }, [idPerusahaan, dateRange.startDate, dateRange.endDate]);

  return (
    <div className="survey-container">
      <div className="filter-section">
        <div className="date-picker">
          <label>Date Range:</label>
          <DateRangePicker
            initialSettings={{
              autoUpdateInput: false,
              locale: {
                format: 'YYYY-MM-DD',
              },
            }}
            onCallback={handleDateRangeChange}
          >
            <input
              type="text"
              className="form-control"
              readOnly
              value={
                dateRange.startDate && dateRange.endDate
                  ? `${dateRange.startDate.format('YYYY-MM-DD')} - ${dateRange.endDate.format('YYYY-MM-DD')}`
                  : ''
              }
              placeholder="Select date range"
            />
          </DateRangePicker>
        </div>
      </div>
      <div className="survey-card">
        <h4 className="survey-title">Survey List</h4>
        <div className="survey-table-container">
          <table className="survey-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Category</th>
                <th>Count Answer</th>
                <th>Jam Mulai</th>
                <th>Jam Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {surveys.length > 0 ? (
                surveys.map((survey) => (
                  <tr key={survey.id}>
                    <td>{survey.name}</td>
                    <td>{survey.category || 'N/A'}</td>
                    <td>{survey.answerCount}</td>
                    <td>{survey.startDate}</td>
                    <td>{survey.createdDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No surveys found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;