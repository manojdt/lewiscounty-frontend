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
      query: ({ apiData, eventSelect, id, status }) => {
        const params = new URLSearchParams({ id });
        if (status !== "draft") {
          params.append("option", eventSelect);
        }
        return {
          url: `/calendar_meeting/meeting?${params.toString()}`,
          method: status === "draft" ? "POST" : "PUT",
          body: apiData,
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
