import { Backdrop, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable from '../../shared/DataGrid'
import { allMembersColumns, allMembersolumns } from '../../mock'

const Members = () => {

  const [actionTab, setActiveTab] = useState('mentor')
  const [activeTableDetails, setActiveTableDetails] = useState({ column: [], data: [] })

  let membersTab = [
    {
      name: 'Mentor',
      key: 'mentor'
    },
    {
      name: 'Mentee',
      key: 'mentee'
    },
  ]

  const handleTab = (key) => {
    setActiveTab(key)
  }

  useEffect(() => {
    const columns = allMembersColumns.filter(col => col.for.includes(actionTab))
    setActiveTableDetails({ ...activeTableDetails, column: columns })
  }, [actionTab])

  return (
    <div className="program-request px-8 mt-10">
      <div className="col-span-4">
        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
          <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
            <div className="flex gap-4" style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600 }}>
              Members
            </div>
          </div>


          <div className='px-6 py-7 program-info'>
            {
              membersTab.length ?
                <div className='flex justify-between px-5 mb-8 items-center border-b-2 '>
                  <ul className='tab-list'>
                    {
                      membersTab.map((discussion, index) =>
                        <li className={`${actionTab === discussion.key ? 'active' : ''} relative`} key={index}
                          onClick={() => handleTab(discussion.key)}
                        >
                          <div className='flex justify-center pb-1'>
                            <div className={`total-proram-count relative ${actionTab === discussion.key ? 'active' : ''}`}>10

                              <p className='notify-icon'></p>
                            </div>
                          </div>
                          <div className='text-[13px]'> {`${discussion.name}`}</div>
                          {actionTab === discussion.key && <span></span>}
                        </li>)
                    }
                  </ul>
                </div>

                : null
            }

            <Backdrop
              sx={{ zIndex: (theme) => 999999999 }}
              open={false}
            >
              <CircularProgress color="inherit" />

            </Backdrop>

            <DataTable rows={[]} columns={activeTableDetails.column} hideFooter />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Members;
