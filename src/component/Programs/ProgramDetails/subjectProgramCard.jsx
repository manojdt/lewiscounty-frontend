import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import StarColorIcon from "../../../assets/icons/starColor.svg";
import UserImage from "../../../assets/icons/user-icon.svg";
import { Button } from "../../../shared";
import { useNavigate } from "react-router-dom";
export const SubjectProgramCard = ({ data = {} }) => {
  const navigate = useNavigate();
  return (
    <>
      <Stack
        sx={{ boxShadow: "3.28px 3.28px 12.3px 0px #0000001A" }}
        className="rounded-[8px] py-6 px-4"
        spacing={3}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography className="!text-[#18283D] font-bold !text-[18px]">
            {data?.program_name}
          </Typography>
          <Typography className="!border !border-[#EEEEEE] rounded-[50px] !text-[#18283D] !text-[10px] px-3 py-1">
            {data?.category_name}
          </Typography>
        </Stack>
        <Typography className="!text-[#18283D] !text-[12px]">
          {data?.description}
        </Typography>

        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <img src={StarColorIcon} alt="StarColorIcon" />
            <p>{data?.mentor_rating}</p>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <img
              className="w-6 h-6 rounded-full shadow-lg object-cover"
              src={data?.mentor_profile_image ?? UserImage}
              alt="User logo"
            />
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: "215px",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                fontSize: "14px",
              }}
            >
              Instructor :{" "}
              <span style={{ color: "#1D5BBF" }}>
                {data?.mentor_name} ({data?.role ?? ""})                
              </span>
            </span>
          </Stack>
        </Stack>
        <Box className="w-full text-center">
          <Button
            btnName="View Details"
            btnCls="w-[140px] !text-[#fff] !bg-background-primary-main !text-[12px]"
            btnCategory="secondary"
            onClick={()=> navigate(`/program-details/${data?.id}`)}
          />
        </Box>
      </Stack>
    </>
  );
};
