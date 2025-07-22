import React, { useState, useEffect, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../axios/axios';
import '../../styles/analytic/LearningReport.css';
import { AuthContext } from '../../auth/AuthProvider';

const LearningReport = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [counts, setCounts] = useState({
    pembelajaranBaru: 0,
    pembelajaranDiterimaPengguna: 0,
    pembelajaranDiterima: 0,
    pembelajaranDiselesaikanPengguna: 0,
    waktuPenyelesaian: 0,
    rasioPenyelesaian: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    series: [{ name: 'Jumlah Pembelajaran', data: [] }],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      title: { text: `Learning Analytics by Month (${new Date().getFullYear()})` },
      colors: ['#3498db'],
    },
  });
  const [detailData, setDetailData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axios.get(`/analytics/learning`, {
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
          title: { text: `Learning Analytics by Month (${selectedYear || year})` },
        },
      });
      setDetailData(data.detailData);
      setCounts(data.counts || {
        pembelajaranBaru: 0,
        pembelajaranDiterimaPengguna: 0,
        pembelajaranDiterima: 0,
        pembelajaranDiselesaikanPengguna: 0,
        waktuPenyelesaian: 0,
        rasioPenyelesaian: 0,
      });
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
    <div className="report-learning-container">
      <div className="report-learning-card">
        <div className="report-learning-count-row">
          <div className="report-learning-count-card"><span style={{height: 40}}>Pembelajaran Baru</span><span className="report-learning-count">{counts.pembelajaranBaru}</span></div>
          <div className="report-learning-count-card"><span style={{height: 40}}>Pembelajaran Diterima Pengguna</span><span className="report-learning-count">{counts.pembelajaranDiterimaPengguna}</span></div>
          <div className="report-learning-count-card"><span style={{height: 40}}>Pembelajaran Diterima</span><span className="report-learning-count">{counts.pembelajaranDiterima}</span></div>
          <div className="report-learning-count-card"><span style={{height: 40}}>Pembelajaran Diselesaikan Pengguna</span><span className="report-learning-count">{counts.pembelajaranDiselesaikanPengguna}</span></div>
          <div className="report-learning-count-card"><span style={{height: 40}}>Waktu Penyelesaian (sesi)</span><span className="report-learning-count">{counts.waktuPenyelesaian}</span></div>
          <div className="report-learning-count-card"><span>Rasio Penyelesaian</span><span className="report-learning-count">{counts.rasioPenyelesaian}%</span></div>
        </div>
      </div>
      <div className="report-learning-filter">
        <input
          type="number"
          placeholder="YYYY"
          min="2017"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="report-learning-form-control report-learning-me-2"
        />
        <button onClick={handleFilter} className="report-learning-btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </div>
      <div className="report-learning-card">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
      <div className="report-learning-card">
        <h4 className="report-learning-mb-5">List Pembelajaran</h4>
        <div className="report-learning-detail-content">
          {detailData.map((item, index) => (
            <div key={index} className="report-learning-detail-item">
              <span className="report-learning-detail-name">{item.name} ({item.categoryName})</span>
              <span className="report-learning-detail-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningReport;