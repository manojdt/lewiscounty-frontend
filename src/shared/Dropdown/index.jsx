import React, { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function Dropdown({ label, options, handleDropdown, value = '' }) {
    const [dropdownValue, setDropdownValue] = useState('');
    const handleChange = (event) => {
        handleDropdown(event)
        setDropdownValue(event.target.value);
    };

    useEffect(() => {
        setDropdownValue(value)
    },[])

    return (
        <div>
            <FormControl sx={{ m: 1, width: 150, mt: 1 }} size='small' style={{
                background: 'linear-gradient(93.13deg, #00B1C0 -3.05%, #005DC6 93.49%)',
                borderRadius: '3px', border: 'none',
                width:'180px'
            }}>
                <Select
                    value={dropdownValue}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    style={{ color: '#fff', fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: '14px' }}
                >
                    {
                        options.map(option => <MenuItem value={option.value} selected={value === option.value}>{option.name}</MenuItem>)
                    }
                </Select>
            </FormControl>

        </div>
    )
}
