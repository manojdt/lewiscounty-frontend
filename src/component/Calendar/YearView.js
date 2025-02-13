import React from "react";
import { getYearMonths } from "../../utils";
import Months from "./Months";

export default function YearView({
  currentDate,
  savedEvents,
  fetchEvents,
  deleteAppointment,
  newData
}) {
  const monthsOfYear = getYearMonths(currentDate);
  
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {monthsOfYear.map((month, idx) => (
        <Months
          key={idx}
          month={month}
          savedEvents={savedEvents}
          fetchEvents={fetchEvents}
          deleteAppointment={deleteAppointment}
          newData={newData}
        />
      ))}
    </div>
  );
}