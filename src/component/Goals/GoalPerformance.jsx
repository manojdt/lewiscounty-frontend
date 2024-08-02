import React from 'react'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';

import CalenderIcon from '../../assets/icons/CalenderIcon.svg'

export default function GoalPerformance() {
    const uData = [50, 30, 70, 100, 90, 40, 20, 10, 50, 70, 65, 25];
    const xLabels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    return (
        <div style={{ border: '1px solid rgba(29, 91, 191, 1)', padding: '20px', borderRadius: '10px' }}>
            <div className='goal-title-container flex justify-between items-center'>
                <div className='flex gap-5 items-center '>
                    <p className='text-[18px] font-semibold'>Goals Overall Performance</p>
                </div>
                <div className='flex gap-8 items-center'>
                    <div className="relative flex gap-3 py-3 px-3"
                        style={{ border: '1px solid rgba(24, 40, 61, 0.25)', background: 'rgba(238, 245, 255, 1)', borderRadius: '3px' }}>
                        <img src={CalenderIcon} alt="CalenderIcon" />
                        <select className='focus:outline-none' style={{ background: 'rgba(238, 245, 255, 1)' }}>
                            <option>Month</option>
                            <option>Week</option>
                            <option>Day</option>
                        </select>
                    </div>
                </div>
            </div>

            <LineChart
                width={900}
                height={500}
                series={[{ data: uData, label: 'uv', area: true, showMark: false, color: '#1D5BBF', }]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                slotProps={{ legend: { hidden: true } }}
            // sx={{
            //     [`& .${lineElementClasses.root}`]: {
            //         display: 'none',
            //     },
            // }}
            />
        </div>
    )
}
