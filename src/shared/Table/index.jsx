import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'professional', label: 'Professional', minWidth: 100 },
    {
        id: 'contact',
        label: 'Contact',
        minWidth: 100,
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 100,
    },
    {
        id: 'location',
        label: 'Location',
        minWidth: 100,
    },
    { id: 'test2', label: 'Attended Programs', minWidth: 100 },

    { id: 'test1', label: 'Last Attend Program', minWidth: 100 },

];

function createData(name, professional, contact, email, location, test2, test1) {
    return { name, professional, contact, email, location, test2, test1 };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263, 3287263, 3287263, 3287263),
    createData('Italy', 'IT', 60483973, 301340, 3287263, 3287263, 3287263),
    createData('United States', 'US', 327167434, 9833520, 3287263, 3287263, 3287263),
    createData('Canada', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
];

export default function MuiTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, background: 'rgba(217, 228, 242, 1)' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}