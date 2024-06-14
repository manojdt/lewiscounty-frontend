import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function Dropdown() {
    const [age, setAge] = useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <div>
            <FormControl  sx={{ m: 1, width: 150, mt: 1 }} size='small' style={{
                background: 'linear-gradient(93.13deg, #00B1C0 -3.05%, #005DC6 93.49%)',
                borderRadius: '3px', border: 'none'
            }}>
                <Select
                    value={age}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    style={{ color: '#fff', fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: '14px' }}
                >
                    <MenuItem value="">
                        All Mentees
                    </MenuItem>
                    <MenuItem value={10}>Mentee 1</MenuItem>
                    <MenuItem value={20}>Mentee 3</MenuItem>
                    <MenuItem value={30}>Mentee 3</MenuItem>
                </Select>
            </FormControl>

        </div>
    )
}
