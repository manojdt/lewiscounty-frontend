import React from 'react'
import { useSelector } from 'react-redux'

export default function CardWrapper({ title = '', viewAll, timeFilter, handleViewAll, handleTimeFilter, icon, children }) {

    const userInfo = useSelector(state => state.userInfo)
    const role = userInfo.data.role

    const handleView = () => {
        handleViewAll && handleViewAll()
    }

    const handleDropdown = () => {
        handleTimeFilter && handleTimeFilter()
    }

    return (
        <div className='main-program' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px', height: role === 'admin' ? '350px':role==='mentee'?'528px': 'auto' }}>
            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                    <h4 className='text-sm max-lg:text-[12px]'>{title}</h4>
                    {icon && <img src={icon} alt="image" />}
                </div>
                {
                    viewAll &&
                    <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                        background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                    }}
                        onClick={handleView}
                    >View All</p>
                }
                {
                    timeFilter &&

                    <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                        background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                    }}>
                        <select className='focus:outline-none' style={{ background: 'rgba(217, 228, 242, 1)', border: 'none' }} onChange={handleDropdown}>
                            {
                                timeFilter.map(time =>
                                    <option key={time.value} value={time.value}>{time.name}</option>
                                )
                            }
                        </select>

                    </p>
                }
            </div>
            {children}
        </div>
    )
}
