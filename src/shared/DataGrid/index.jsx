import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';



const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export function CustomFooterStatusComponent(props) {
    return (
        <div className='flex gap-6 justify-center items-center py-4'>
            <button onClick={props.footerAction} className='py-3 px-6 w-[16%]'
                style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
            <button onClick={props.footerAction} className='text-white py-3 px-6 w-[16%]'
                style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Mentees</button>
        </div>
    );
}

export default function DataTable({ rows, columns, footerAction, footerComponent, selectedAllRows = [], hideCheckbox = false, hideFooter = false }) {
    console.log('rows', rows)
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedIds, setSelectedIds] = useState([])

    const handleRowSelection = (ids) => {
        const selected = [...rows].filter(row => ids.includes(row.id))
        console.log('se', selected)
        setSelectedIds(ids)
        setSelectedRows(selected)
    }

    useEffect(() => {
        console.log('selectedAllRowsselectedAllRows', selectedAllRows)
        const ids = []
        selectedAllRows.forEach(row => ids.push(row.id))
        console.log('idsids', ids)
        setSelectedIds(ids)
    }, [])

    return (
        <div style={{ height: 600, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                hideFooterPagination={true}
                getRowId={(row) => row.id || row.first_name}
                checkboxSelection={!hideCheckbox}
                slots={{
                    footer: footerComponent,
                }}
                slotProps={{
                    footer: { footerAction, selectedRows },
                }}
                hideFooter={hideFooter}
                disableRowSelectionOnClick
                rowSelectionModel={selectedIds}
                onRowSelectionModelChange={(itm, i) => handleRowSelection(itm)}

            />
        </div>
    );
}