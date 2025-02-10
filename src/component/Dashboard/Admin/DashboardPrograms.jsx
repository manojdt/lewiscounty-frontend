import React from "react";
import DashboardCard from "../../../shared/Card/DashboardCard";
import ViewAllIcon from "../../../assets/icons/viewAll.svg";
import CreateIcon from "../../../assets/icons/createNewProgram.svg";
import { pipeUrls } from "../../../utils/constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestPageBreadcrumbs } from "../../Breadcrumbs/BreadcrumbsCommonData";
import { useDispatch } from "react-redux";
import { getallMyProgram } from "../../../services/programInfo";
import { getUserPrograms } from "../../../services/userprograms";
import ProgramCard from "../../../shared/Card/ProgramCard";
import api from "../../../services/api";

export default function DashboardPrograms({ categoryId }) {
  const dispatch = useDispatch();
  const [programData, setProgramData] = React.useState({});
  const [searchParams] = useSearchParams();
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
      status: "yettojoin",
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
  React.useEffect(() => {
    handleFetchPrograms();
  }, [categoryId]);

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
      {searchParams.get("type") === "yettostart" && (
        <ProgramCard
          title="Recent  Programs"
          viewpage="/programs?type=yettostart"
          handleNavigateDetails={handleNavigateDetails}
          handleBookmark={handleBookmark}
          programs={programData?.programs}
          // loadProgram={handleFetchPrograms}
        />
      )}
      {(searchParams.get("type") === "yettojoin" ||
        searchParams.get("type") === null) && (
        <ProgramCard
          title="Active Programs"
          viewpage="/programs?type=yettojoin"
          handleNavigateDetails={handleNavigateDetails}
          handleBookmark={handleBookmark}
          programs={programData?.programs ?? []}
          //   loadProgram={getPrograms}
        />
      )}
      {searchParams.get("type") === "inprogress" && (
        <ProgramCard
          title="Ongoing  Programs"
          viewpage="/programs?type=inprogress"
          handleNavigateDetails={handleNavigateDetails}
          handleBookmark={handleBookmark}
          programs={programData?.programs}
          // loadProgram={handleFetchPrograms}
        />
      )}
    </div>
  );
}
