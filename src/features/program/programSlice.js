import {
    createSlice
} from "@reduxjs/toolkit";
import {
    createNewProgram,
    createProgram,
    getAllPrograms,
    getProgramDetails,
    loadAllPrograms,
    updateAllPrograms,
    updateNewPrograms,
    updateProgramDetails,
} from "../../services/programInfo";
import {
    programStatus,
    userStatus
} from '../../utils/constant'

const initialState = {
    allPrograms: [],
    programDetails: {},
    createdPrograms: [],
    loading: false,
    status: '',
    error: ''
};

export const programSlice = createSlice({
    name: "programsInfo",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPrograms.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(getAllPrograms.fulfilled, (state, action) => {
                return {
                    ...state,
                    allPrograms: action.payload,
                    status: userStatus.create,
                    loading: false
                };
            })
            .addCase(getAllPrograms.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })
        builder
            .addCase(getProgramDetails.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(getProgramDetails.fulfilled, (state, action) => {
                return {
                    ...state,
                    programDetails: action.payload,
                    status: userStatus.create,
                    loading: false
                };
            })
            .addCase(getProgramDetails.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })
        builder
            .addCase(createProgram.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(createProgram.fulfilled, (state, action) => {
                return {
                    ...state,
                    programDetails: action.payload,
                    status: userStatus.create,
                    loading: false
                };
            })
            .addCase(createProgram.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })
        builder.addCase(loadAllPrograms.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(loadAllPrograms.fulfilled, (state, action) => {
                return {
                    ...state,
                    allPrograms: action.payload,
                    loading: false
                };
            })
            .addCase(loadAllPrograms.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })
        builder.addCase(updateAllPrograms.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(updateAllPrograms.fulfilled, (state, action) => {
                return {
                    ...state,
                    allPrograms: action.payload,
                    status: programStatus.create,
                    loading: false
                };
            })
            .addCase(updateAllPrograms.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })

        builder.addCase(createNewProgram.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(createNewProgram.fulfilled, (state, action) => {
                return {
                    ...state,
                    allPrograms: action.payload,
                    status: programStatus.create,
                    loading: false
                };
            })
            .addCase(createNewProgram.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })

        builder.addCase(updateNewPrograms.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(updateNewPrograms.fulfilled, (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                    loading: false
                };
            })
            .addCase(updateNewPrograms.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })

        builder.addCase(updateProgramDetails.pending, (state) => {
                return {
                    ...state,
                    loading: true
                };
            })
            .addCase(updateProgramDetails.fulfilled, (state, action) => {
                return {
                    ...state,
                    programDetails: action.payload,
                    loading: false
                };
            })
            .addCase(updateProgramDetails.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            })


    },
});


export default programSlice.reducer;