import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cancel from "../../assets/images/cancel-colour1x.png";
import ArrowRightIcon from "../../assets/icons/arrowRightColor.svg";

import DataTable from "../../shared/DataGrid";
import { certificateMenberColumns } from "../../utils/tableFields";
import {
  certificateStatus,
  resultColor,
  resultText,
} from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getReportProgramDetails } from "../../services/reportsInfo";
import { Button } from "../../shared";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import { Menu } from "@mui/material";
import SuccessTik from "../../assets/images/blue_tik1x.png";
import { createCertificate } from "../../services/certificate";
import MuiModal from "../../shared/Modal";

export default function CertificateMemberDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { programDetails } = useSelector((state) => state.reports);
  const { status } = useSelector((state) => state.certificates);
  console.log(programDetails);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [seletedItem, setSelectedItem] = useState({});
  const [menteeList, setMenteeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getCertificateDetails = async () => {
    dispatch(getReportProgramDetails(id));
  };
  const getMenteeList = async () => {
    const passMenteeList = programDetails?.pass_mentee_list || [];
    const failMenteeList = programDetails?.fail_mentee_list || [];
    const listMentee = [...passMenteeList, ...failMenteeList];
    const res = listMentee.length > 0 
        ? listMentee.map((val, i) => ({
            ...val,
            id: i + 1,
            program_name: programDetails?.program_name,
        }))
        : [];

    setMenteeList(res);
};


  useEffect(() => {
    if (id) {
      getCertificateDetails();
    }
  }, [id]);
  useEffect(() => {
    if (programDetails) {
      getMenteeList();
    }
  }, [programDetails]);
  const handleMoreClick = (event, data) => {
    console.log("more");
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let certificateColumn = [
    ...certificateMenberColumns,
    {
      field: "mark",
      headerName: "Total Over All Mark",
      flex: 1,
      id: 1,
      renderCell: (params) => {
        return <></>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      id: 2,
      renderCell: (params) => {
        console.log("paramsppppp", params);
        return (
          <>
            <div className="cursor-pointer flex items-center h-full relative">
              <span
                className="w-[80px] flex justify-center h-[30px] px-3"
                style={{
                  background: resultColor[params.row.status]?.bg || "",
                  lineHeight: "30px",
                  borderRadius: "3px",
                  width: "110px",
                  height: "34px",
                  color: resultColor[params.row.status]?.color || "",
                  fontSize: "12px",
                }}
              >
                {" "}
                {resultText[params.row.status]}
              </span>
            </div>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      id: 4,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer flex items-center h-full"
              onClick={(e) => handleMoreClick(e, params.row)}
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
              {/* {role === "mentee" ? (
                <MenuItem
                  onClick={() =>
                    navigate(`/certificate-view/${seletedItem.id}`)
                  }
                  className="!text-[12px]"
                >
                  <img
                    src={TickCircle}
                    alt="AcceptIcon"
                    className="pr-3 w-[27px]"
                  />
                  View
                </MenuItem>
              ) : null} */}

              {/* <MenuItem onClick={handleCeritificateDownload} className='!text-[12px]'>
                            <img src={DownloadIcon} alt="AcceptIcon" className='pr-3 w-[27px]' />
                            
                        </MenuItem> */}
            </Menu>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (status === certificateStatus.create) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  }, [status]);

  const handleSubmit = () => {
    dispatch(createCertificate({ id: +id }));
  };
  return (
    <div className="px-8 mt-10 pb-5">
      <div
        className="px-3 py-5"
        style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <MuiModal
          modalOpen={status === certificateStatus.create}
          modalClose={() => setLoading(false)}
          noheader
        >
          <div className="px-5 py-1 flex justify-center items-center">
            <div
              className="flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20"
              style={{
                background:
                  "linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)",
                borderRadius: "10px",
              }}
            >
              <img src={SuccessTik} alt="SuccessTik" />
              <p className="text-white text-[12px]">
                Certificate request is successfully created
              </p>
            </div>
          </div>
        </MuiModal>
        <div className="flex justify-between px-5 pb-4 mb-8 items-center border-b-2">
          <div className="flex gap-5 items-center text-[14px]">
            <p style={{ color: "rgba(89, 117, 162, 1)", fontWeight: 500 }}>
              Generate Certificates Request
            </p>
            <img src={ArrowRightIcon} alt="ArrowRightIcon" />
            <p>View Member List</p>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigate("/all-request?type=member_join_request")}
          >
            <img src={Cancel} alt="link" className="w-[20px] h[10px]" />
          </div>
        </div>
        <DataTable
          rows={menteeList || []}
          columns={certificateColumn}
          hideCheckbox
          hideFooter
        />

        <div>
          <div className="flex gap-6 justify-center align-middle py-16">
            <Button
              btnName="Cancel"
              btnCls="w-[13%]"
              btnCategory="secondary"
              onClick={() => navigate("/certificates")}
            />
            <Button
              btnType="button"
              btnCls="w-[13%]"
              onClick={() => handleSubmit()}
              btnName="Submit"
              btnCategory="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
