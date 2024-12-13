import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

export const TestimonialView = () => {
    return (
        <Box>
            <Typography>Tesimonial Name</Typography>
            <Divider></Divider>

            <div className="relative flex gap-6 justify-between">
                <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody style={{ border: '1px solid rgba(0, 174, 189, 1)' }}>
                        <tr className="bg-white border-b">
                            <th scope="row" style={{ border: '1px solid rgba(0, 174, 189, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                Category
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                
                            </td>
                        </tr>
                        <tr className="bg-white border-b">
                            <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                Program Name
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                
                            </td>
                        </tr>
                        <tr className="bg-white border-b">
                            <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                Program Creator
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                Admin
                            </td>
                        </tr>
                        <tr className="bg-white border-b">
                            <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                Mentor Name
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                
                            </td>
                        </tr>

                    </tbody>
                </table>

                <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                        <tr className="bg-white border-b">
                            <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                Program Start Date and Time
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                
                            </td>
                        </tr>
                        <tr className="bg-white border-b">
                            <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                Program End Date and Time
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                
                            </td>
                        </tr>
                        <tr className="bg-white border-b">
                            <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                Participated Mentees
                            </th>
                            <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                testimonialView Member
                            </td>
                        </tr>


                    </tbody>
                </table>
            </div>


            <Box className="!border !border-[#1D5BBF80] p-[20px] rounded-[3px]">
                <Typography className='!text-[#1D5BBF] !text-[14px]'>
                    Description: <span className='!text-[#18283D] !text-[14px]'>sdfsdfsfsdfsffsdf</span>
                </Typography>
            </Box>


            <Box className="bg-[#1D5BBF0D] rounded-[3px] border border-[#1D5BBF80]">
                <Typography className='px-[20px] py-[12px] border-b-2 border-[#1D5BBF80] !text-[#1D5BBF] !text-[16px]'>Title</Typography>
                <Typography className='px-[20px] py-[12px] !text-[#1D5BBF] !text-[16px]'>Title</Typography>
            </Box>
        </Box>
    )
}