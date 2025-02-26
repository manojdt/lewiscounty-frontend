import React, { useState } from "react";
import MuiModal from "../../shared/Modal";
import { Button as MuiButton } from "@mui/material";
import EditIcon from "../../assets/icons/edit-ticket-icon.svg"; // Assuming this is an SVG file
import { useNavigate } from "react-router-dom";
import DeleteModal from "./delete-modal";
import DoubleAvatar from "../../assets/icons/double-avatar.svg";
import DummyAvatar from "../../assets/icons/dummy-avatar.svg";
import BellIcon from "../../assets/icons/bell-icon.svg";
import GMeetModal from "./GMeetModal";
import { dateFormat } from "../../utils";
import { eventColors } from "../../utils/constant";
import moment from "moment";

const EventModal = ({ open, closeModal, actionActionBtn, event = [] }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();

  const [showGoogleMeetModal, setShowGoogleMeetModal] = useState(false);
  // Map of button names for simplicity
  const actionButtonNames = {
    all: "Join Meeting",
    upcoming: "Join Meeting",
    reschedule: "Join Meeting",
    completed: "Re-Create",
    cancelled: "Re-Create",
    draft: "Create Meeting",
  };

  // Determine the button name
  const actionButtonName = actionButtonNames[actionActionBtn] || "Join Meeting";

  const onSubmit = () => {
    if (["all", "upcoming", "reschedule"].includes(actionActionBtn)) {
      setShowGoogleMeetModal(true);
    } else if (["completed", "cancelled", "draft"].includes(actionActionBtn)) {
      navigate(`/edit-meeting?id=${event.id}&status=${actionActionBtn}`);
    }
  };

  return (
    <MuiModal
      modalOpen={open}
      modalClose={closeModal}
      title={event.title}
      rightIcon={event?.status !== "cancelled" ? EditIcon : undefined}
      onClick={() =>
        navigate(`/edit-meeting?id=${event.id}&status=${actionActionBtn}`)
      }
    >
      <div className="p-6 space-y-8">
        <div className="flex flex-col">
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">
                {event?.title || "Title Name"}
              </h2>
              <span className="text-slate-400 text-sm">
                {dateFormat(event?.start_date)} &nbsp; {moment(event.start, "HH:mm").format("hh:mm A")}{" "}
                - {moment(event.end, "HH:mm").format("hh:mm A")}
              </span>
            </div>
            <div>
              <span
                style={{ backgroundColor: eventColors[event?.status] }}
                className={`rounded-md p-1 text-white items-baseline`}
              >
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between ml-2">
            <div className="flex items-start justify-start gap-6">
              <div className="mt-1">
                <img src={DoubleAvatar} alt="" width={25} height={25} />
              </div>
              <div className="space-y-2">
                <p>{event.attendees.length} Mentees</p>
                <p className="text-slate-400 text-xs">
                  {event.attendees.length} Waiting
                </p>
              </div>
            </div>
            {/* <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200'>
              <img src={EditIcon} alt='' />
            </div> */}
          </div>

          <div className="space-y-3 ml-20 mt-3">
            {event &&
              event.attendees &&
              event.attendees.map((attendee, index) => (
                <div className="flex items-start gap-3">
                  <img src={DummyAvatar} alt="" width={25} height={25} />
                  <p>{attendee.full_name}</p>
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between ml-2">
            <div className="flex items-start justify-start gap-6">
              <div className="mt-1">
                <img src={DoubleAvatar} alt="" width={25} height={25} />
              </div>
              <div className="space-y-2">
                <p>{event?.guests?.length} Mentees</p>
                <p className="text-slate-400 text-xs">
                  {event?.guests?.length} Waiting
                </p>
              </div>
            </div>
            {/* <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200'>
              <img src={EditIcon} alt='' />
            </div> */}
          </div>

          <div className="space-y-3 ml-20 mt-3">
            {event &&
              event.guests &&
              event.guests.map((guest, index) => (
                <div className="flex items-center gap-3 justify-start">
                  <img src={DummyAvatar} alt="" width={25} height={25} />
                  <p>{guest}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-start gap-4">
          <img src={BellIcon} alt="" />
          <p>10 minutes before</p>
        </div>

        {/* Action buttons */}
        <div className="text-center space-x-4 mt-4">
          <MuiButton variant="outlined" onClick={closeModal} color="primary">
            Cancel
          </MuiButton>
          {["all", "upcoming", "reschedule"].includes(actionActionBtn) &&
            event.status !== "cancelled" && (
              <MuiButton
                variant="outlined"
                color="error"
                onClick={() => setDeleteModal(true)}
              >
                Delete
              </MuiButton>
            )}

          <MuiButton type="submit" onClick={onSubmit}>
            {actionButtonName}
          </MuiButton>
        </div>
      </div>

      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          itemId={event.id}
          closeModal={() => setDeleteModal(false)}
        />
      )}

      {showGoogleMeetModal && (
        <GMeetModal
          open={showGoogleMeetModal}
          event={event}
          closeModal={() => setShowGoogleMeetModal(false)}
        />
      )}
    </MuiModal>
  );
};

export default EventModal;
