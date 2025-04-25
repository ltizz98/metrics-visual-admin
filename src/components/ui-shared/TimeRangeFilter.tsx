
import React from "react";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type TimeRange = "this-week" | "last-week" | "this-month" | "last-month" | "this-quarter" | "last-quarter";

type TimeRangeOption = {
  value: TimeRange;
  label: string;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: "this-week", label: "This Week" },
  { value: "last-week", label: "Last Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "last-quarter", label: "Last Quarter" },
];

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Time Period:</span>
      <Select
        value={value}
        onValueChange={(newValue) => onChange(newValue as TimeRange)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {TIME_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
