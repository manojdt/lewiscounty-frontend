import {
  createSlice
} from "@reduxjs/toolkit";

import {
  assignProgramTask,
  getMenteeJoinedInProgram,
  getMenteeProgramCount,
  getMenteePrograms,
  getMentees,
  getProgramCounts,
  getProgramMentees,
  getUserPrograms,
  updateProgram,
} from "../../services/userprograms";
import {
  programStatus
} from "../../utils/constant";
import {
  getProgramDetails
} from "../../services/programInfo";

const initialState = {
  allprograms: [],
  yettoapprove: [],
  yettojoin: [],
  yettostart: [],
  inprogress: [],
  completed: [],
  learning: [],
  cancelled: [],
  bookmarked: [],
  programsCounts: {},
  statusCounts: {
    yettoapprove: 0,
    yettojoin: 0,
    yettostart: 0,
    inprogress: 0,
    learning: 0,
    completed: 0,
    cancelled: 0,
  },
  totalPrograms: 0,
  programdetails: {},
  menteeList: [],
  programMenteeList: [],
  menteeJoined : true,
  status: "",
  loading: false,
  error: "",
};

export const userProgramSlice = createSlice({
  name: "userPrograms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getUserPrograms.fulfilled, (state, action) => {
        const {
          status_counts = {},
            overall_count = 0,
            programs = [],
            filterType,
            filterValue,
        } = action.payload;

        let updateState = {
          ...state,
          status: programStatus.load,
          loading: false,
          allprograms: [],
          yettoapprove: [],
          yettojoin: [],
          yettostart: [],
          inprogress: [],
          completed: [],
          cancelled: [],
          bookmarked: [],
        };

        console.log("action123", action.payload);
        if (filterType === "") {
          updateState.allprograms = programs;
        }

        if (filterType !== "") {
          const filtertype =
            filterType !== "is_bookmark" ? filterValue : "bookmarked";
          updateState[filtertype] = programs;
        }

        console.log("action.payload", action.payload);

        return updateState;
      })
      .addCase(getUserPrograms.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(updateProgram.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        console.log("update", action.payload);
        return {
          ...state,
          programdetails: action.payload.programdetails,
          status: action.payload.status,
          loading: false,
        };
      })
      .addCase(updateProgram.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
    builder
      .addCase(getProgramDetails.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getProgramDetails.fulfilled, (state, action) => {
        return {
          ...state,
          programdetails: action.payload,
          loading: false,
        };
      })
      .addCase(getProgramDetails.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
    builder
      .addCase(getMentees.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getMentees.fulfilled, (state, action) => {
        console.log("getMentees", action.payload);
        return {
          ...state,
          menteeList: action.payload,
          loading: false,
        };
      })
      .addCase(getMentees.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getProgramMentees.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getProgramMentees.fulfilled, (state, action) => {
        console.log("getMentees", action.payload);
        return {
          ...state,
          programMenteeList: action.payload,
          loading: false,
        };
      })
      .addCase(getProgramMentees.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
    builder
      .addCase(assignProgramTask.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(assignProgramTask.fulfilled, (state, action) => {
        return {
          ...state,
          status: programStatus.taskassigned,
          loading: false,
        };
      })
      .addCase(assignProgramTask.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getProgramCounts.pending, (state) => {
        return {
          ...state,
        };
      })
      .addCase(getProgramCounts.fulfilled, (state, action) => {
        console.log("getProgramCounts", action.payload);
        const {
          status_counts = {}, total_programs = 0
        } = action.payload;
        return {
          ...state,
          statusCounts: status_counts,
          totalPrograms: total_programs,
        };
      })
      .addCase(getProgramCounts.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });


    builder
      .addCase(getMenteePrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getMenteePrograms.fulfilled, (state, action) => {
        const {
          programs = [],
            filterType,
            filterValue,
        } = action.payload;

        let updateState = {
          ...state,
          status: programStatus.load,
          loading: false,
          allprograms: [],
          yettoapprove: [],
          yettojoin: [],
          yettostart: [],
          inprogress: [],
          completed: [],
          cancelled: [],
          bookmarked: [],
        };

        console.log("action123", action.payload);
        if (filterType === "") {
          updateState.allprograms = programs;
        }
        if (filterType !== '') {

          if (filterValue === 'curated') {
            updateState['yettojoin'] = programs;
          }

          if (filterValue === 'ongoing') {
            updateState['inprogress'] = programs;
          }

          if (filterValue === 'completed') {
            updateState['completed'] = programs;
          }

          if (filterValue === 'learning') {
            updateState['learning'] = programs;
          }

        }

        console.log("action.payload", action.payload);

        return updateState;
      })
      .addCase(getMenteePrograms.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });


      builder
      .addCase(getMenteeJoinedInProgram.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getMenteeJoinedInProgram.fulfilled, (state, action) => {
        console.log('cccccc', action)
        return {
          ...state,
          menteeJoined: action.payload.enroll,
          loading: false,
        };
      })
      .addCase(getMenteeJoinedInProgram.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });


      builder
      .addCase(getMenteeProgramCount.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(getMenteeProgramCount.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          programsCounts: action.payload,
        };
      })
      .addCase(getMenteeProgramCount.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,

        };
      })

  },
});

export default userProgramSlice.reducer;