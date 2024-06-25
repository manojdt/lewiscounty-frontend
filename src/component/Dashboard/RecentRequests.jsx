import React from 'react'
import MoreIcon from '../../assets/icons/moreIcon.svg'
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'
import { recentRequest } from '../../utils/mock'

export default function RecentRequests() {
    return (
        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                    <h4>Recent Requests</h4>
                </div>
                <p className="text-[12px] cursor-pointer"><img src={MoreIcon} alt="MoreIcon" /></p>
            </div>
            <div className="content flex gap-4 py-5 px-5 overflow-x-auto">
                {
                    recentRequest.map((recentRequest, index) =>
                        <div key={index} className="lg:w-5/12 md:w-1/3 py-3 px-3" style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px' }}>
                            <div className="flex gap-2 pb-3" style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                <div className="w-1/4"> <img src={index %2 === 0 ? MaleIcon : FemaleIcon} alt="male-icon" /> </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-[14px]">{recentRequest.name}</p>
                                    <p className="text-[12px]">{recentRequest.type}</p>
                                </div>
                                <div className="pt-1 cursor-pointer" style={{ marginLeft: 'auto' }}><img src={MoreIcon} alt="MoreIcon" /></div>
                            </div>
                            <div className="flex gap-3 pt-3">
                                <div className="flex items-center gap-1">
                                    <span className="lg:w-2 lg:h-2  rounded-full" style={{ background: 'rgba(29, 91, 191, 1)' }}></span>
                                    <span className="lg:text-[10px]">Attended({recentRequest.attended})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="lg:w-2 lg:h-2  rounded-full" style={{ background: 'rgba(0, 174, 189, 1)' }}></span>
                                    <span className="lg:text-[10px]">Completed({recentRequest.completed})</span>
                                </div>
                            </div>
                        </div>

                    )
                }
            </div>
        </div>
    )
}
