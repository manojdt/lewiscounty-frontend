import React from "react";
import SearchIcon from "../../assets/icons/search.svg";
import UserImage from "../../assets/images/user.jpg";
import { programFeeds } from "../../utils/mock";
import ShowMoreText from "react-show-more-text";
import { useNavigate } from "react-router-dom";

export default function ProgramFeeds({
  title = "Program Feeds",
  feedsList = [],
}) {
    const navigate = useNavigate();
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
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

      {console.log(feedsList)}

      {feedsList?.map((programFeeds, index) => (
        <div
          key={index}
           onClick={() => navigate(`/feed-details/${programFeeds.id}`)}
          style={{
            border: "1px solid rgba(29, 91, 191, 1)",
            borderRadius: "5px",
          }}
          className="program-feed-root mx-9 my-9 cursor-pointer"
        >
          <div className="flex py-3 px-3 gap-4">
            <img
              src={programFeeds?.image_url || UserImage}
              className={`program-user-image ${
                getWindowDimensions().width <= 1536 ? "w-1/5" : "w-1/6"
              } rounded-xl h-[100px]`}
              style={{
                height: getWindowDimensions().width <= 1536 ? "90px" : "100px",
              }}
              alt=""
            />
            <div>
              <h3>{programFeeds.user_name}</h3>
              <ShowMoreText
                lines={3}
                more={<span className="custom-more-less">Show more</span>}
                less={<span className="custom-more-less">Show less</span>}
                anchorClass="my-anchor-class"
                expanded={false}
              >
                <p
                  className="custom-content"
                  style={{ fontSize: "14px", color: "#232323" }}
                >
                  {programFeeds.content ?? programFeeds?.desc ?? ""}
                </p>
              </ShowMoreText>
              <div className="flex flex-wrap gap-2">
                {programFeeds?.tags_list?.length > 0 &&
                  programFeeds?.tags_list.map((tag) => (
                    <div className=" gap-3 pt-3">
                      <span
                        style={{
                          background: "rgba(238, 245, 255, 1)",
                          borderRadius: "30px",
                        }}
                        className="tags py-2 px-6 text-[14px]"
                      >
                        #{tag}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
