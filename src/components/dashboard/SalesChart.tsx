import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchSalesData } from "@/api/dashboardApi";
import { useTimeRange } from "@/contexts/TimeRangeContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TIME_RANGE_OPTIONS } from "@/components/ui-shared/TimeRangeFilter";
import { format } from "date-fns";

type ChartType = "line" | "bar" | "area";

export const SalesChart = () => {
  const [chartType, setChartType] = useState<ChartType>("line");
  const { timeRange } = useTimeRange();
  const { data, isLoading } = useQuery({
    queryKey: ['sales', timeRange],
    queryFn: () => fetchSalesData(timeRange),
  });

  const timeRangeLabel = TIME_RANGE_OPTIONS.find(option => option.value === timeRange)?.label || '';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM');
  };

  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="h-[300px] w-full" />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No sales data available</p>
        </div>
      );
    }

    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => formatDate(date)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)} 
                width={80} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Sales"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 3 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => formatDate(date)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)} 
                width={80} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Sales"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => formatDate(date)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)} 
                width={80} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Sales"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="#3b82f621" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
        <CardTitle>Sales Overview - {timeRangeLabel}</CardTitle>
        <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as ChartType)}>
          <ToggleGroupItem value="line" aria-label="Line Chart">Line</ToggleGroupItem>
          <ToggleGroupItem value="bar" aria-label="Bar Chart">Bar</ToggleGroupItem>
          <ToggleGroupItem value="area" aria-label="Area Chart">Area</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};
