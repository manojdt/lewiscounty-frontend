import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const VIEW_OPTIONS = [
  { value: "", label: "All" },
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

  /**
   * Format date based on view mode
   * day - MM-DD-YYYY
   * month - MM-YYYY
   * year - YYYY
   */
  const formatDateByViewMode = (date, mode) => {
    if (!date) return "";

    try {
      // Ensure we're working with a Date object
      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date provided:", date);
        return "";
      }

      // Manual formatting without relying on date-fns
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const year = dateObj.getFullYear();

      switch (mode) {
        case "day":
          return `${year}-${month}-${day}`;
        case "month":
          return `${year}-${month}`;
        case "year":
          return `${year}`;
        default:
          return "";
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (onChange) {
      // Format date based on view mode before sending to parent
      const formattedDateStr = formatDateByViewMode(newDate, viewMode);
      console.log("Date changed:", newDate, "Formatted:", formattedDateStr);
      onChange(newDate, viewMode, formattedDateStr);
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
      const formattedDateStr = formatDateByViewMode(selectedDate, newViewMode);
      console.log("View changed:", newViewMode, "Formatted:", formattedDateStr);
      onChange(selectedDate, newViewMode, formattedDateStr);
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
        inputFormat = "yyyy/MM";
        break;
      case "year":
        views = ["year"];
        openTo = "year";
        inputFormat = "yyyy";
        break;
      case "day":
        views = ['year', 'month', 'day'];
        openTo = "day";
        inputFormat = "MM/dd/yyyy";
        break;
      default:
        views = ['year', 'month', 'day'];
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
          size="small"
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
