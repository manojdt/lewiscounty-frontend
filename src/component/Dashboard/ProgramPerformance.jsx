import React from 'react'
import { PieChart } from 'react-minimal-pie-chart';
import ExpandeIcon from '../../assets/icons/Expand.svg';

export default function ProgramPerformance() {
    return (
        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                    <h4>Program Performance</h4>
                    <img className='cursor-pointer' src={ExpandeIcon} alt="statistics" />
                </div>
                <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                    background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                }}>
                    <select className='focus:outline-none' style={{ background: 'rgba(217, 228, 242, 1)', border: 'none' }}>
                        <option>Day</option>
                        <option>Month</option>
                    </select>

                </p>


            </div>
            <div className='h-[450px] py-9'>
                <PieChart
                    data={[
                        { title: 'One', value: 10, color: '#E38627' },
                        { title: 'Two', value: 15, color: '#C13C37' },
                        { title: 'Three', value: 20, color: '#6A2135' },
                    ]}
                />
            </div>
        </div>
    )
}
