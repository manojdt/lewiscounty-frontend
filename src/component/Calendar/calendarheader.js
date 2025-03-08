import dayjs from "dayjs";
import ArrowLeftIcon from "../../assets/icons/arroLeft.svg";
import ArrowRightIcon from "../../assets/icons/arroRight.svg";
import { Button } from "../../shared";
import { useTheme } from "@mui/material";

const CalendarHeader = ({
  viewList,
  currentCalendarView,
  handleCalendarView,
  onIncrement,
  onDecrement,
  onToday,
  currentDate,
}) => {
  const customDateFormat="MM-DD-YYYY"
  const {
    palette: {
      primary: { main },
    },
  } = useTheme();
  const calendarLabelDisplay = () => {
    if (currentCalendarView === "Month") {
      return dayjs(currentDate).format("MMM YYYY");
    }

    if (currentCalendarView === "Week") {
      let startOfWeek = dayjs(currentDate).startOf("week");
      let endOfWeek = dayjs(startOfWeek).add(6, "day");

      return `${dayjs(startOfWeek).format("DD MMM YY")} - ${dayjs(
        endOfWeek
      ).format("DD MMM YY")}`;
    }

    if (currentCalendarView === "Year") {
      return dayjs(currentDate).format("YYYY");
    }

    if (currentCalendarView === "Day") {
      const todayDate = dayjs();

      if (
        dayjs(todayDate).format(customDateFormat) ===
        dayjs(currentDate).format(customDateFormat)
      ) {
        return "Today";
      }

      if (
        dayjs(todayDate).subtract(1, "day").format(customDateFormat) ===
        dayjs(currentDate).format(customDateFormat)
      ) {
        return "Yesterday";
      }

      if (
        dayjs(todayDate).add(1, "day").format(customDateFormat) ===
        dayjs(currentDate).format(customDateFormat)
      ) {
        return "Tomorrow";
      }

      return dayjs(currentDate).format(customDateFormat);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex gap-6">
        <div className="flex">
          <div
            style={{
              border: "1px solid rgba(62, 62, 62, 0.5)",
              padding: "10px 20px",
              cursor: "pointer",
            }}
            onClick={onDecrement}
          >
            <img src={ArrowLeftIcon} alt="ArrowLeftIcon" />
          </div>
          <div
            style={{
              border: "1px solid rgba(62, 62, 62, 0.5)",
              padding: "10px 20px",
              cursor: "pointer",
            }}
            onClick={onIncrement}
          >
            <img src={ArrowRightIcon} alt="ArrowRightIcon" />
          </div>
        </div>
        <Button btnName="Today" onClick={onToday} />
      </div>
      <div>
        <div className="flex items-center justify-center text-[18px]">
          {calendarLabelDisplay()}
        </div>
      </div>

      {/* <div className="flex flex-row items-center space-x-3 p-2 rounded shadow-sm w-fit" style={{border: '1px solid rgba(62, 62, 62, 0.5)'}}>
        <button
          onClick={onDecrement}
          className="text-teal-600 hover:bg-teal-600 hover:text-white p-1 py-0 rounded-md"
        >{`<`}</button>
        <div className="text-center text-teal-600 text-xs">
          {calendarLabelDisplay()}
        </div>
        <button
          onClick={onIncrement}
          className="text-teal-600 hover:bg-teal-600 hover:text-white p-1 py-0 rounded-md"
        >{`>`}</button>
      </div> */}
      <div className="flex flex-row p-2 space-x-5">
        {viewList.map((view, idx) => {
          return (
            <p
              key={view + idx}
              onClick={() => handleCalendarView(view)}
              style={{
                color: `${
                  view === currentCalendarView ? main : "rgba(24, 40, 61, 1)"
                }`,
              }}
              className={`${
                view === currentCalendarView
                  ? "border-b-2 border-background-primary-main  text-xs"
                  : "text-xs"
              }
                   cursor-pointer`}
            >
              {view}
            </p>
          );
        })}
      </div>
      {/* {currentCalendarView !== "Today" && ( */}

      {/* )} */}
    </div>
  );
};

export default CalendarHeader;
