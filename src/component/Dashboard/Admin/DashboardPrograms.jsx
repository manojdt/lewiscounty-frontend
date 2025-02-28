import React, { useState } from "react";
import DashboardCard from "../../../shared/Card/DashboardCard";
import ViewAllIcon from "../../../assets/icons/viewAll.svg";
import CreateIcon from "../../../assets/icons/createNewProgram.svg";
import { pipeUrls } from "../../../utils/constant";
import GridViewIcon from "../../../assets/icons/gridviewIcon.svg";
import ListViewIcon from "../../../assets/icons/listviewIcon.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestPageBreadcrumbs } from "../../Breadcrumbs/BreadcrumbsCommonData";
import { useDispatch } from "react-redux";
import { getallMyProgram } from "../../../services/programInfo";
import { getUserPrograms } from "../../../services/userprograms";
import ProgramCard from "../../../shared/Card/ProgramCard";
import api from "../../../services/api";
import DataTable from "../../../shared/DataGrid";
import { programListColumns } from "../../../utils/tableFields";
import { Menu, MenuItem } from "@mui/material";
import { ProgramTableView } from "../ProgramTableView/ProgramTableView";

export default function DashboardPrograms({searchParams, categoryId,type }) {
  const dispatch = useDispatch();
  const [programData, setProgramData] = useState({});
  const [programView, setProgramView] = useState("grid");
  // const [searchParams] = useSearchParams();
  const categoryIDParams=categoryId?`&category_id=${categoryId}`:""
  console.log(categoryIDParams,"categoryIDParams")
  const navigate = useNavigate();
  const handleNavigateDetails = (program) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(program).length) {
      navigate(
        `${baseUrl}/${program.id}?breadcrumbsType=${requestPageBreadcrumbs.dashboardPrograms}`
      );
    }
  };

  const handleBookmark = async (program) => {
    const is_admin_assign_program = program.hasOwnProperty(
      "admin_assign_program"
    );
    const payload = {
      [is_admin_assign_program ? "admin_program_id" : "program_id"]: program.id,
      marked: !program.is_bookmark,
    };
    const bookmark = await api.post("bookmark", payload);
    if (bookmark.status === 201 && bookmark.data) {
      // setLoading(false);
      handleFetchPrograms();
    }
  };

  const actionItem = [
    {
      name: "View All",
      icon: ViewAllIcon,
      url: "",
    },
    {
      name: "Create New",
      icon: CreateIcon,
      url: "/create-programs",
    },
  ];
  const handleFetchPrograms = () => {
    // if (!categoryId) {
    //   console.error("Category ID is missing!");
    //   return;
    // }
    const payload = {
      limit: 6,
      page: 1,
      status: type||"yettojoin",
      ...categoryId && { category_id: categoryId }
    };
    // Only include category_id if it's defined and not null
    if (categoryId) {
      payload.category_id = categoryId;
    }
    dispatch(getallMyProgram(payload)).then((res) => {
      console.log("res ====>", res);
      setProgramData(res?.payload);
    });
  };
  const handleViewChange = () => {
    setProgramView(programView === "grid" ? "list" : "grid");
  };

  const ImageComponent = (
      <img
      src={programView === "grid" ? ListViewIcon : GridViewIcon}
      className="cursor-pointer w-[17px] pt-[2px]"
      alt="viewicon"
      onClick={handleViewChange}
    />
    )
  
  React.useEffect(() => {
    handleFetchPrograms();
  }, [type,categoryId]);

  return (
    // <DashboardCard
    //     title="Planned Programs"
    //     viewpage="/programs?type=yettojoin"
    //     handleNavigateDetails={handleNavigateDetails}
    //     handleBookmark={handleBookmark}
    //     programs={programData?.programs ?? []}
    //     height='315px'
    //     action={actionItem}
    // />

    <div className="programs-list">
      {programView === "grid" && (
        <>
          {/* {searchParams.get("type") === "yettostart" && (
            <ProgramCard
              title="Recently Joined Programs"
              viewpage={`/programs?type=yettostart${categoryIDParams}`}
              handleNavigateDetails={handleNavigateDetails}
              handleBookmark={handleBookmark}
              programs={programData?.programs}
              tableIcon={ImageComponent}
              // loadProgram={handleFetchPrograms}
            />
          )} */}
          {(searchParams.get("type") === "yettojoin" ||
            searchParams.get("type") === null) && (
            <ProgramCard
              title="Active Programs"
              viewpage={`/programs?type=yettojoin${categoryIDParams}`}
              handleNavigateDetails={handleNavigateDetails}
              handleBookmark={handleBookmark}
              programs={programData?.programs ?? []}
              tableIcon={ImageComponent}
              //   loadProgram={getPrograms}
            />
          )}
          {searchParams.get("type") === "inprogress" && (
            <ProgramCard
              title="Ongoing  Programs"
              viewpage={`/programs?type=inprogress${categoryIDParams}`}
              handleNavigateDetails={handleNavigateDetails}
              handleBookmark={handleBookmark}
              programs={programData?.programs}
              tableIcon={ImageComponent}
              // loadProgram={handleFetchPrograms}
            />
          )}
        </>
      )}
      {programView === "list" && (
        <div>
          <ProgramTableView
            title={
              searchParams.get("type") === "yettostart"
                ? "Recent  Programs"
                : searchParams.get("type") === "yettojoin" ||
                  searchParams.get("type") === null
                ? "Active Programs"
                : searchParams.get("type") === "inprogress"
                ? "Ongoing  Programs"
                : ""
            }
            viewpage={ searchParams.get("type") === "yettostart"
              ? "/programs?type=yettostart"
              : searchParams.get("type") === "yettojoin" ||
                searchParams.get("type") === null
              ? "/programs?type=yettojoin"
              : searchParams.get("type") === "inprogress"
              ? "/programs?type=inprogress"
              : "/programs"}
            tableIcon={ImageComponent}
            programData={programData?.programs}
            programView={programView}
            setProgramView={setProgramView}
          />
        </div>
      )}
    </div>
  );
}
