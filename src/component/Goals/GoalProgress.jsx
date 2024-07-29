import React, { useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart';

export default function GoalProgress() {
    const [hovered, setHovered] = useState(undefined);
    const data =
        [
            { title: 'Supporting Personal Growth', value: 30, color: 'rgba(0, 174, 189, 1)' },
            { title: 'Networking and Career Development', value: 25, color: 'rgba(29, 91, 191, 1)' },
            { title: 'Fostering Leadership Skills', value: 17, color: 'rgba(229, 96, 49, 1)' },
            { title: 'Lorem ipsum dolor', value: 15, color: 'rgba(80, 105, 146, 1)' },
            { title: 'Lorem ipsum dolor', value: 13, color: 'rgba(160, 217, 180, 1)' },
        ];

    const updateddata = data.map((entry, i) => {
        if (hovered === i) {
            return {
                ...entry,
                color: 'grey',
                opacity: 0.4
            };
        }
        return entry;
    });

    return (
        <div className='goal-progress' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', marginBottom: '50px' }}>
            <div className='goal-title-container flex justify-between items-center mb-5'>
                <div className='flex gap-5 items-center '>
                    <p className='text-[18px] font-semibold'>Goals Progress</p>
                </div>

            </div>
            <div className='goal-chart' style={{ padding: '10px 30px 20px' }} >
                <PieChart
                    data={updateddata}
                    animate
                    animationDuration={1000}
                    labelStyle={{
                        fontWeight: 700,
                        fontSize: "6px",
                        fill: "#fff"
                    }}

                    labelPosition={70}
                    lineWidth={80}
                    label={({ dataEntry }) => {
                        // if (dataEntry.title === "Completed") {
                        //     return "48,560";
                        // }
                        return dataEntry.value + "%"
                    }}

                    onMouseOver={(_, index) => {
                        setHovered(index);
                    }}
                    onMouseOut={() => {
                        setHovered(undefined);
                    }}
                    viewBoxSize={[100, 100]}

                    startAngle={100}
                />
                <div>
                    <ul className='leading-10'>
                        {
                            data.map((data, index) =>
                                <li className='element-block' style={{ color: 'rgba(24, 40, 61, 1)' }} key={index}
                                    onMouseOver={() => {
                                        setHovered(index);
                                    }}
                                    onMouseOut={() => {
                                        setHovered(undefined);
                                    }}
                                >
                                    <span className='item-highlight' style={{
                                        background: data.color,
                                    }}></span>
                                    <span className='progress-title'>{data.title}</span>
                                </li>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
