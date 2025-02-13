import dayjs from 'dayjs';
import ArrowLeftIcon from '../../assets/icons/arroLeft.svg';
import ArrowRightIcon from '../../assets/icons/arroRight.svg';
import { Button } from '../../shared';

const CalendarHeader = ({
  viewList,
  currentCalendarView,
  handleCalendarView,
  onIncrement,
  onDecrement,
  currentDate,
}) => {
  const calendarLabelDisplay = () => {
    if (currentCalendarView === 'Month') {
      return dayjs(currentDate).format('MMM YYYY');
    }

    if (currentCalendarView === 'Week') {
      let startOfWeek = dayjs(currentDate).startOf('week');
      let endOfWeek = dayjs(startOfWeek).add(6, 'day');

      return `${dayjs(startOfWeek).format('DD MMM YY')} - ${dayjs(
        endOfWeek
      ).format('DD MMM YY')}`;
    }

    if (currentCalendarView === 'Year') {
      return dayjs(currentDate).format('YYYY');
    }

    if (currentCalendarView === 'Today' || currentCalendarView === 'day') {
      const todayDate = dayjs();

      if (
        dayjs(todayDate).format('YYYY-MM-DD') ===
        dayjs(currentDate).format('YYYY-MM-DD')
      ) {
        return 'Today';
      }

      if (
        dayjs(todayDate).subtract(1, 'day').format('YYYY-MM-DD') ===
        dayjs(currentDate).format('YYYY-MM-DD')
      ) {
        return 'Yesterday';
      }

      if (
        dayjs(todayDate).add(1, 'day').format('YYYY-MM-DD') ===
        dayjs(currentDate).format('YYYY-MM-DD')
      ) {
        return 'Tomorrow';
      }

      return dayjs(currentDate).format('YYYY-MM-DD');
    }
  };

  return (
    <div>
    <div className='flex flex-row items-center justify-between mb-4'>
      <div className='flex gap-0 sm:gap-0 md:gap-3 lg:gap-6 xl:gap-6'>
      <div className="flex">
          {/* Left Arrow */}
          <div
            className="border border-gray-500 p-2 sm:p-3 md:p-4 lg:p-4 cursor-pointer"
            onClick={onDecrement}
          >
            <img
              src={ArrowLeftIcon}
              alt="ArrowLeftIcon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-3 lg:h-3" // Responsive image size
            />
          </div>

          {/* Right Arrow */}
          <div
            className="border border-gray-500 p-2 sm:p-3 md:p-4 lg:p-4 cursor-pointer"
            onClick={onIncrement}
          >
            <img
              src={ArrowRightIcon}
              alt="ArrowRightIcon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-3 lg:h-3" // Responsive image size
            />
          </div>
        </div>
        <div className='hidden sm:hidden md:block lg:block xl:block self-center'>
          <Button btnName='Today' />
        </div>
      </div>
      <div>
        <div className='flex items-center justify-center text-[18px]'>
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
      <div className='flex flex-row p-2 space-x-5'>
        {viewList.map((view, idx) => {
          return (
            <p
              key={view + idx}
              onClick={() => handleCalendarView(view)}
              style={{
                color: `${
                  view === currentCalendarView
                    ? 'rgba(29, 91, 191, 1)'
                    : 'rgba(24, 40, 61, 1)'
                }`,
              }}
              className={`${
                view === currentCalendarView
                  ? 'border-b-2 border-teal-600  text-xs'
                  : 'text-xs'
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
    {/* <div className='block sm:block md:hidden lg:hidden xl:hidden self-center'>
    <Button btnName='Today' />
    </div> */}
</div>
  );
};

export default CalendarHeader;
