import React from "react";
import FeedImage from "../../assets/images/feed1.png";
import ShowMoreText from "react-show-more-text";
import { Box, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import ViewIcon from "../../assets/icons/View.svg";
import { useNavigate } from "react-router-dom";
import NoProgramImageBg from "../../assets/icons/noProgramImageBg.svg";
import NoProgramImageIcon from "../../assets/icons/noProgramImageIcon.svg";
import "./ProgramFeeds.css";

export default function ProgramFeeds({
  title = "Program Feeds",
  feedsList = [],
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState({});
  const open = Boolean(anchorEl);
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem({});
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
            className="text-[12px] py-2 px-2 cursor-pointer"
            onClick={() => navigate("/feeds")}
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
              className="!border !border-background-primary-main p-2 rounded-[10px] cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-all duration-300"
              onClick={() => navigate(`/feed-details/${programFeeds?.id}`)}
            >
              <Stack
                direction={"row"}
                alignItems={"start"}
                spacing={2}
                width={"100%"}
              >
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
                      <Typography className="!text-font-secondary-black !text-[18px] font-bold">
                        {programFeeds.title}
                      </Typography>
                      {/* <div
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
                        onClick={(e) => handleClick(e, programFeeds)}
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
                            navigate(`/feed-details/${selectedItem?.id}`)
                          }
                        >
                          <img src={ViewIcon} alt="" />
                          <Typography className="!text-font-secondary-black text-[12px] font-semibold pl-2">
                            View
                          </Typography>
                        </MenuItem>
                      </Menu> */}
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
