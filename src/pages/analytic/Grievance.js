import React, { useState, useEffect, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../axios/axios';
import '../../styles/analytic/GrievanceReport.css';
import { AuthContext } from '../../auth/AuthProvider';

const GrievanceReport = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  
  const [chartData, setChartData] = useState({
    series: [
      { name: 'Mendesak', data: [] },
      { name: 'Banding', data: [] },
      { name: 'Konsultasi', data: [] },
      { name: 'Pertanyaan Umum', data: [] },
    ],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      title: { text: `Grievance Analytics by Month (${new Date().getFullYear()})` },
      colors: ['#e74c3c', '#e67e22', '#3498db', '#2ecc71'],
    },
  });
  const [detailData, setDetailData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  
  const getData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axios.get(`/analytics/grievance`, {
        params: {
          year: selectedYear || year,
          companyId: idPerusahaan,
        },
      });
      const data = response.data;
      setChartData({
        series: data.chartData.series,
        options: {
          ...chartData.options,
          title: { text: `Grievance Analytics by Month (${selectedYear || year})` },
        },
      });
      setDetailData(data.detailData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    getData(year);
  }, [year]);

  
  const handleFilter = () => {
    getData(year);
  };

  return (
    <div className="container">
      <div className="filter">
        <input
          type="number"
          placeholder="YYYY"
          min="2017"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-control me-2"
        />
        <button onClick={handleFilter} className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </div>
      <div className="card">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
      <div className="card">
        <h4 className="mb-5">List Grievances</h4>
        <div className="detail-content">
          {Object.entries(detailData).map(([category, items], index) => (
            <div key={index}>
              <h5>{category}</h5>
              {items.map((item, idx) => (
                <div key={idx} className="detail-item">
                  <span className="detail-name">{item.title} ({item.subcategory})</span>
                  <span className="detail-count">{item.status}</span>
                  <span className="detail-date">{new Date(item.submitDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrievanceReport;