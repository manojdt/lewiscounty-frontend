import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { programActionStatus } from "../utils/constant";
import { useSelector } from "react-redux";
import {
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MoreVerticalIcon } from "lucide-react";

export default function RequestSelectBox({
  cardTitle,
  cardContent,
  cardFilter = [],
  cardCountColor = "#000",
  handleClick,
  activeItem = "",
  menuNavigate = undefined,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userInfo = useSelector((state) => state.userInfo);
  const role = userInfo.data.role || "";

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(
    cardFilter[0]?.name || ""
  );

  const handleNavigate = (menu) => {
    if (menuNavigate) {
      menuNavigate();
    }
    if (role === "mentee" && menu?.menteePage) {
      navigate(menu.menteePage);
    } else {
      navigate(menu.page);
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  console.log("selectedFilter", anchorEl);
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value); // Update selected filter when user selects a filter
  };

  return (
    <div>
      <div className="">
        {/* Display the Filter Dropdown */}
        {cardFilter.length ? (
          <Box className="text-sm leading-8" sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel>Filter</InputLabel>
              <Select
                value={selectedFilter} // Bind selected filter to the Select component
                label="Filter"
                onChange={handleFilterChange} // Handle filter selection
                sx={{ background: "rgba(217, 228, 242, 1)" }}
              >
                {cardFilter.map((filter, index) => (
                  <MenuItem key={index} value={filter.name}>
                    {filter.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : null}
      </div>
      <div>
        <Tooltip title="Request">
          <IconButton onClick={handleOpenMenu} className="">
            <MoreVerticalIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {cardContent.map((menu, index) => (
            <MenuItem
              key={index}
              onClick={() =>
                menu.page
                  ? handleNavigate(menu)
                  : handleClick
                  ? handleClick(menu)
                  : undefined
              }
              sx={{
                backgroundColor:
                  searchParams.get("type") === menu.status ||
                  activeItem === menu.status ||
                  searchParams.get("type") === menu?.key ||
                  (role === "mentee" &&
                    searchParams.get("type") === menu?.menteeStatus) ||
                  (searchParams.get("is_bookmark") !== null &&
                    menu.status === programActionStatus.bookmark) ||
                  (searchParams.get("type") === "planned" &&
                    menu.status === "yettojoin") ||
                  (searchParams.get("type") === null &&
                    searchParams.get("is_bookmark") === null &&
                    menu.status === "all" &&
                    userInfo?.data?.is_registered) ||
                  (searchParams.get("type") === null &&
                    searchParams.get("is_bookmark") === null &&
                    menu.status === programActionStatus.yettojoin &&
                    role === "mentee" &&
                    !userInfo?.data?.is_registered)
                    ? "rgba(0, 123, 255, 0.1)" // Active menu item color
                    : "transparent",
                color:
                  searchParams.get("type") === menu.status ||
                  activeItem === menu.status ||
                  searchParams.get("type") === menu?.key ||
                  (role === "mentee" &&
                    searchParams.get("type") === menu?.menteeStatus) ||
                  (searchParams.get("is_bookmark") !== null &&
                    menu.status === programActionStatus.bookmark) ||
                  (searchParams.get("type") === "planned" &&
                    menu.status === "yettojoin") ||
                  (searchParams.get("type") === null &&
                    searchParams.get("is_bookmark") === null &&
                    menu.status === "all" &&
                    userInfo?.data?.is_registered) ||
                  (searchParams.get("type") === null &&
                    searchParams.get("is_bookmark") === null &&
                    menu.status === programActionStatus.yettojoin &&
                    role === "mentee" &&
                    !userInfo?.data?.is_registered)
                    ? "#007BFF"
                    : "inherit",
              }}
            >
              <span className="text-sm">{menu.name}</span>
              <span className="text-base" style={{ color: cardCountColor }}>
                {menu.count > 0 ? menu.count : ""}
              </span>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
}
