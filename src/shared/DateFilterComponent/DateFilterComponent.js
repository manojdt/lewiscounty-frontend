import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";

// Available view options with "All" as default
const VIEW_OPTIONS = [
  { value: "all", label: "All" },
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const DateFilterComponent = ({
  label = "Select Date",
  selectLabel = "View",
  value = null,
  onChange,
  onViewChange,
  defaultView = "all", // Changed default to "all"
  availableViews = VIEW_OPTIONS,
  datePickerProps = {},
  selectProps = {},
  minDate,
  maxDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const [viewMode, setViewMode] = useState(defaultView);

  // Set up initial values
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (onChange) {
      // Format date based on view mode before sending to parent
      const formattedDate = formatDateByViewMode(newDate, viewMode);
      onChange(newDate, viewMode, formattedDate);
    }
  };

  // Handle view mode change
  const handleViewChange = (event) => {
    const newViewMode = event.target.value;
    setViewMode(newViewMode);

    // Notify parent component about view change
    if (onViewChange) {
      onViewChange(newViewMode);
    }

    // Also call the main onChange with current date and new view mode
    if (onChange && selectedDate) {
      const formattedDate = formatDateByViewMode(selectedDate, newViewMode);
      onChange(selectedDate, newViewMode, formattedDate);
    }
  };

  /**
   * Format date based on view mode
   * day - MM-DD-YYYY
   * month - MM-YYYY
   * year - YYYY
   */
  const formatDateByViewMode = (date, mode) => {
    if (!date) return "";

    try {
      switch (mode) {
        case "day":
          return format(date, "mm-dd-yyyy");
        case "month":
          return format(date, "mm-yyyy");
        case "year":
          return format(date, "yyyy");
        default:
          return "";
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  /**
   * Determine DatePicker views and openTo based on view mode
   */
  const getDatePickerProps = () => {
    // Set views and openTo based on viewMode
    let views, openTo, inputFormat;

    switch (viewMode) {
      case "month":
        views = ["month", "year"];
        openTo = "month";
        inputFormat = "MM/yyyy";
        break;
      case "year":
        views = ["year"];
        openTo = "year";
        inputFormat = "yyyy";
        break;
      case "day":
        views = ["day", "month", "year"];
        openTo = "day";
        inputFormat = "MM/dd/yyyy";
        break;
      default:
        views = ["day", "month", "year"];
        openTo = "day";
        inputFormat = "MM/dd/yyyy";
        break;
    }

    // Combine with other props
    const pickerProps = {
      value: selectedDate,
      onChange: handleDateChange,
      placeholder: label,
      views: views,
      openTo: openTo,
      inputFormat: inputFormat,
      ...datePickerProps,
    };

    // Add min/max date constraints if provided
    if (minDate) {
      pickerProps.minDate = new Date(minDate);
    }
    if (maxDate) {
      pickerProps.maxDate = new Date(maxDate);
    }

    return pickerProps;
  };

  return (
    <Stack
      spacing={2}
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
    >
      <FormControl sx={{ minWidth: 120 }} {...selectProps} size="small">
        <Select
          value={viewMode}
          placeholder={selectLabel}
          onChange={handleViewChange}
          size="medium"
        >
          {availableViews.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {viewMode !== "all" && (
        <Box sx={{ width: "100%" }}>
          <DatePicker
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            {...getDatePickerProps()}
          />
        </Box>
      )}
    </Stack>
  );
};

export default DateFilterComponent;
