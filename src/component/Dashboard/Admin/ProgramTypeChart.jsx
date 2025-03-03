import React from "react";
import DonutChart from "../../../shared/DataGrid/Charts/DonutChart";


const ProgramTypeChart = ({programMetrics ={}}) => {
    const programType = programMetrics?.program_type;
    const freePrograms = programType?.free_programs;
    const premiumPrograms = programType?.premium_programs;
    
      const data = [
        ["Program Type", "Count"],
        ["Free", freePrograms],
        ["Premium", premiumPrograms],
      ];
      
     const primaryColor = '#1954BF';
     const secondaryColor = '#FFBB00'
     
      const centeredData = {
        title:'Total Programs',
        count:programType?.total_programs
      }
      const colors = [primaryColor,secondaryColor]
  return (
   <div>
    <div className="title flex justify-between py-3 px-4 border-b-2">
                <div className="flex gap-4">
                    <div
                        className="card-dash"
                        style={{
                            background: "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
                        }}
                    ></div>
                    <h4>Program Type Metrics</h4>
                </div>
                {/* {
                    <p
                        className="leading-8 cursor-pointer text-[12px] px-2"
                        style={{
                            background: "rgba(217, 228, 242, 1)",
                            color: "rgba(29, 91, 191, 1)",
                            borderRadius: "6px",
                        }}
                       
                    >
                       Month
                    </p>
                } */}
            </div>
            <div className="flex items-center justify-center">
            <DonutChart data={data} colors={colors} centeredData={centeredData}/>
            </div>
            
   </div>
  );
};

export default ProgramTypeChart;
