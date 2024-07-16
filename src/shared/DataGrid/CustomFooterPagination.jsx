import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { gridPageCountSelector, gridPaginationModelSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';

const CustomFooterPagination = (props) => {
    console.log('ooo', props)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalItems, setTotalItems] = React.useState(0); // Total number of items in your data

    const apiRef = useGridApiContext();
    const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    console.log('apiRef', apiRef)

    console.log('pageCount---', pageCount)
    console.log('paginationModel---', paginationModel)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        // Fetch data for new page if needed
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        // Fetch data for new page size if needed
    };

    return (
        <>{ props.ActionsComponent() }</>
        // <TablePagination
        //     rowsPerPageOptions={[5, 10, 25]} // Customize as needed
        //     component="div"
        //     count={totalItems}
        //     rowsPerPage={rowsPerPage}
        //     page={page}
        //     onPageChange={handleChangePage}
        //     onRowsPerPageChange={handleChangeRowsPerPage}
        // />
    );
};

export default CustomFooterPagination;
