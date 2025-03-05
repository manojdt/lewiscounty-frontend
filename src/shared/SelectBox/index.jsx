import { MenuItem, TextField } from "@mui/material";
import React, { useRef } from "react";
import ArrowDown from "../../assets/icons/menuDownIcon.svg";

export const SelectBox = ({
  value = "",
  handleChange = () => false,
  menuList = [],
  width = "100px",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (selectRef.current) {
      if (!isOpen) {
        selectRef.current.focus();
      } else {
        selectRef.current.blur();
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        select
        fullWidth
        ref={selectRef}
        value={value}
        onChange={handleChange}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        // sx={{
        //   height: "40px",
        //   // border: "1px solid #1D5BBF",
        //   color: "#FFFFFF",
        //   minWidth: width ?? "100px",
        //   background: "#1D5BBF0D",
        //   "& .MuiSelect-select": {
        //     fontSize: "14px",
        //   },
        // }}
        IconComponent={(props) => (
          <div
            onClick={toggleOpen}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={ArrowDown}
              alt="ArrowDown"
              style={{
                transform: isOpen ? "rotate(180deg)" : "",
                cursor: "pointer",
              }}
            />
          </div>
        )}
      >
        {menuList?.map((e, index) => (
          <MenuItem
            key={index}
            value={e?.value}
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
            {e?.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};