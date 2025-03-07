import React, { useRef, useEffect } from "react";
import { 
  TextField, 
  MenuItem, 
  Checkbox, 
  Chip,
  Box,
  ListItemText
} from "@mui/material";
import ArrowDown from "../../assets/icons/menuDownIcon.svg";

export const MultiSelectBox = ({
  value = [],
  handleChange = () => false,
  menuList = [],
  width = "100%",
  name = "",
  placeholder = "Select",
  disabled = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState(Array.isArray(value) ? value : []);
  const selectRef = useRef(null);

  // Update local state when value prop changes
  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : []);
  }, [value]);

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (selectRef.current) {
        if (!isOpen) {
          selectRef.current.focus();
        } else {
          selectRef.current.blur();
        }
      }
    }
  };

  const handleSelectChange = (event) => {
    const newValues = event.target.value;
    setSelectedValues(newValues);
    handleChange(name, newValues);
  };

  const handleDeleteChip = (valueToDelete) => {
    const newValues = selectedValues.filter(val => val !== valueToDelete);
    setSelectedValues(newValues);
    handleChange(name, newValues);
  };

  // Generate display value for the select (chips)
  const renderValue = (selected) => {
    if (selected.length === 0) {
      return <span style={{ color: "#757575" }}>{placeholder}</span>;
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => {
          const option = menuList.find(opt => opt.value === value);
          return (
            <Chip 
              key={value} 
              label={option ? option.label : value}
              size="small"
              onDelete={() => handleDeleteChip(value)}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              sx={{ 
                backgroundColor: "#EEF5FF",
                color: "#1D5BBF",
                '.MuiChip-deleteIcon': {
                  color: '#1D5BBF',
                  '&:hover': {
                    color: '#164a99',
                  }
                }
              }}
            />
          );
        })}
      </Box>
    );
  };

  return (
    <div style={{ position: "relative", width: width }}>
      <TextField
        select
        fullWidth
        inputRef={selectRef}
        value={selectedValues}
        onChange={handleSelectChange}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        SelectProps={{
          multiple: true,
          renderValue: renderValue,
          MenuProps: {
            PaperProps: {
              style: {
                maxHeight: 224
              }
            }
          }
        }}
        disabled={disabled}
        error={!!error}
        helperText={error}
        sx={{
          "& .MuiInputBase-root": {
            background: "#1D5BBF0D",
            border: error ? "1px solid #d32f2f" : "none",
            borderRadius: "4px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none"
          },
          "& .MuiSelect-select": {
            fontSize: "14px",
            padding: "10px 14px",
            minHeight: "40px !important",
          },
          width: width
        }}
        InputProps={{
          endAdornment: (
            <div
              onClick={toggleOpen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <img
                src={ArrowDown}
                alt="ArrowDown"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "",
                }}
              />
            </div>
          ),
        }}
      >
        {menuList?.map((option, index) => (
          <MenuItem
            key={index}
            value={option?.value}
            sx={{
              "&.Mui-selected": {
                background: "#EEF5FF",
                color: "#1D5BBF",
                fontSize: "14px",
                fontWeight: 500,
              },
              background: "#FFF",
              color: "#18283D",
              fontSize: "14px",
            }}
          >
            <Checkbox 
              checked={selectedValues.indexOf(option.value) > -1}
              sx={{
                '&.Mui-checked': {
                  color: '#1D5BBF',
                },
              }}
            />
            <ListItemText primary={option?.label} />
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default MultiSelectBox;