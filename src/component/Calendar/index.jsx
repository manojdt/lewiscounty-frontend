import React, { useState } from 'react'
import InlineCalendar from '../../shared/Calendar/InlineCalendar'
import './calendar.css'

export default function Calendar() {
  const [actionActionBtn, setActionActionBtn] = useState('upcoming_schedule')
  const calendarEvents = [
    {
      name: 'Add  New  Schedule',
      key: 'add_schedule',
    },
    {
      name: 'Upcoming Schedule',
      key: 'upcoming_schedule',
    },
    {
      name: 'Reschedule',
      key: 'reschedule',
    },
    {
      name: 'Completed',
      key: 'completed',
    },
  ]
  return (
    <div className="calendar-container px-9 py-9">
      <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
        <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                Calendar
              </a>
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
              </svg>
            </li>
            <li>
              <div className="flex items-center">
                <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                  Upcoming Schedule </a>
              </div>
            </li>
          </ol>
        </nav>


        <div className="grid grid-cols-4 gap-7 py-5">
          <div className='left-container col-span-1'>

            <div className="my-program-list pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-7 px-7">
                <h4 className="text-base" style={{ color: 'rgba(24, 40, 61, 1)' }}>My program list</h4>
              </div>
              <div className='flex gap-5 flex-col justify-center items-center'>
                {
                  calendarEvents.map((calendarevent, index) =>
                    <button key={index} className={`action-btn ${actionActionBtn === calendarevent.key ? 'active' : ''}`} onClick={() => setActionActionBtn(calendarevent.key)}>
                      {calendarevent.name}
                    </button>
                  )
                }
              </div>
            </div>

            <div className="events-calendar pb-3 px-2" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                <InlineCalendar />
            </div>

          </div>

          <div className="col-span-2"></div>
        </div>
      </div>







    </div>
  )
}
