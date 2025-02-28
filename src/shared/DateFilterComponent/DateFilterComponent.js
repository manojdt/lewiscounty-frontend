import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Available view options
const VIEW_OPTIONS = [
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
  defaultView = "day",
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
      onChange(newDate, viewMode);
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
    if (onChange) {
      onChange(selectedDate, newViewMode);
    }
  };

  /**
   * Determine DatePicker views and openTo based on view mode
   */
  const getDatePickerProps = () => {
    // Set views and openTo based on viewMode
    let views, openTo;

    switch (viewMode) {
      case "month":
        views = ["month", "year"];
        openTo = "month";
        break;
      case "year":
        views = ["year"];
        openTo = "year";
        break;
      case "day":
      default:
        views = ["day", "month", "year"];
        openTo = "day";
        break;
    }

    // Combine with other props
    const pickerProps = {
      value: selectedDate,
      onChange: handleDateChange,
      label: label,
      views: views,
      openTo: openTo,
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
      <FormControl sx={{ minWidth: 120 }} {...selectProps}>
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
      <Box sx={{ width: "100%" }}>
        <DatePicker {...getDatePickerProps()} />
      </Box>
    </Stack>
  );
};

export default DateFilterComponent;
