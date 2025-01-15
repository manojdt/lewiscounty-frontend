import { Backdrop, Box } from '@mui/material'
import React from 'react'

export const CustomModal = ({
    open = false,
    handleClose = () => false,
    content = "",
    width = "sm"
}) => {
    const widthList = {
        sm: "400px",
        md: "600px",
        lg: "800px"
    }

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
            onClick={handleClose}
        >
            <Box sx={{ width: widthList[width], background: "#fff", borderRadius: "10px" }}>
                {content}
            </Box>
        </Backdrop>
    )
}