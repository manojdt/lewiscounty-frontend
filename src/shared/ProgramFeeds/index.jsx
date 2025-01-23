import React from "react";
import FeedImage from "../../assets/images/feed1.png";
import ShowMoreText from "react-show-more-text";
import { Box, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import ViewIcon from "../../assets/icons/View.svg";
import { useNavigate } from "react-router-dom";
import "./ProgramFeeds.css";
export default function ProgramFeeds({
  title = "Program Feeds",
  feedsList = [],
}) {
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
    <div
      className="program-feeds"
      style={{
        boxShadow: "4px 4px 15px 0px rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
        paddingBottom: "10px",
      }}
    >
      <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
        <div className="flex gap-4">
          <div
            className="card-dash"
            style={{
              background: "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
            }}
          ></div>
          <h4>{title}</h4>
        </div>
        <div className="flex gap-4 items-center">
          {/* <img src={SearchIcon} alt="statistics" /> */}
          <p
            className="text-[12px] py-2 px-2"
            style={{
              background: "rgba(223, 237, 255, 1)",
              borderRadius: "5px",
            }}
          >
            View All
          </p>
        </div>
      </div>
      <div style={{ height: "640px", overflowY: "scroll", background: "#fff" }}>
        {feedsList?.map((programFeeds, index) => (
          <div
            key={index}
            style={
              {
                // border: "1px solid rgba(29, 91, 191, 1)",
                // borderRadius: "5px",
              }
            }
            className="program-feed-root mx-9 my-9"
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              m={"22px"}
              className="!border !border-background-primary-main p-2 rounded-[10px]"
            >
              <Stack
                direction={"row"}
                alignItems={"start"}
                spacing={2}
                width={"100%"}
              >
                <Box className="w-[140px]">
                  <img
                    src={
                      programFeeds?.media_files?.[0]?.media_files ?? FeedImage
                    }
                    alt=""
                    className="h-[120px] w-[100%] rounded-[10px]"
                  />
                </Box>
                <Stack spacing={1} width={"100%"}>
                  <Stack spacing={1}>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Typography className="!text-font-secondary-black !text-[18px] font-bold">
                        {programFeeds.title}
                      </Typography>
                      <div
                        className="bg-background-primary-light"
                        style={{
                          padding: "14px 18px",
                          cursor: "pointer",
                        }}
                        // onClick={() =>
                        //   navigate(`/feed-details/${programFeeds?.id}`)
                        // }
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <img src={MoreIcon} alt="MoreIcon" />
                      </div>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          onClick={() =>
                            navigate(`/feed-details/${programFeeds?.id}`)
                          }
                        >
                          <img src={ViewIcon} alt="" />
                          <Typography className="!text-font-secondary-black text-[12px] font-semibold pl-2">
                            View
                          </Typography>
                        </MenuItem>
                        {/* <MenuItem
                          onClick={() =>
                            navigate(`/feed-details/${programFeeds?.id}`)
                          }
                        >
                          <img src={EditIcon} alt="" />
                          <Typography className="!text-font-secondary-black text-[12px] font-semibold pl-2">
                            Edit
                          </Typography>
                        </MenuItem>                        
                        <MenuItem onClick={handleClose}>
                          <img src={UnFollowIcon} alt="" />
                          <Typography className="!text-font-secondary-black text-[12px] font-semibold pl-2">
                            Unfollow
                          </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <img src={HideIcon} alt="" />
                          <Typography className="!text-font-secondary-black text-[12px] font-semibold pl-2">
                            Hide
                          </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <img src={ReportIcon} alt="" />
                          <Typography className="!text-font-secondary-black text-[12px] font-semibold pl-2">
                            Report
                          </Typography>
                        </MenuItem> */}
                      </Menu>
                    </Stack>
                    <Typography className="!text-font-primary-main !text-[12px]">
                      {programFeeds?.time_since_action}
                    </Typography>
                  </Stack>
                  {/* <Typography>{programFeeds.content ?? programFeeds?.desc ?? ""}</Typography> */}

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
                  <Grid container spacing={1}>
                    {programFeeds?.tags_list?.map((e) => {
                      return (
                        <Grid item xs={3}>
                          <Typography className="!bg-background-primary-light px-[12px] py-[4px] rounded-[50px] !text-font-primary-main text-center !text-[12px]">
                            {e}
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
          </div>
        ))}
      </div>
    </div>
  );
}
