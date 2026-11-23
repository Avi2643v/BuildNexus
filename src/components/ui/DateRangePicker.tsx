import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from './Input';

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  label?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  label = 'Select Project Booking Dates',
}) => {
  return (
    <div className="w-full flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="date"
          label="Start Date"
          value={startDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange(e.target.value, endDate)}
          leftIcon={<CalendarIcon className="w-4 h-4" />}
        />
        <Input
          type="date"
          label="End Date"
          value={endDate}
          min={startDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange(startDate, e.target.value)}
          leftIcon={<CalendarIcon className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};
