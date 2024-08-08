import React, { useState } from 'react'
import Card from '../../../shared/Card'
import { requestOverview } from '../../../utils/constant'
import SearchIcon from '../../../assets/icons/search.svg';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import DataTable from '../../../shared/DataGrid';
import { programRequestColumns, programRequestData } from '../../../mock';

export default function ProgramRequest() {
    const [actionTab, setActiveTab] = useState('all')
    const programRequestTab = [
        {
            name: 'All',
            key: 'all'
        },
        {
            name: 'New Program',
            key: 'new'
        },
        {
            name: 'Program Deactivated',
            key: 'deactivate'
        },
        {
            name: 'Program Abort',
            key: 'abort'
        },
        {
            name: 'Program Reschedule',
            key: 'reschedule'
        }
    ]

    return (
        <div className="program-request px-8 mt-10">
            <div className="grid grid-cols-5 gap-3">
                <div className="row-span-3 flex flex-col gap-8">
                    <Card cardTitle={'Request Overview'} cardContent={requestOverview} />
                </div>


                <div className="col-span-4">
                    <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                            <div className="flex gap-4">
                                Program Requests
                            </div>
                            <div className="flex gap-20 items-center">
                                <img src={SearchIcon} alt="statistics" />

                                <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>
                                    <img src={CalendarIcon} alt="CalendarIcon" />
                                    <select className='focus:outline-none' style={{ background: 'rgba(223, 237, 255, 1)', border: 'none' }}>
                                        <option>Day</option>
                                        <option>Month</option>
                                    </select>
                                </p>
                            </div>

                        </div>


                        <div className='px-6 py-7 program-info'>

                            <div className='flex justify-between px-5 mb-8 items-center border-b-2 '>
                                <ul className='tab-list'>
                                    {
                                        programRequestTab.map((discussion, index) =>
                                            <li className={`${actionTab === discussion.key ? 'active' : ''} relative`} key={index}
                                                onClick={() => setActiveTab(discussion.key)}
                                            >
                                                <div className='flex justify-center pb-3'>
                                                    <div className={`total-proram-count ${actionTab === discussion.key ? 'active' : ''}`}>10</div>
                                                </div>
                                               <div> {`${discussion.name}`}</div>
                                                {actionTab === discussion.key && <span></span>}
                                            </li>)
                                    }
                                </ul>


                            </div>
                            <DataTable rows={programRequestData} columns={programRequestColumns} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
