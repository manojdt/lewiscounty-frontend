import React from 'react'
import { recentActivities } from '../../utils/mock'

export default function RecentActivities() {
    console.log(window.innerWidth);
    return (
        <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            <div className="title flex justify-between py-3 px-4 border-b-2">
                <h4 className="text-base">Recent Activities</h4>
                <p className="text-sm leading-8">View All</p>
            </div>


            <div className="flex items-center flex-col justify-center w-max py-4 px-4">
                {
                    recentActivities.map((recentActivity, index) =>
                        <div className="flex items-center flex-col relative" key={index}>
                            <div className="absolute top-0 left-full ml-4 w-max">
                                <p className="text-[14px]">{recentActivity.name}</p>
                                <h6 className="text-[10px]" style={{ color: recentActivity.color }}>{recentActivity.status}</h6>
                            </div>
                            <div className="absolute lg:right-[-227px] md:right-[-227px] text-[10px]">10 mins ago</div>
                            <div
                                className="w-8 h-3  mx-[-1px]  flex items-center justify-center">
                                <span className="w-3 h-3  rounded-full" style={{ background: recentActivity.color }}></span>
                            </div>
                            <div className="w-1 h-16 " style={{ background: 'rgba(0, 174, 189, 1)' }}></div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
