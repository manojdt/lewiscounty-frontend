import React, { useEffect, useState } from 'react'
import { Chart } from 'primereact/chart';

export default function ProgramMetrix() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Number of Programs',
                    backgroundColor: 'rgba(29, 91, 191, 1)',
                    borderColor: 'rgba(29, 91, 191, 1)',
                    data: [65, 59, 80, 81, 56, 55, 40, 10, 90, 60, 20,70]
                },
                {
                    label: 'Active Programs',
                    backgroundColor: 'rgba(0, 174, 189, 1)',
                    borderColor: 'rgba(0, 174, 189, 1)',
                    data: [28, 48, 40, 19, 86, 27, 90, 20, 80, 50, 30, 60]
                },
                {
                    label: 'Joined Member',
                    backgroundColor: 'rgba(199, 222, 255, 1)',
                    borderColor: 'rgba(199, 222, 255, 1)',
                    data: [40, 48, 40, 19, 86, 27, 90, 30, 70, 40, 60, 10]
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);
    return (
        <div className="card px-8 py-6">
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    )
}
