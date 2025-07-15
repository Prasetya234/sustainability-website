import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const ChartUserAnalis = ({dataChart, categories, types}) => {

    const options = useMemo(() => {
        
    return {
              chart: {
                height: 350,
                type: 'line',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: true
              },
              stroke: {
                curve: 'straight'
              },
              title: {
                text: 'Pengguna Aktif',
                align: 'left'
              },
              grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              xaxis: {
                categories: dataChart.categories,
              }
            }
    },[dataChart]);


  return (
    <div style={{ zoom: '110%' }}>
      <Chart options={options} series={dataChart.series} type="line" height={350} />
    </div>
  )
}

export default ChartUserAnalis