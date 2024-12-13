import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { Button } from '../../shared'

export const TestimonialView = () => {
    return (
        <Box className="!border !border-[#DBE0E5] rounded-[10px] m-[20px] p-[20px]">
            <Typography p={"20px 0px"}>Tesimonial Name</Typography>
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


            <Box className="!border !border-[#1D5BBF80] p-[20px] rounded-[3px]" mt={3}>
                <Typography className='!text-[#1D5BBF] !text-[14px]'>
                    Description: <span className='!text-[#18283D] !text-[14px]'>sdfsdfsfsdfsffsdf</span>
                </Typography>
            </Box>


            <Box className="bg-[#1D5BBF0D] rounded-[3px] border border-[#1D5BBF80]" mt={3}>
                <Typography className='px-[20px] py-[12px] border-b-2 border-[#1D5BBF80] !text-[#1D5BBF] !text-[16px]'>Title</Typography>
                <Typography className='px-[20px] py-[12px] !text-[#1D5BBF] !text-[16px]'>Title</Typography>
            </Box>


            <Stack direction="row" alignItems="center" justifyContent="center" width="100%" mt={3}>
                <Stack direction={"row"} alignItems={"center"} spacing={"20px"}>
                    <Button
                        btnType='button'
                        btnCategory='secondary'
                        btnName="Close"
                        btnCls='!border !border-[#18283D] !text-[#18283D]' />
                    <Button
                        btnType='button'
                        btnCategory='secondary'
                        btnName="Cancel"
                        btnCls='!border !border-[#FFE7E7] !text-[#E0382D] !bg-[#FFE7E7]' />
                    <Button
                        btnType='button'
                        btnCategory='primary'
                        btnName="Accept"
                        btnCls='' />
                </Stack>
            </Stack>
        </Box>
    )
}