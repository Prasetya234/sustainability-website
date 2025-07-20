import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const ChartMenu = ({dataChart, categories, types}) => {

    const options = useMemo(() => {
        
    return {
         chart: {
                height: 450,
                type: 'radar',
              },
              title: {
                text: 'Statistik Fungsi'
              },
              yaxis: {
                stepSize: 20
              },
              xaxis: {
                categories: dataChart.categories,
              }
            }
    },[dataChart]);


  return (
    <div style={{ zoom: '110%' }}>
      <Chart options={options} series={dataChart.series} type="radar" height={450} />
    </div>
  )
}

export default ChartMenu