import {
    createAction,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "./api";


export const getprogramRequest = createAsyncThunk(
    "getprogramRequest",
    async (query = '') => {
        let queryString = new URLSearchParams(query).toString()

        const programRequests = await api.get(`program_request/program_requests?${queryString}`);
        if (programRequests.status === 200 && programRequests.data) {
            return programRequests.data;
        }
        // console.log(programRequests,3434343)
        return programRequests;
    }
);
export const getlearningAccessRequest = createAsyncThunk(
    "getlearningAccessRequest",
    async (query = '') => {
        let queryString = new URLSearchParams(query).toString()

        const learningAccessRequests = await api.get(`resource-request/?${queryString}`);
        // console.log("learningAccessRequests ==>", learningAccessRequests)
        if (learningAccessRequests.status === 200 && learningAccessRequests.data) {
            return learningAccessRequests.data;
        }
        // console.log(learningAccessRequests,34242342)
        return learningAccessRequests;
    }
);


export const getResourceRequest = createAsyncThunk(
    "getResourceRequest",
    async (query = '') => {
        let queryString = new URLSearchParams(query).toString()

        const resourceRequests = await api.get(`resource-request/?${queryString}`);
        if (resourceRequests.status === 200 && resourceRequests.data) {
            return resourceRequests.data;
        }
        return resourceRequests;
    }
);


export const updateLocalRequest = createAction('update/updateRequest')

export const updateProgramRequest = createAsyncThunk(
    "updateProgramRequest",
    async (data) => {
        const updateProgramReq = await api.put('program_request/update-program-request-status', data);
        if (updateProgramReq.status === 200 && updateProgramReq.data) {
            return updateProgramReq.data;
        }
        return updateProgramReq;
    }
);
export const certificateRequest = createAsyncThunk(
    "certificateRequest",
    async (query = "") => {
        const url = query?.filterStatus?.length ? `certificate/certificate_request?status=${query?.filterStatus}&type=request&page=${query?.page}&limit=${query?.limit}` :
        `certificate/certificate_request?type=request&page=${query?.page}&limit=${query?.limit}`
        const certificateReq = await api.get(url);
        if (certificateReq.status === 200 && certificateReq.data) {
            return certificateReq.data;
        }
        return certificateReq;
    }
);
export const updateCertificateRequest = createAsyncThunk(
    "updateCertificateRequest",
    async (queryString) => {
        const updateCertificateReq = await api.put(`certificate/certificate_request`,queryString);
        if (updateCertificateReq.status === 200 && updateCertificateReq.data) {
            return updateCertificateReq.data;
        }
        return updateCertificateReq;
    }
);


export const updateProgramMenteeRequest = createAsyncThunk(
    "updateProgramMenteeRequest",
    async (data) => {
        const updateProgramMenteeReq = await api.post('program_request/program-request-mentee', data);
        if (updateProgramMenteeReq.status === 200 && updateProgramMenteeReq.data) {
            return updateProgramMenteeReq.data;
        }
        return updateProgramMenteeReq;
    }
);



export const goalsRequest = createAsyncThunk(
    "goalsRequest",
    async (query) => {
        let queryString = new URLSearchParams(query).toString()
        const goalsRequestInfo = await api.get(`goals/goal-request?${queryString}`);
        if (goalsRequestInfo.status === 200 && goalsRequestInfo.data) {
            return goalsRequestInfo.data;
        }
        return goalsRequestInfo;
    }
);


export const updateGoalRequest = createAsyncThunk(
    "updateGoalRequest",
    async (data) => {
        const updateGoalRequestInfo = await api.post('goals/goal-request-status', data);
        if (updateGoalRequestInfo.status === 200 && updateGoalRequestInfo.data) {
            return updateGoalRequestInfo.data;
        }
        return updateGoalRequestInfo;
    }
);


export const getCategoryList = createAsyncThunk(
    "getCategoryList",
    async () => {
       
        const getCategoryInfo = await api.get('user/accept_member');
        if (getCategoryInfo.status === 200 && getCategoryInfo.data) {
            return getCategoryInfo.data;
        }
        return getCategoryInfo;
    }
);



export const getMemberRequest = createAsyncThunk(
    "getMemberRequest",
    async (query='') => {
        let queryString = new URLSearchParams(query).toString()
        const getMemberInfo = await api.get(`user/join_request?${queryString}&page=${query?.page ?? 1}&limit=${query?.limit ?? 10}`);
        if (getMemberInfo.status === 200 && getMemberInfo.data) {
            return getMemberInfo.data;
        }
        return getMemberInfo;
    }
);


export const updateMemberRequest = createAsyncThunk(
    "updateMemberRequest",
    async (data) => {
        const updateMemberInfo = await api.post('user/accept_member', data);
        if (updateMemberInfo.status === 200 && updateMemberInfo.data) {
            return updateMemberInfo.data;
        }
        return updateMemberInfo;
    }
);


export const cancelMemberRequest = createAsyncThunk(
    "cancelMemberRequest",
    async (data) => {
        const cancelMemberInfo = await api.post('user/cancle_member', data);
        if (cancelMemberInfo.status === 200 && cancelMemberInfo.data) {
            return cancelMemberInfo.data;
        }
        return cancelMemberInfo;
    }
);



export const programRescheduleRequest = createAsyncThunk(
    "programRescheduleRequest",
    async (data) => {
        const programRescheduleRequestInto = await api.post('program_request/program-reschedule', data);
        if (programRescheduleRequestInto.status === 200 && programRescheduleRequestInto.data) {
            return programRescheduleRequestInto.data;
        }
        return programRescheduleRequestInto;
    }
);


export const programCancelRequest = createAsyncThunk(
    "programCancelRequest",
    async (data) => {
        const programCancelRequestInfo = await api.post('program_request/program-cancel', data);
        if (programCancelRequestInfo.status === 200 && programCancelRequestInfo.data) {
            return programCancelRequestInfo.data;
        }
        return programCancelRequestInfo;
    }
);


export const updateMentorAutoApproval = createAsyncThunk(
    "updateMentorAutoApproval",
    async (data) => {
        const updateAutoApproval = await api.put('program_request/update_start_auto_approval_status', data);
        if (updateAutoApproval.status === 200 && updateAutoApproval.data) {
            return updateAutoApproval.data;
        }
        return updateAutoApproval;
    }
);


export const getReportRequest = createAsyncThunk(
    "getReportRequest",
    async (query='') => {
        let queryString = new URLSearchParams(query).toString()
        const getReportRequestInfo = await api.get(`program_request/report_request?${queryString}&page=${query?.page ?? 1}&limit=${query?.limit ?? 10}`);
        if (getReportRequestInfo.status === 200 && getReportRequestInfo.data) {
            return getReportRequestInfo.data;
        }
        return getReportRequestInfo;
    }
);


export const updateReportRequest = createAsyncThunk(
    "updateReportRequest",
    async (data) => {
        const updateReportRequestInfo = await api.put(`program_request/update_report_request`, data);
        if (updateReportRequestInfo.status === 200 && updateReportRequestInfo.data) {
            return updateReportRequestInfo.data;
        }
        return updateReportRequestInfo;
    }
);
