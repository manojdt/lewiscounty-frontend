import { Box, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ShowMoreText from "react-show-more-text";
import NoProgramImageBg from "../../assets/icons/noProgramImageBg.svg";
import NoProgramImageIcon from "../../assets/icons/noProgramImageIcon.svg";
export const FeedCard = ({ programFeeds = "" }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      m={"22px"}
      className="!border !border-background-primary-main p-2 rounded-[10px] cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-all duration-300"
      onClick={() => navigate(`/feed-details/${programFeeds?.id}`)}
    >
      <Stack direction={"row"} alignItems={"start"} spacing={2} width={"100%"}>
      <Box className="w-[140px]">
                  {programFeeds?.media_files?.[0]?.media_files ? (
                    <img
                      src={programFeeds?.media_files?.[0]?.media_files}
                      alt=""
                      className="h-[100px] w-[100%] rounded-[10px] object-cover"
                    />
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        className="feed-image  h-[100px] w-[100%] object-cover rounded"
                        src={NoProgramImageBg}
                        alt="Background"
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img src={NoProgramImageIcon} alt="Icon" />
                      </div>
                    </div>
                  )}
                </Box>
        <Stack spacing={1} width={"100%"}>
          <Stack spacing={1}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
            </Stack>
            <Typography className="!text-font-primary-main !text-[12px]">
              {programFeeds?.time_since_action}
            </Typography>
          </Stack>
          <ShowMoreText
            lines={3} 
            more={<span className="custom-more-less">Show more</span>} 
            less={<span className="custom-more-less">Show less</span>}
            anchorClass="my-anchor-class"
            expanded={false}
          >
            <Typography
            className="custom-content"
              style={{ fontSize: "14px", color: "#232323" }}
            >
              {programFeeds.content ?? programFeeds?.desc ?? ""}
            </Typography>
          </ShowMoreText>
          <Typography></Typography>
          <Grid container spacing={1}>
            {programFeeds?.tags_list?.map((e) => {
              return (
                <Grid item xs={3}>
                  <Typography className="!bg-background-primary-light px-[12px] py-[4px] rounded-[50px] !text-font-primary-main text-center">
                    {e}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
};
