import React, { useEffect, useState } from 'react';
import {
    DataGrid, gridPageCountSelector, GridPagination, gridPaginationModelSelector, useGridApiContext,
    useGridSelector, gridPageSelector, gridPageSizeSelector, gridPaginationSelector, gridPaginationMetaSelector,
} from '@mui/x-data-grid';
import { TablePagination } from "@mui/material";
import MuiPagination from '@mui/material/Pagination';
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CustomFooterPagination from './CustomFooterPagination';

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

const options = [5, 10, 20]
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


function Pagination(props) {
    console.log('Pga', props)
    const { page, onPageChange, className, count, rowsPerPage } = props
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const theme = useTheme();

    console.log('mxxxx', pageCount)

    // const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (
        event
    ) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
        event
    ) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
        event
    ) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
        </Box>
    );
}

function CustomPagination(props) {
    // console.log('nn', props)
    // return <div className='custom-pagination w-full relative'> <GridPagination ActionsComponent={TablePaginationActions} {...props} /></div>;
    return <div className='flex h-[90px] mx-2 custom-pagination w-full relative'> <TablePaginationActions {...props} /></div>;
}

function TablePaginationActions(props) {
    const theme = useTheme();
    const { onPageChange } = props;

    // console.log('propsuu', props)

    const apiRef = useGridApiContext();
    // const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
    // const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    // const pageselect = useGridSelector(apiRef, gridPageSelector);
    // const pagesize = useGridSelector(apiRef, gridPageSizeSelector);
    const paginationDetails = useGridSelector(apiRef, gridPaginationSelector);
    const meta = useGridSelector(apiRef, gridPaginationMetaSelector);



    // console.log('apiRef', apiRef)
    // console.log('sss', paginationDetails)
    // console.log('meta', meta)


    const handleBackButtonClick = (
        event
    ) => {
        // onPageChange(event, paginationDetails.paginationModel.page - 1);
        apiRef.current.setPage(paginationDetails.paginationModel.page - 1);
    };

    const handleNextButtonClick = (
        event
    ) => {
        // onPageChange(event, paginationDetails.paginationModel.page + 1);
        apiRef.current.setPage(paginationDetails.paginationModel.page + 1);
    };

    const handlePerPage = (event) => {
        // console.log(event.target.value)
        apiRef.current.setPageSize(event.target.value)
    }


    return (


        <div className='w-full flex items-center justify-between'>
            <div className={`flex ${paginationDetails.paginationModel.page >= 1 ? 'w-[60%]' : 'w-[55%]'} justify-between items-center`}>
                <div className='flex gap-2'>
                    <span>Shows</span>
                    <select style={{ margin: 0, border: '0.5px solid rgba(62, 62, 62, 1)' }} onChange={handlePerPage}>

                        {
                            options.map((option, index) =>
                                <option key={index} selected={option === paginationDetails.paginationModel.pageSize} value={option}>{option}</option>
                            )
                        }
                    </select>
                    <span>Entries</span>
                </div>
                <div className='flex gap-4'>
                    {
                        paginationDetails.paginationModel.page >= 1 &&

                        <button onClick={handleBackButtonClick}
                            // disabled={paginationDetails.paginationModel.page
                            //     <= Math.ceil(paginationDetails.rowCount / paginationDetails.paginationModel.pageSize) - 1}
                            className='text-white py-3 px-6 col-span-1'
                            style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px', width: '150px' }}>Previous Page</button>
                    }
                    {
                        paginationDetails.paginationModel.pageSize < paginationDetails.rowCount &&

                        <button onClick={handleNextButtonClick}
                            disabled={paginationDetails.paginationModel.page
                                >= Math.ceil(paginationDetails.rowCount / paginationDetails.paginationModel.pageSize) - 1}
                            className='text-white py-3 px-6 col-span-1'
                            style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px', width: '150px' }}>Next Page</button>
                    }

                </div>
            </div>
            <div className='flex items-center'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ border: '1px solid rgba(9, 19, 22, 1)', display: 'flex', width: '36px', height: '37px', justifyContent: 'center',
                         alignItems: 'center' }} >
                        {/* <input type="number" style={{width: '100%', height: '100%', padding: '12px'}} value={paginationDetails.paginationModel.page + 1} 
                        
                        /> */}
                         {paginationDetails.paginationModel.page + 1}</span> of
                    <span className='pl-1'>{Math.ceil(paginationDetails.rowCount / paginationDetails.paginationModel.pageSize)}</span></div>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={paginationDetails.paginationModel.page === 0}
                    aria-label="previous page"
                >
                    {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={paginationDetails.paginationModel.page
                        >= Math.ceil(paginationDetails.rowCount / paginationDetails.paginationModel.pageSize) - 1}
                    aria-label="next page"
                >
                    {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </IconButton>
            </div>
        </div>

    );
}


export default function DataTable({ rows, columns, footerAction, footerComponent, selectedAllRows = [],
    hideCheckbox = false, hideFooter = false, handleSelectedRow = undefined, height = 600 }) {
    // console.log('rows', rows)
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedIds, setSelectedIds] = useState([])


    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
    });

    const handleRowSelection = (ids) => {
        const selected = [...rows].filter(row => ids.includes(row.id))
        // console.log('se', selected)
        setSelectedIds(ids)
        setSelectedRows(selected)
        if (handleSelectedRow) handleSelectedRow(selected)
    }

    useEffect(() => {
        // console.log('selectedAllRowsselectedAllRows', selectedAllRows)
        const ids = []
        selectedAllRows.forEach(row => ids.push(row.id))
        // console.log('idsids', ids)
        setSelectedIds(ids)
    }, [])

    return (
        <div style={{ height: height, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                hideFooterPagination={hideFooter}
                getRowId={(row) => row.id || row.first_name}
                checkboxSelection={!hideCheckbox}
                onPageChange={(e) => console.log('change', e)}
                {
                ...footerComponent ?
                    {
                        slots: {
                            footer: footerComponent,
                        },
                        slotProps: {
                            footer: { footerAction, selectedRows },
                        }
                    }
                    :
                    {
                        initialState: {
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        },
                        slots: {
                            pagination: CustomPagination,
                            // footer: CustomPagination
                        },
                        pageSizeOptions: { options }
                        // component: CustomPagination
                        // slotProps: {
                        //     footer : {
                        //         onPageChange: (e) => console.log('change123', e)
                        //     }
                        //     pagination: {
                        //         // pagination: CustomPagination,
                        //         ActionsComponent: CustomPagination,
                        //         // labelRowsPerPage: "Shows",
                        //     },
                        // }
                    }
                // {
                //     slots: {
                //         pagination: CustomPagination,
                //     },
                // }
                }
                hideFooter={hideFooter}
                disableRowSelectionOnClick
                rowSelectionModel={selectedIds}
                onRowSelectionModelChange={(itm, i) => handleRowSelection(itm)}

            // slotProps={{
            //     pagination: {
            //         ActionsComponent: TablePaginationActions,
            //     },
            // }}
            // paginationModel={{ pageSize: 10 }}

            />
        </div>
    );
}