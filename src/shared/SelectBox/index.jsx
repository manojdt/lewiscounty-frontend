import { MenuItem, Select } from '@mui/material'
import React from 'react'
import ArrowDown from "../../assets/icons/menuDownIcon.svg"

export const SelectBox = ({
    value = "",
    handleChange = () => false,
    menuList = []
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            sx={{
                height: "40px",
                border: "1px solid #1D5BBF",
                color: "#FFFFFF",
                minWidth: "100px",
                background: "#1D5BBF",
                paddingRight: "12px",
                "& .MuiSelect-select": {
                    fontSize: "14px"
                },

            }}

            onOpen={handleOpen}
            onClose={handleClose} 
            IconComponent={(props) =>
                <img src={ArrowDown} alt='ArrowUp' style={{ transform: isOpen ? "rotate(180deg)" : "", cursor: "pointer" }} />
            }
        >
            {
                menuList?.map((e) => {
                    return (
                        <MenuItem value={e?.value} sx={{
                            "&.Mui-selected": {
                                background: "#EEF5FF",
                                color: "#1D5BBF",
                                fontSize: "14px",
                                fontWeight: 500
                            },
                            background: "#FFF",
                            color: "#18283D",
                            fontSize: "14px",
                        }}>{e?.label}</MenuItem>
                    )
                })
            }
        </Select>
    )
}