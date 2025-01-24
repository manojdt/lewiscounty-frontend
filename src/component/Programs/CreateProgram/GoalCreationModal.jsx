import React, { useEffect } from "react";
import { MuiCustomModal } from "../../../shared/Modal/MuiCustomModal";
import { useCreateGoalMutation } from "../../../features/goals/goalsApi.services";
import SuccessTik from '../../../assets/images/blue_tik1x.png';

const GoalCreationModal = (props) => {
  const [description, setDescription] = React.useState("");
  const [showBackdrop, setShowBackdrop] = React.useState(false);

  const [
    createGoals,
    {
      isLoading: isGoalsCreating,
      isSuccess: isGoalsCreated,
      isError: IsErrorGoalsCreating,
      data,
      reset,
    },
  ] = useCreateGoalMutation();
  const { isOpen, handleCloseModal } = props;
  const handleGoalCreate = () => {
    createGoals({ description, goal_name: description });
  };
  useEffect(() => {
    if (isGoalsCreated || IsErrorGoalsCreating) {
      setShowBackdrop(true);

      // Set timeout to handle cleanup after 3 seconds
      const timer = setTimeout(() => {
        // Reset all states
        setShowBackdrop(false);

        // Only navigate on success cases
        if (isGoalsCreated) {
          handleCloseModal();
          setDescription("");
        }
      }, 3000);
      return () => {
        clearTimeout(timer);
        reset();
      };
    }
  }, [IsErrorGoalsCreating, isGoalsCreated]);

  return (
    <>
      <MuiCustomModal
        hideBackdrop
        dialogTitle={"Create Goal"}
        open={isOpen}
        handleClose={handleCloseModal}
        maxWidth="sm"
        actionButtons={[
          {
            color: "inherit",
            variant: "outlined",
            children: "Cancel",
            disabled: isGoalsCreating,
            onClick: handleCloseModal,
          },
          {
            color: "primary",
            variant: "contained",
            disabled: isGoalsCreating,
            children: isGoalsCreating ? "Creating..." : "Create",
            onClick: handleGoalCreate,
          },
        ]}
      >
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2 mt-5">
          Goal Name
        </label>
        <textarea
          rows={"4"}
          className={`block p-2.5 input-bg w-full text-sm text-gray-900 border focus-visible:outline-none focus-visible:border-none h-[182px]`}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </MuiCustomModal>
      <MuiCustomModal
        PaperProps={{
          sx: {
            background: "rgba(249, 249, 249, 1)",
          },
        }}
        open={showBackdrop}
        maxWidth="sm"
        onClose={() => setShowBackdrop(false)}
      >
        <div className="px-5 py-1 flex justify-center items-center h-[250px] w-full">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20 w-full"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              {data?.message}
            </p>
          </div>
        </div>
      </MuiCustomModal>
    </>
  );
};

export default GoalCreationModal;
