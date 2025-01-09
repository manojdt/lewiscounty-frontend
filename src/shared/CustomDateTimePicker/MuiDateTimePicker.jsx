import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";

const CustomDateTimePicker = ({
    value,
    onChange,
    disabled,
    minDate,
    maxDate,
    name,
    error,
    helperText,
  }) => {
    // Function to validate time
    const shouldDisableTime = (value, view) => {
        if (!value || !minDate) return false;
        
        // If it's the minimum date, check time constraints
        const valueStart = moment(value).startOf('day');
        const minDateStart = moment(minDate).startOf('day');
        
        if (valueStart.isSame(minDateStart)) {
          const minTime = moment(minDate);
          
          if (view === 'hours') {
            return value.hours() < minTime.hours();
          }
          
          if (view === 'minutes' && value.hours() === minTime.hours()) {
            return value.minutes() < minTime.minutes();
          }
        }
        
        return false;
      };
    
  
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          value={value ? new Date(value) : null}
          onChange={(newValue) => {
            onChange(newValue?.toISOString());
          }}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          shouldDisableTime={shouldDisableTime}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error?.message,
              className: `w-full ${disabled ? 'bg-slate-300' : 'input-bg'} h-[60px]`
            }
          }}
        />
      </LocalizationProvider>
    );
  };

  export default CustomDateTimePicker;