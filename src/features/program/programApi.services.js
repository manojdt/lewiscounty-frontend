import { rtkQueryApiServices, rtkQueryServiceTags } from "../../services/api";

const { PROGRAM_LAUNCH } = rtkQueryServiceTags;

// Helper function to build query string
const buildQueryString = (query) => {
  let queryParams = "";

  if (query.value === "planned") {
    query = { ...query, value: "yettojoin" };
  }

  if (query && Object.keys(query).length) {
    if (query.type) {
      queryParams =
        (queryParams === "" ? "?" : "&") + `${query.type}=${query.value}`;
    }
    if (query.page) {
      queryParams =
        (queryParams === "" ? "?" : `${queryParams}&`) +
        `${query.page}=${query.number}`;
    }
    if (query.search) {
      queryParams =
        (queryParams === "" ? "?" : `${queryParams}&`) +
        `${query.search.search}=${query.search.value}`;
    }
    if (query.date) {
      queryParams =
        (queryParams === "" ? "?" : `${queryParams}&`) +
        `${query.date.date}=${query.date.value}`;
    }
    if (query.category_id) {
      queryParams =
        (queryParams === "" ? "?" : `${queryParams}&`) +
        `category_id=${query.category_id}`;
    }
  }

  return queryParams !== "" ? `${queryParams}&limit=6` : "?limit=6";
};

export const programsApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    getAllPrograms: builder.query({
      query: (query = {}) => {
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) =>
              !(key === "search" && value.trim().length === 0) &&
              !(key === "status" && value === "all")
          )
        );
        const queryString = new URLSearchParams(filteredQuery).toString();
        return {
          url: `/programs?${queryString}`,
        };
      },
    }),

    // Create new program
    createProgram: builder.mutation({
      query: ({ bodyFormData, role }) => ({
        url: role ? "program/admin-program" : "programs",
        method: "POST",
        body: bodyFormData,
      }),
    }),

    // Update program
    updateProgram: builder.mutation({
      query: ({ program_id, bodyFormData, role }) => ({
        url: role
          ? `program/admin-program/${program_id}`
          : `programs/${program_id}`,
        method: "PUT",
        body: bodyFormData,
      }),
    }),

    // Get all categories
    getAllCategories: builder.query({
      query: () => "category",
    }),

    // Get materials by category
    getMaterials: builder.query({
      query: (categoryId) => `materials?category_id=${categoryId}`,
    }),

    // Get certificates by category
    getCertificates: builder.query({
      query: (categoryId) => `certificate?category_id=${categoryId}`,
    }),

    // Get skills by category
    getSkills: builder.query({
      query: (categoryId) => `skills?category_id=${categoryId}`,
    }),

    // Get members by category
    getMembers: builder.query({
      query: (categoryId) => `members?category_id=${categoryId}`,
    }),

    // Get all mentors
    getAllMentors: builder.query({
      query: () =>
        "members/member-list?role_name=mentor&page=1&limit=100&status=active",
    }),

    // Get programs by category
    getProgramsByCategory: builder.query({
      query: (categoryId) =>
        `program_task_assign/list_program?id=${categoryId}`,
    }),

    // Get program mentees
    getProgramMentees: builder.query({
      query: (programId) => `program/participates?program_id=${programId}`,
    }),

    // Validate program name
    validateProgramName: builder.query({
      query: ({ program_name, program_id }) =>
        `programs/validate_program_name?program_name=${program_name}${
          program_id ? `&program_id=${program_id}` : ""
        }`,
    }),

    // Get program list with category
    getProgramListWithCategory: builder.query({
      query: (categoryId) =>
        `/program/completed-program-list?category_id=${categoryId}&type=task`,
    }),
    // Programs
    getUserPrograms: builder.query({
      query: (query) => ({
        url: `programs${buildQueryString(query)}`,
        transformResponse: (response) => ({
          ...response,
          filterType: query?.type || "",
          filterValue: query?.value || "",
        }),
      }),
    }),

    getAllProgramDetails: builder.query({
      query: () => "program/admin-program",
      transformResponse: (response) => response.program,
    }),

    // Get program details
    getProgramDetailsById: builder.query({
      query: ({ id, requestId, role }) => ({
        url:
          role === "admin"
            ? `program/admin-program/${id}`
            : `programs/${id}${requestId ? `?request_id=${requestId}` : ""}`,
      }),
      providesTags: [PROGRAM_LAUNCH],
    }),

    getSpecificProgramDetails: builder.query({
      query: ({ id, requestId = "" }) =>
        `programs/${id}?request_id=${requestId}`,
      transformResponse: (response) => response.program,
    }),

    launchProgram: builder.mutation({
      query: (data) => ({
        url: "request/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [PROGRAM_LAUNCH],
    }),

    acceptProgram: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `request/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Program Counts and Statistics
    getProgramCounts: builder.query({
      query: (query) => {
        if (!query || Object.keys(query).length === 0) {
          return "program_status_count";
        }
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) =>
              !(key === "search" && value.trim().length === 0) &&
              !(key === "status" && value === "all")
          )
        );
        const queryString = new URLSearchParams(filteredQuery).toString();
        return `program_status_count?${queryString}`;
      },
    }),

    // Mentees
    getMentees: builder.query({
      query: () => "mentees",
    }),

    getProgramTaskMentees: builder.query({
      query: (id = "") => `program/participates?program_id=${id}`,
    }),

    getMenteePrograms: builder.query({
      query: (query) => ({
        url: `programs${buildQueryString(query)}`,
        transformResponse: (response) => ({
          ...response,
          filterType: query?.type || "",
          filterValue: query?.value || "",
        }),
      }),
    }),

    // Program Tasks
    assignProgramTask: builder.mutation({
      query: (data) => ({
        url: "program_task_assign/create_task",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    updateProgramTask: builder.mutation({
      query: (data) => ({
        url: "program_task_assign/mentortask",
        method: "PATCH",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    startProgramTask: builder.mutation({
      query: (data) => ({
        url: "program_task_assign/task_start",
        method: "PATCH",
        body: data,
      }),
    }),

    getProgramTaskDetails: builder.query({
      query: (taskId) =>
        `program_task_assign/task_submission${
          taskId ? `?task_id=${taskId}` : ""
        }`,
    }),

    submitProgramTask: builder.mutation({
      query: (data) => ({
        url: "program_task_assign/task_submission",
        method: "POST",
        body: data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    updateTaskSubmission: builder.mutation({
      query: (data) => ({
        url: "/program_task_assign/task_submission",
        method: "PUT",
        body: data,
      }),
    }),

    // Other endpoints
    getChartProgramList: builder.query({
      query: (filterBy) => `program-performance?filter_by=${filterBy}`,
    }),

    updateProgramImage: builder.mutation({
      query: (data) => ({
        url: "programs",
        method: "PATCH",
        body: data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    getMenteeJoinedInProgram: builder.mutation({
      query: (data) => ({
        url: "mentee_program/enroll_check",
        method: "POST",
        body: data,
      }),
    }),

    menteeJoinProgram: builder.mutation({
      query: (data) => ({
        url: "mentee_program/join_program",
        method: "POST",
        body: data,
      }),
    }),

    getMenteeProgramCount: builder.query({
      query: (query) => {
        if (!query || Object.keys(query).length === 0) {
          return "mentee_program/count_program";
        }
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) =>
              !(key === "search" && value.trim().length === 0) &&
              !(key === "status" && value === "all")
          )
        );
        return `mentee_program/count_program?${new URLSearchParams(
          filteredQuery
        ).toString()}`;
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUserProgramsQuery,
  useGetAllProgramDetailsQuery,
  useGetProgramDetailsByIdQuery,
  useGetSpecificProgramDetailsQuery,
  useUpdateProgramMutation,
  useLaunchProgramMutation,
  useAcceptProgramMutation,
  useGetProgramCountsQuery,
  useGetMenteesQuery,
  useGetProgramTaskMenteesQuery,
  useGetMenteeProgramsQuery,
  useAssignProgramTaskMutation,
  useUpdateProgramTaskMutation,
  useStartProgramTaskMutation,
  useGetProgramTaskDetailsQuery,
  useSubmitProgramTaskMutation,
  useUpdateTaskSubmissionMutation,
  useGetChartProgramListQuery,
  useUpdateProgramImageMutation,
  useGetMenteeJoinedInProgramMutation,
  useMenteeJoinProgramMutation,
  useGetMenteeProgramCountQuery,
  useGetAllProgramsQuery,
  useCreateProgramMutation,
  useGetAllCategoriesQuery,
  useGetMaterialsQuery,
  useGetCertificatesQuery,
  useGetSkillsQuery,
  useGetMembersQuery,
  useGetAllMentorsQuery,
  useGetProgramsByCategoryQuery,
  useGetProgramMenteesQuery,
  useValidateProgramNameQuery,
  useGetProgramListWithCategoryQuery,
} = programsApi;
