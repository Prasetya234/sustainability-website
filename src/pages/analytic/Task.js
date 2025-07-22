import React, { useState, useEffect, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../axios/axios';
import '../../styles/analytic/TaskReport.css';
import { AuthContext } from '../../auth/AuthProvider';

const TaskReport = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  
  const [counts, setCounts] = useState({
    tugasBaru: 0,
    tugasDiterimaPengguna: 0,
    tugasDiterima: 0,
    tugasDiselesaikanPengguna: 0,
    waktuPenyelesaian: 0,
    rasioPenyelesaian: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    series: [{ name: 'Jumlah Tugas', data: [] }],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      title: { text: `Task Analytics by Month (${new Date().getFullYear()})` },
      colors: ['#2ecc71'],
    },
  });
  const [detailData, setDetailData] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const getData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axios.get(`/analytics/task`, {
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
          title: { text: `Task Analytics by Month (${selectedYear || year})` },
        },
      });
      setDetailData(data.detailData);
      setCounts(data.counts || {
        tugasBaru: 0,
        tugasDiterimaPengguna: 0,
        tugasDiterima: 0,
        tugasDiselesaikanPengguna: 0,
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
    <div className="container">
      <div className="card">
        <div className="count-row">
          <div className="count-card">Tugas Baru: <span className="count">{counts.tugasBaru}</span></div>
          <div className="count-card">Tugas Diterima Pengguna: <span className="count">{counts.tugasDiterimaPengguna}</span></div>
          <div className="count-card">Tugas Diterima: <span className="count">{counts.tugasDiterima}</span></div>
          <div className="count-card">Tugas Diselesaikan Pengguna: <span className="count">{counts.tugasDiselesaikanPengguna}</span></div>
          <div className="count-card">Waktu Penyelesaian (menit): <span className="count">{counts.waktuPenyelesaian}</span></div>
          <div className="count-card">Rasio Penyelesaian: <span className="count">{counts.rasioPenyelesaian}%</span></div>
        </div>
      </div>
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
        <h4 className="mb-5">List Tasks</h4>
        <div className="detail-content">
          {detailData.map((item, index) => (
            <div key={index} className="detail-item">
              <span className="detail-name">{item.name}</span>
              <span className="detail-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskReport;