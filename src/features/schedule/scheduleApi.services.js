import { rtkQueryApiServices, rtkQueryServiceTags } from "../../services/api";

const { CALENDAR } = rtkQueryServiceTags;

export const calendarApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEvents: builder.query({
      query: () => "/calendar_meeting/meeting",
      providesTags: [CALENDAR],
    }),

    getCalendarEvent: builder.query({
      query: (params) => ({
        url: `/calendar_meeting/meeting`,
        params,
      }),
      providesTags: [CALENDAR],
    }),

    getCalendarFilterEvents: builder.query({
      query: (params) => ({
        url: `/calendar_meeting/meeting`,
        params,
      }),
      providesTags: [CALENDAR],
    }),

    createCalendarEvent: builder.mutation({
      query: (data) => ({
        url: "/calendar_meeting/meeting",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [CALENDAR],
    }),

    updateCalendarEvent: builder.mutation({
      query: ({ apiData, eventSelect }) => {
        const isDraft = "status" in apiData && apiData?.status === "draft";
        let params = { id: apiData?.id };
        if (!isDraft) {
          params = { ...params, option: eventSelect };
        }
        return {
          url: `/calendar_meeting/meeting`,
          method: isDraft === "draft" ? "POST" : "PUT",
          body: apiData,
          params,
        };
      },
      invalidatesTags: [CALENDAR],
    }),

    deleteCalendarEvent: builder.mutation({
      query: ({ selectedOption, itemId }) => ({
        url: `/calendar_meeting/meeting?option=${selectedOption}&id=${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: [CALENDAR],
    }),
  }),
});

export const {
  useGetCalendarEventsQuery,
  useGetCalendarEventQuery,
  useGetCalendarFilterEventsQuery,
  useCreateCalendarEventMutation,
  useUpdateCalendarEventMutation,
  useDeleteCalendarEventMutation,
} = calendarApi;
