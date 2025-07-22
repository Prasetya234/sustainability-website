import React, { useState, useEffect, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../axios/axios';
import '../../styles/analytic/PersonalInfoReport.css';
import { AuthContext } from '../../auth/AuthProvider';

const PersonalInfoReport = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [counts, setCounts] = useState({
    penayangan: 0,
    rasioPenayangan: 0,
    penayanganClicks: 0,
    penayanganPerOrang: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    series: [
      { name: 'THR Visits', data: [] }, // Diperbarui dari Slip Gaji Visits ke THR Visits
      { name: 'Payslip Visits', data: [] }
    ],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      title: { text: `Personal Info Analytics by Month (${new Date().getFullYear()})` },
      colors: ['#e67e22', '#f1c40f'],
    },
  });
  const [loading, setLoading] = useState(false);

  const getData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axios.get(`/analytics/informasi`, { // Pastikan endpoint sesuai
        params: {
          year: selectedYear || year,
          companyId: idPerusahaan,
        },
      });
      const data = response.data;
      setChartData({
        series: data.chartData.series, // Mengambil series langsung dari backend
        options: {
          ...chartData.options,
          title: { text: `Personal Info Analytics by Month (${selectedYear || year})` },
        },
      });
      setCounts(data.counts || {
        penayangan: 0,
        rasioPenayangan: 0,
        penayanganClicks: 0,
        penayanganPerOrang: 0,
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
    <div className="report-info-pribadi-container">
      <div className="report-info-pribadi-card">
        <div className="report-info-pribadi-count-row">
          <div className="report-info-pribadi-count-card"><span> Penayangan: </span><span className="report-info-pribadi-count">{counts.penayangan}</span></div>
          <div className="report-info-pribadi-count-card"><span> Rasio Penayangan: </span><span className="report-info-pribadi-count">{counts.rasioPenayangan}%</span></div>
          <div className="report-info-pribadi-count-card"><span> Penayangan: </span><span className="report-info-pribadi-count">{counts.penayanganClicks}</span></div>
          <div className="report-info-pribadi-count-card"><span> Penayangan/orang: </span><span className="report-info-pribadi-count">{counts.penayanganPerOrang}</span></div>
        </div>
      </div>
      <div className="report-info-pribadi-filter">
        <input
          type="number"
          placeholder="YYYY"
          min="2017"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="report-info-pribadi-form-control report-info-pribadi-me-2"
        />
        <button onClick={handleFilter} className="report-info-pribadi-btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </div>
      <div className="report-info-pribadi-card">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default PersonalInfoReport;