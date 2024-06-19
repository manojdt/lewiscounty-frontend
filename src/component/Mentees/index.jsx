import React from 'react'
import MuiTable from '../../shared/Table'
import FilterIcon from '../../assets/icons/Filter.svg';

import Dropdown from '../../shared/Dropdown';
import { menteeColumns, menteeMoreMenu, menteeRows } from '../../mock';

export const Mentees = () => {


    return (
        <div className="px-9 py-9">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center '>
                        <p>My Mentees</p>
                        <p><img src={FilterIcon} alt="FilterIcon" /></p>
                    </div>
                    <div className='flex gap-8 items-center'>
                        <div className="relative">
                            <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                placeholder="Search..." style={{
                                    backgroundColor: '#F5F9FF', border: '1px solid rgba(29, 91, 191, 1)',
                                    height: '41px',
                                    width: '345px'
                                }} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                        </div>
                        <Dropdown />
                    </div>
                </div>
                <div className='mx-5'>
                    <MuiTable
                        columns={menteeColumns}
                        data={menteeRows}
                        actionMenu={menteeMoreMenu}
                    />
                </div>
            </div>
        </div>
    )
}

