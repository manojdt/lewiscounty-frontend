import React, { useState, memo, useEffect } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { Chip, Box, Avatar, Tooltip } from "@mui/material";
import { MuiCustomModal } from "../Modal/MuiCustomModal";
import { StyledSearchInput } from "../DataGrid";
import SearchIcon from "../../assets/icons/search.svg";
import PlusIcon from "../../assets/icons/add_popup_icon.svg";

const CustomToolbar = ({
  toolBarComponent,
  searchQuery,
  handleSearchChange,
}) => {
  return (
    <GridToolbarContainer className="justify-end my-4 mr-5 sticky top-0 z-50">
      <div className="border rounded-sm bg-white w-80">
        <StyledSearchInput
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          sx={{
            "& .MuiInputBase-root": {
              padding: "5px 10px",
            },
          }}
          InputProps={{
            fullWidth: true,
            disableUnderline: true,
            endAdornment: (
              <Avatar
                sx={{ width: 15, height: 15 }}
                src={SearchIcon}
                alt="search_icon"
              />
            ),
          }}
        />
      </div>
      {toolBarComponent}
    </GridToolbarContainer>
  );
};

const PopupTableInput = ({
  tableData,
  selectedItems = [],
  onChange,
  disabled = false,
  label = "Select items",
  placeholder = "Select items",
  multiSelect = true,
  columns = [],
  error,
  onFieldClick,
  valueKey,
  toolBarComponent,
  fieldName,
  onSearchChange: externalSearchChange,
  loading = false,
  totalRows = 0,
  onPaginationChange,
  tablesPagination,
  paginationMode,
}) => {
  const isValidInitialSelectedItem = Array.isArray(selectedItems);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [tempSelectedItems, setTempSelectedItems] = useState(
    isValidInitialSelectedItem ? [...selectedItems] : []
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Keep track of all selected items across pages
  const [selectedAcrossPages, setSelectedAcrossPages] = useState(new Map());

  useEffect(() => {
    return () => {
      setSearchQuery("");
      externalSearchChange?.("");
    };
  }, [setSearchQuery, externalSearchChange, isPopupOpen]);

  const filteredData = externalSearchChange
    ? tableData
    : tableData.filter((item) =>
        item[valueKey].toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (externalSearchChange) {
      externalSearchChange(query);
    }
  };

  const handlePaginationModelChange = (model) => {
    onPaginationChange(fieldName, model);
  };

  const togglePopup = () => {
    if (!disabled) {
      onFieldClick?.();
      setPopupOpen(!isPopupOpen);
      if (!isPopupOpen) {
        setTempSelectedItems(isValidInitialSelectedItem ? [...selectedItems] : []);
      }
    }
  };

  const handleRowSelection = (selection) => {
    if (disabled) return;

    let newSelected = [];

    if (multiSelect) {
      // Get currently visible selected rows
      const visibleSelected = tableData.filter((item) =>
        selection.includes(item.id)
      );

      // Get previously selected rows that are not currently visible
      const previousSelected = tempSelectedItems.filter(
        (item) => !tableData.find((row) => row.id === item.id)
      );

      // Combine visible and previous selections
      newSelected = [...visibleSelected, ...previousSelected];
    } else {
      // For single select, just get the selected row
      const selectedRow = tableData.find((item) => item.id === selection[0]);
      newSelected = selectedRow ? [selectedRow] : [];
    }

    setTempSelectedItems(newSelected);
  };

  const handleRowClick = (params) => {
    if (!disabled && !multiSelect) {
      const newSelectedAcrossPages = new Map([[params.row.id, params.row]]);
      setSelectedAcrossPages(newSelectedAcrossPages);
      setTempSelectedItems([params.row]);
    }
  };

  const handleAdd = () => {
    if (!disabled) {
      onChange([...tempSelectedItems]);
      togglePopup();
    }
  };

  const handleDelete = (item) => {
    if (!disabled) {
      const updatedSelections = selectedItems.filter(
        (selected) => selected.id !== item.id
      );
      onChange(updatedSelections);

      // Update selectedAcrossPages
      const newSelectedAcrossPages = new Map(selectedAcrossPages);
      newSelectedAcrossPages.delete(item.id);
      setSelectedAcrossPages(newSelectedAcrossPages);
    }
  };

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          background: "#1D5BBF0D",
          padding: "10px",
          minHeight: "55px",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          borderRadius: "4px",
          alignItems: "center",
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {!Array.isArray(selectedItems) || selectedItems.length === 0 ? (
          <span style={{ color: "#999" }}>{label}</span>
        ) : (
          selectedItems.map((item) => (
            <Chip
              color="primary"
              key={item.id}
              label={item[valueKey]}
              onDelete={disabled ? undefined : () => handleDelete(item)}
              sx={{ margin: "2px" }}
            />
          ))
        )}
        <Tooltip title={disabled ? undefined : placeholder}>
          <img
            className={`absolute top-4 right-4 ${
              disabled
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer opacity-100"
            } self-end`}
            onClick={disabled ? undefined : togglePopup}
            src={PlusIcon}
            alt="PlusIcon"
          />
        </Tooltip>
      </Box>

      {error && (
        <p className="error mt-3 text-xs" role="alert">
          {error}
        </p>
      )}

      <MuiCustomModal
        dialogTitle={placeholder}
        open={isPopupOpen}
        onClose={togglePopup}
        handleClose={togglePopup}
        maxWidth="md"
        actionButtons={[
          {
            color: "inherit",
            variant: "outlined",
            children: "Cancel",
            onClick: togglePopup,
          },
          {
            color: "primary",
            variant: "contained",
            children: "Add",
            onClick: handleAdd,
          },
        ]}
      >
        <DataGrid
          loading={loading}
          
          rows={filteredData}
          columns={columns}
          checkboxSelection={multiSelect && !disabled}
          onRowSelectionModelChange={handleRowSelection}
          keepNonExistentRowsSelected
          onRowClick={handleRowClick}
          rowSelectionModel={tempSelectedItems.map((item) => item.id)}
          paginationMode={paginationMode}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              searchQuery,
              handleSearchChange,
              toolBarComponent,
            },
          }}
          paginationModel={tablesPagination}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 20]}
          rowCount={
            paginationMode === "server" ? totalRows : filteredData.length
          }
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      </MuiCustomModal>
    </div>
  );
};

export default memo(PopupTableInput);