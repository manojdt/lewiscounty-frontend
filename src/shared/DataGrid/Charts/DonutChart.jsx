import React from "react";
import { Chart } from "react-google-charts";





const DonutChart = ({data = [],primaryColor='',secondaryColor = '',centeredData={}}) => {
    const colors =[primaryColor||"#1954A6",secondaryColor||"#FFC21D"];
    
    const options = {
        pieHole: 0.6, // Creates donut effect
        colors:colors, // Blue & Yellow
        legend: { position: "right", alignment: "center" },
        pieSliceText: "none", // Hides slice labels
        chartArea: { width: "100%", height: "100%" },
        fontName: "Arial",
        fontSize: 14,
      };
  return (
    <div style={{ position: "relative", width: "400px", height: "300px" }}>
      {/* Google Chart */}
      <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
      {/* Centered Label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "32%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontWeight: "bold",
          color: "#1D3557",
        }}
      >
        <div className="text-[15px]">{centeredData?.title}</div>
        <div style={{ fontSize: "30px" }}>{centeredData?.count}</div>
      </div>
    </div>
  );
};

export default DonutChart;