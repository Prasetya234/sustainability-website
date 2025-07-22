import React, { useState, useEffect, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../axios/axios';
import '../../styles/analytic/AnalyticsNews.css';
import { AuthContext } from '../../auth/AuthProvider';

const AnalyticsNews = () => {
  const { value } = useContext(AuthContext);
  const { idPerusahaan } = value;

  const [counts, setCounts] = useState({
    jumlahBerita: 0,
    jumlahPengakses: 0,
    tingkatKlik: 0,
    jumlahKlik1: 0,
    jumlahKlik2: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    series: [{ name: 'Jumlah', data: [] }],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      title: { text: `News Analytics by Month (${new Date().getFullYear()})` },
      colors: ['#008FFB'],
    },
  });
  const [detailData, setDetailData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axios.get(`/analytics/news`, {
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
          title: { text: `News Analytics by Month (${selectedYear || year})` },
        },
      });
      setDetailData(data.detailData);
      setCounts(data.counts || {
        jumlahBerita: 0,
        jumlahPengakses: 0,
        tingkatKlik: 0,
        jumlahKlik1: 0,
        jumlahKlik2: 0,
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
    <div className="report-news-container">
      <div className="report-news-card">
        <div className="report-news-count-row">
          <div className="report-news-count-card"><span>Jumlah berita</span><span className="report-news-count">{counts.jumlahBerita}</span></div>
          <div className="report-news-count-card"><span>Jumlah pengakses</span><span className="report-news-count">{counts.jumlahPengakses}</span></div>
          <div className="report-news-count-card"><span>Tingkat klik</span><span className="report-news-count">{counts.tingkatKlik}%</span></div>
          <div className="report-news-count-card"><span>Jumlah klik</span><span className="report-news-count">{counts.jumlahKlik1}</span></div>
          <div className="report-news-count-card"><span>Jumlah klik per orang</span><span className="report-news-count">{counts.jumlahKlik2}</span></div>
        </div>
      </div>
      <div className="report-news-filter">
        <input
          type="number"
          placeholder="YYYY"
          min="2017"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="report-news-form-control report-news-me-2"
        />
        <button onClick={handleFilter} className="report-news-btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </div>
      <div className="report-news-card">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
      <div className="report-news-card">
        <h4 className="report-news-mb-5">List News</h4>
        <div className="report-news-detail-content">
          {detailData.map((item, index) => (
            <div key={index} className="report-news-detail-item">
              <span className="report-news-detail-name">{item.name}</span>
              <span className="report-news-detail-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsNews;