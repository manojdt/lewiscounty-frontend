import React from 'react'
import DataTable from '../../../shared/DataGrid'
import { Backdrop, Checkbox } from '@mui/material'
import SearchIcon from "../../../assets/icons/search.svg";

export const SelectMentor = () => {

    const [search, setSearch] = React.useState("")
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
    });

    const selectedMenteeColumns = [
        {
            field: "checkbox",
            headerName: "",
            flex: 1,
            id: 0,
            renderCell: (params) => {
                return (
                    <Checkbox checked={true} onChange={() => console.log("abcd")} />
                )
            }
        },
        {
            field: "full_name",
            headerName: "Name",
            flex: 1,
            id: 0,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 1,
            id: 0,
        },
        {
            field: "phone_no",
            headerName: "Phone Number",
            flex: 1,
            id: 0,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            id: 0,
        },
    ]

    const handleSearch = (searchText) => {
        setSearch(searchText)
    }

    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <div className="py-3 px-4 bg-white" style={{ borderRadius: "3px" }}>
                <div className="flex justify-end px-3 mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            id="search-navbar"
                            className="block w-full p-2 text-sm text-gray-900 border-none bg-background-primary-light"
                            placeholder="Search here..."
                            style={{
                                border: "none",
                                borderRadius: "5px",
                                height: "50px",
                                width: "100%",
                            }}
                        />
                        <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                            <img src={SearchIcon} alt="SearchIcon" />
                        </div>
                    </div>
                </div>
                <DataTable
                    rows={[]}
                    columns={selectedMenteeColumns}
                    hideCheckbox
                    hideFooter
                    height={450}
                    paginationModel={paginationModel}
                    setPaginationModel={setPaginationModel} />
            </div>

        </Backdrop>
    )
}