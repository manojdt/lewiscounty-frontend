import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { programActionStatus } from "../utils/constant";
import { useSelector } from "react-redux";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";

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

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360 }}>
      <FormControl fullWidth>
        <InputLabel>{cardTitle}</InputLabel>
        <Select
          value={selectedFilter}
          label={cardTitle}
          onChange={handleFilterChange}
          sx={{ background: "rgba(217, 228, 242, 1)" }}
        >
          {cardContent.map((menu, index) => (
            <MenuItem
              key={index}
              value={menu.name}
              onClick={() =>
                menu.page
                  ? handleNavigate(menu)
                  : handleClick
                  ? handleClick(menu)
                  : undefined
              }
              sx={{
                display: "flex",
                justifyContent: "space-between",
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
                    ? "rgba(0, 123, 255, 0.1)"
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
              <Typography variant="body2">{menu.name}</Typography>
              <Typography
                variant="body1"
                sx={{ color: cardCountColor, fontWeight: "bold" }}
              >
                {menu.count > 0 ? menu.count : ""}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
