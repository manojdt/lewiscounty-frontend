import { createSlice } from "@reduxjs/toolkit";
import {
  createNewProgram,
  createNewPrograms,
  createProgram,
  editUpdateProgram,
  getAllCategories,
  getAllCertificates,
  getAllMaterials,
  getAllMembers,
  getAllPrograms,
  getAllSkills,
  getProgramDetails,
  getProgramsByCategory,
  loadAllPrograms,
  updateAllPrograms,
  updateNewPrograms,
  updateProgramDetails,
} from "../../services/programInfo";
import { programStatus, userStatus } from "../../utils/constant";

const initialState = {
  allPrograms: [],
  programDetails: {},
  createdPrograms: [],
  category: [],
  materials: [],
  certificate: [],
  members: [],
  skills: [],
  categoryPrograms: [],
  loading: false,
  status: "",
  error: "",
};

export const programSlice = createSlice({
  name: "programsInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        return {
          ...state,
          allPrograms: action.payload,
          status: userStatus.create,
          loading: false,
        };
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
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
          programDetails: action.payload,
          status: userStatus.create,
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
      .addCase(createProgram.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        return {
          ...state,
          programDetails: action.payload,
          status: userStatus.create,
          loading: false,
        };
      })
      .addCase(createProgram.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(createNewPrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(createNewPrograms.fulfilled, (state, action) => {
        const responseStatus = action.payload.status;
        const status =
          responseStatus === 200
            ? programStatus.exist
            : responseStatus === 500
            ? programStatus.error
            : responseStatus === 201
            ? programStatus.create
            : "";

        return {
          ...state,
          status: status,
          loading: false,
        };
      })
      .addCase(createNewPrograms.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });




      builder
      .addCase(editUpdateProgram.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(editUpdateProgram.fulfilled, (state, action) => {
        const responseStatus = action.payload.status;
        const status =
          responseStatus === 200 || responseStatus === 201
            ? programStatus.update
            : responseStatus === 500
            ? programStatus.error
            : "";

        return {
          ...state,
          status: status,
          loading: false,
        };
      })
      .addCase(editUpdateProgram.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });




    builder
      .addCase(loadAllPrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(loadAllPrograms.fulfilled, (state, action) => {
        return {
          ...state,
          allPrograms: action.payload,
          loading: false,
        };
      })
      .addCase(loadAllPrograms.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
    builder
      .addCase(updateAllPrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(updateAllPrograms.fulfilled, (state, action) => {
        return {
          ...state,
          allPrograms: action.payload,
          status: programStatus.create,
          loading: false,
        };
      })
      .addCase(updateAllPrograms.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(createNewProgram.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(createNewProgram.fulfilled, (state, action) => {
        return {
          ...state,
          allPrograms: action.payload,
          status: programStatus.create,
          loading: false,
        };
      })
      .addCase(createNewProgram.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(updateNewPrograms.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(updateNewPrograms.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
        };
      })
      .addCase(updateNewPrograms.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getAllCategories.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        return {
          ...state,
          category: action.payload,
          loading: false,
        };
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getAllMaterials.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllMaterials.fulfilled, (state, action) => {
        return {
          ...state,
          materials: action.payload,
          loading: false,
        };
      })
      .addCase(getAllMaterials.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getAllCertificates.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllCertificates.fulfilled, (state, action) => {
        return {
          ...state,
          certificate: action.payload,
          loading: false,
        };
      })
      .addCase(getAllCertificates.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getProgramsByCategory.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getProgramsByCategory.fulfilled, (state, action) => {
        return {
          ...state,
          categoryPrograms: action.payload,
          status: userStatus.categoryPrograms,
          loading: false,
        };
      })
      .addCase(getProgramsByCategory.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getAllSkills.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllSkills.fulfilled, (state, action) => {
        return {
          ...state,
          skills: action.payload,
          loading: false,
        };
      })
      .addCase(getAllSkills.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(getAllMembers.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllMembers.fulfilled, (state, action) => {
        return {
          ...state,
          members: action.payload,
          loading: false,
        };
      })
      .addCase(getAllMembers.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

      // builder.addCase(updateLocalProgram)
  },
});

export default programSlice.reducer;
