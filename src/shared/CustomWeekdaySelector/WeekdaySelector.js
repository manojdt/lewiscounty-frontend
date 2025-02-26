import { useController } from "react-hook-form";

export const WeekdaySelector = ({ control, name, options }) => {
    const { field } = useController({
      name,
      control,
      defaultValue: [],
    });
  
    const handleDayToggle = (dayKey) => {
      const currentValue = field.value || [];
      const newValue = currentValue.includes(dayKey)
        ? currentValue.filter((day) => day !== dayKey)
        : [...currentValue, dayKey];
      field.onChange(newValue);
    };
  
    return (
      <div className="flex items-center justify-start gap-4 mt-3">
        {options.map((day) => (
          <label
            key={day.key}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-xs cursor-pointer 
              ${
                field.value?.includes(day.key)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
          >
            <input
              type="checkbox"
              checked={field.value?.includes(day.key)}
              onChange={() => handleDayToggle(day.key)}
              className="hidden"
            />
            {day.value}
          </label>
        ))}
      </div>
    );
  };