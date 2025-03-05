import {
  useApproveJoinRequestMutation,
  useRejectJoinRequestMutation,
  useDeleteJoinRequestMutation,
  useSendTrainingReminderMutation,
  useStartBackgroundCheckMutation,
  useVerifyApplicationMutation,
} from "./requestAPI.service";

// Hook to provide all action handlers
export const useRequestActions = () => {
  // RTK Query mutation hooks
  const [approveRequest, { isLoading: isApproving }] = useApproveJoinRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectJoinRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteJoinRequestMutation();
  const [sendReminder, { isLoading: isSendingReminder }] = useSendTrainingReminderMutation();
  const [startBackgroundCheck, { isLoading: isStartingCheck }] = useStartBackgroundCheckMutation();
  const [verifyApplication, { isLoading: isVerifying }] = useVerifyApplicationMutation();

  // Action handlers
  const handleApprove = async (id) => {
    try {
      await approveRequest(id).unwrap();
      return { success: true, message: "Request approved successfully" };
    } catch (error) {
      console.error("Failed to approve request:", error);
      return { success: false, message: error.data?.message || "Failed to approve request" };
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id).unwrap();
      return { success: true, message: "Request rejected successfully" };
    } catch (error) {
      console.error("Failed to reject request:", error);
      return { success: false, message: error.data?.message || "Failed to reject request" };
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(id).unwrap();
      return { success: true, message: "Request deleted successfully" };
    } catch (error) {
      console.error("Failed to delete request:", error);
      return { success: false, message: error.data?.message || "Failed to delete request" };
    }
  };

  const handleSendReminder = async (id) => {
    try {
      await sendReminder(id).unwrap();
      return { success: true, message: "Reminder sent successfully" };
    } catch (error) {
      console.error("Failed to send reminder:", error);
      return { success: false, message: error.data?.message || "Failed to send reminder" };
    }
  };

  const handleStartBackgroundCheck = async (id) => {
    try {
      await startBackgroundCheck(id).unwrap();
      return { success: true, message: "Background check initiated successfully" };
    } catch (error) {
      console.error("Failed to start background check:", error);
      return { success: false, message: error.data?.message || "Failed to start background check" };
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyApplication(id).unwrap();
      return { success: true, message: "Application verified successfully" };
    } catch (error) {
      console.error("Failed to verify application:", error);
      return { success: false, message: error.data?.message || "Failed to verify application" };
    }
  };

  // Loading states for UI feedback
  const isActionLoading = 
    isApproving || 
    isRejecting || 
    isDeleting || 
    isSendingReminder || 
    isStartingCheck || 
    isVerifying;

  return {
    handleApprove,
    handleReject,
    handleDelete,
    handleSendReminder,
    handleStartBackgroundCheck,
    handleVerify,
    isActionLoading,
  };
};
