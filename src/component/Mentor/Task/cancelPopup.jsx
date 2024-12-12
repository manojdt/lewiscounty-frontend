import React from 'react'
import MuiModal from '../../../shared/Modal'
import { Box, Divider, Stack, Typography } from '@mui/material'
import CancelIcon from '../../../assets/icons/blueCloseIcon.svg'
import { Button } from '../../../shared'
export const CancelPopup = ({
    open = false,
    handleClosePopup = () => false,
    handleSubmit = () => false,
    header = ""
}) => {

    const [reason, setReason] = React.useState("")
    return (
        <MuiModal modalSize='md' modalOpen={open} modalClose={handleClosePopup} noheader>
            <Box className="!border !border-[#1D5BBF] rounded-[5px]">
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} p={"24px"}>
                    <Typography className='!text-[#18283D] !text-[18px]' fontWeight={600}>
                        {header}
                    </Typography>
                    <img className='cursor-pointer h-[25px] w-[25px]' onClick={handleClosePopup} src={CancelIcon} alt="CancelIcon" />
                </Stack>
                <Box sx={{ borderBottom: "1px solid #1D5BBF", margin: "0px 8px" }}></Box>
                <Box p={"40px 24px"}>
                    <Typography className='!text-[#18283D] !text-[14px]' mb={1}>Cancel Reason</Typography>
                    <textarea
                        id='message'
                        rows='4'
                        className={'!border !border-[#E50027] w-[100%] !text-[#18283D] h-[200px]'}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                </Box>

                <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"20px"} mb={"20px"}>
                    <Button
                        btnName='Cancel'
                        btnCategory='secondary'
                        onClick={handleClosePopup}
                        btnCls='w-[auto] !border !border-[#18283D] rounded-[3px] !text-[#18283D] h-[45px]'
                    />
                    <Button
                        btnType='button'
                        btnCls='w-[110px] h-[45px] !bg-[#E50027] !text-[#FFFFFF] !border !border-[#E50027]'
                        btnName={'Submit'}
                        btnCategory='secondary'
                        onClick={() => handleSubmit(reason)}
                    />
                </Stack>
            </Box>
        </MuiModal>
    )
}