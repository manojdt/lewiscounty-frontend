import React, { useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiContext,
  useGridSelector,
  gridPaginationSelector,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import { Avatar } from "@mui/material";
import SearchIcon from "../../assets/images/search1x.png";
import no_data_image from "../../assets/icons/no-data-2.svg";

const StyledSearchInput = styled(GridToolbarQuickFilter)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(0.5, 2),
  "& .MuiSvgIcon-root": {
    display: "none",
  },
}));

const options = [5, 10, 20];
export function CustomFooterStatusComponent(props) {
  return (
    <div className="flex gap-6 justify-center items-center py-4">
      <button
        onClick={props.footerAction}
        className="py-3 px-6 w-[16%]"
        style={{
          border: "1px solid rgba(29, 91, 191, 1)",
          borderRadius: "3px",
          color: "rgba(29, 91, 191, 1)",
        }}
      >
        Cancel
      </button>
      <button
        onClick={props.footerAction}
        className="text-white py-3 px-6 w-[16%]"
        style={{
          background:
            "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
          borderRadius: "3px",
        }}
      >
        Add Mentees
      </button>
    </div>
  );
}

function CustomToolbar(props) {
  const { toolBarComponent } = props;
  return (
    <GridToolbarContainer className="flex flex-col md:flex-row justify-between my-4 mx-2 sticky top-0 z-50">
      <div className="border rounded-sm bg-white w-full md:w-80">
        <StyledSearchInput
          fullWidth
          InputProps={{
            fullWidth: true,
            disableUnderline: true,
            endAdornment: (
              <Avatar
                sx={{ width: 15, height: 15 }}
                src={SearchIcon}
                alt={"search_icon"}
              />
            ),
          }}
          quickFilterParser={(searchInput) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
        />
      </div>
      <div className="mt-4 md:mt-0">{toolBarComponent}</div>
    </GridToolbarContainer>
  );
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { onPageChange } = props;
  const apiRef = useGridApiContext();
  const paginationDetails = useGridSelector(apiRef, gridPaginationSelector);

  const handleBackButtonClick = () => {
    // apiRef.current.setPage(props.paginationModel.page - 1);
    // apiRef.current.setPageSize(props.paginationModel.pageSize)

    props?.setPaginationModel({
      ...props?.paginationModel,
      page: props.paginationModel.page - 1,
      pageSize: props.paginationModel.pageSize,
    });
    // props?.getPageDetails(props.paginationModel.page - 1, props.paginationModel.pageSize)
  };

  const handleNextButtonClick = () => {
    // apiRef.current.setPage(props.paginationModel.page + 1);
    // apiRef.current.setPageSize(props.paginationModel.pageSize)
    props?.setPaginationModel({
      ...props?.paginationModel,
      page: props.paginationModel.page + 1,
      pageSize: props.paginationModel.pageSize,
    });
    // props?.getPageDetails(props.paginationModel.page + 1, props.paginationModel.pageSize)
  };

  const handlePerPage = (event) => {
    props?.setPaginationModel({
      ...props?.paginationModel,
      pageSize: Number(event.target.value),
      page: 0,
    });
    // apiRef.current.setPageSize(Number(event.target.value))
    // props?.getPageDetails(props.paginationModel.page + 1, Number(event.target.value))
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div
        className={`flex ${
          paginationDetails.paginationModel.page >= 1 ? "w-[60%]" : "w-[55%]"
        } justify-between items-center`}
      >
        <div className="flex gap-2">
          <span className="text-xs md:text-base">Shows</span>
          <select
            style={{ margin: 0, border: "0.5px solid rgba(62, 62, 62, 1)" }}
            onChange={handlePerPage}
          >
            {options.map((option, index) => (
              <option
                key={index}
                selected={option === props.paginationModel.pageSize}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
          <span className="text-xs md:text-base">Entries</span>
        </div>
        {/* <div className="flex gap-4">
          {props?.paginationModel?.page >= 1 && (
            <button
              onClick={handleBackButtonClick}
              // disabled={paginationDetails.paginationModel.page
              //     <= Math.ceil(paginationDetails.rowCount / paginationDetails.paginationModel.pageSize) - 1}
              className="text-white py-3 px-6 col-span-1 hidden lg:block"
              style={{
                border: "1px solid rgba(0, 0, 0, 1)",
                borderRadius: "3px",
                width: "150px",
                color: "rgba(0, 0, 0, 1)",
              }}
            >
              Previous Page
            </button>
          )}
          {props?.paginationModel?.pageSize < paginationDetails.rowCount && (
            <button
              onClick={handleNextButtonClick}
              disabled={
                props?.paginationModel?.page >=
                Math.ceil(
                  paginationDetails.rowCount / props?.paginationModel?.pageSize
                ) -
                  1
              }
              className="text-white py-3 px-6 col-span-1 hidden lg:block"
              style={{
                background:
                  "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
                borderRadius: "3px",
                width: "150px",
              }}
            >
              Next Page
            </button>
          )}
        </div> */}
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs md:text-base">
            {props?.paginationModel?.page !== undefined
              ? props.paginationModel.page + 1
              : 1}
          </span>
          of
          <span className="text-xs md:text-base">
            {paginationDetails?.rowCount && props?.paginationModel?.pageSize
              ? Math.ceil(
                  paginationDetails.rowCount / props.paginationModel.pageSize
                )
              : 1}
          </span>
        </div>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={props?.paginationModel.page === 0}
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
          disabled={
            props?.paginationModel.page >=
            Math.ceil(
              paginationDetails.rowCount / props?.paginationModel.pageSize
            ) -
              1
          }
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

export default function DataTable({
  rows = [],
  columns,
  footerAction,
  footerComponent,
  selectedAllRows = [],
  showToolbar = false,
  hideCheckbox = false,
  hideFooter = false,
  handleSelectedRow = undefined,
  height = 670, // Default fixed height
  getPageDetails = () => false,
  rowCount = 0,
  setPaginationModel = () => false,
  paginationModel = "",
  disableMultipleSelection,
  toolBarComponent,
  ...restOfProps
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleRowSelection = (ids) => {
    const selected = [...rows].filter((row) =>
      ids.includes(row.id || row.categories_id)
    );
    setSelectedIds(ids);
    setSelectedRows(selected);
    if (handleSelectedRow) handleSelectedRow(selected);
  };

  useEffect(() => {
    const ids = [];
    selectedAllRows.forEach((row) => ids.push(row.id));
    setSelectedIds(ids);
  }, []);

  function CustomPagination(props) {
    return (
      <div className="flex h-[90px] mx-2 custom-pagination w-full relative">
        <TablePaginationActions
          {...props}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getPageDetails={getPageDetails}
        />
      </div>
    );
  }
  const NoDataImage = () => (
    <img src={no_data_image} className="mx-auto mt-5" alt="no-data-image" />
  );
  return (
    <div
      // className="w-full"
      style={{ height: height, maxHeight: height, position: "relative" }}
    >
      {/* <div className="w-full  lg:min-w-0 h-full"> */}
      <DataGrid
        rows={rows}
        columns={columns.map((col) => ({
          ...col,
          flex: 1, // Ensures columns expand proportionally
          minWidth: 150, // Sets a minimum width for each column
        }))}
        hideFooterPagination={hideFooter}
        getRowId={(row) =>
          row.id || row.first_name || row.categories_id || row.mentee_id
        }
        checkboxSelection={!hideCheckbox}
        onPageChange={(e) => console.log("change", e)}
        page={paginationModel?.page}
        pageSize={paginationModel?.pageSize}
        sx={{
          height: "100%",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
        {...(footerComponent
          ? {
              slots: {
                footer: footerComponent,
                toolbar: () =>
                  showToolbar ? (
                    <CustomToolbar toolBarComponent={toolBarComponent} />
                  ) : null,
                noRowsOverlay: NoDataImage,
              },
              slotProps: {
                footer: { footerAction, selectedRows },
              },
            }
          : {
              initialState: {
                pagination: {
                  paginationModel: paginationModel,
                },
              },
              slots: {
                pagination: CustomPagination,
                noRowsOverlay: NoDataImage,
              },
              pageSizeOptions: { options },
            })}
        hideFooter={hideFooter}
        disableRowSelectionOnClick
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={(itm, i) => handleRowSelection(itm)}
        paginationMode="server"
        rowCount={rowCount}
        {...restOfProps}
      />
      {/* </div> */}
    </div>
  );
}
