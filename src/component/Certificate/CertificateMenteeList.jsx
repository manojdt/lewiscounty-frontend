import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Cancel from "../../assets/images/cancel-colour1x.png";
import ArrowRightIcon from "../../assets/icons/arrowRightColor.svg";
import TickCircle from "../../assets/icons/tickCircle.svg";
import DataTable from "../../shared/DataGrid";
import { certificateMenberColumns } from "../../utils/tableFields";
import {
  certificateResultColor,
  certificateResultText,
  certificateStatus,
  resultColor,
  resultText,
} from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getReportProgramDetails } from "../../services/reportsInfo";
import { Button } from "../../shared";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import { Menu, MenuItem } from "@mui/material";
import SuccessTik from "../../assets/images/blue_tik1x.png";
import {
  createCertificate,
  getCertificateMember,
} from "../../services/certificate";
import MuiModal from "../../shared/Modal";

export default function CertificateMenteeList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data } = useSelector(state => state.userInfo)
  const role = data?.role || '';

  const { status, certificatesMembers } = useSelector(
    (state) => state.certificates
  );

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [seletedItem, setSelectedItem] = useState({});

  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const getCertificateDetails = async () => {
    dispatch(
      getCertificateMember(
        searchParams.get("type") === "approved"
          ? `?id=${id}&page=${paginationModel?.page + 1}&limit=${paginationModel?.pageSize}`
          : `?program_id=${id}&page=${paginationModel?.page + 1}&limit=${paginationModel?.pageSize}`
      )
    );
  };

  useEffect(() => {
    if (id) {
      getCertificateDetails();
    }
  }, [id]);

  const handleMoreClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let certificateColumn = [
    ...certificateMenberColumns,
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      id: 2,
      renderCell: (params) => {
        return (
          <>

            <div className="cursor-pointer flex items-center h-full relative">
              <span
                className="w-[80px] flex justify-center h-[30px] px-3"
                style={{
                  background: certificateResultColor[params.row.status]?.bg || "",
                  lineHeight: "30px",
                  borderRadius: "3px",
                  width: "110px",
                  height: "34px",
                  color: certificateResultColor[params.row.status]?.color || "",
                  fontSize: "12px",
                }}
              >
                {" "}
                {certificateResultText[params.row.status]}
              </span>
            </div>

          </>
        );
      },
    },
  ];

  if (role !== 'mentee') {
    certificateColumn = [
      ...certificateColumn,
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

                {(searchParams.get("type") === "approved" || searchParams.get("type") === "waiting_for_response" || role === 'admin') && (
                  <MenuItem
                    onClick={() => {
                      let url = searchParams.get("type") === "approved" ?  `/certificate-view/${id}?mentee_id=${seletedItem?.mentee_id}` :
                      `/mentee-task_list/${id}?mentee_id=${seletedItem?.mentee_id}&program_id=${seletedItem.program_id}`;
                      return navigate(url)
                    }

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
                )}
              </Menu>
            </>

          );
        },
      }
    ]
  }


  useEffect(() => {
    if (status === certificateStatus.create) {
      setTimeout(() => {
        navigate("/certificates");
      }, 3000);
    }
  }, [status]);

  const handleSubmit = () => {
    dispatch(
      createCertificate({
        id:
          certificatesMembers &&
          certificatesMembers.length > 0 &&
          certificatesMembers[0].program_id,
      })
    );
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
            {searchParams.get("type") === "approved" ? (
              <>
                <p style={{ color: "rgba(89, 117, 162, 1)", fontWeight: 500 }}>
                  Member List
                </p>
                <img src={ArrowRightIcon} alt="ArrowRightIcon" />
                <p>Accept</p>
              </>
            ) : (
              <>
                <p>View Member List</p>
              </>
            )}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigate("/certificates")}
          >
            <img src={Cancel} alt="link" className="w-[20px] h[10px]" />
          </div>
        </div>
        <DataTable
          rows={certificatesMembers?.results || []}
          columns={certificateColumn}
          hideCheckbox
          hideFooter={certificatesMembers?.results?.length <= 10}
          rowCount={certificatesMembers?.count}
          paginationModel={paginationModel} setPaginationModel={setPaginationModel}
        />
        {searchParams.get("type") !== "approved" && (
          <div>
            <div className="flex gap-6 justify-center align-middle py-16">
              <Button
                btnName="Cancel"
                btnCls="w-[13%]"
                btnCategory="secondary"
                onClick={() => navigate("/certificates")}
              />
              {certificatesMembers && certificatesMembers?.length > 0 && (
                <Button
                  btnType="button"
                  btnCls="w-[13%]"
                  onClick={() => handleSubmit()}
                  btnName="Submit"
                  btnCategory="primary"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
