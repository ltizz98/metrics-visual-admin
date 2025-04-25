
import React, { createContext, useContext, useState } from "react";
import { TimeRange } from "@/components/ui-shared/TimeRangeFilter";

interface TimeRangeContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined);

export const TimeRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("this-month");

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </TimeRangeContext.Provider>
  );
};

export const useTimeRange = () => {
  const context = useContext(TimeRangeContext);
  if (context === undefined) {
    throw new Error("useTimeRange must be used within a TimeRangeProvider");
  }
  return context;
};
