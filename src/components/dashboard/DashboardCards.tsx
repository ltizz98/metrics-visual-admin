
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchMetrics } from "@/api/dashboardApi";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useTimeRange } from "@/contexts/TimeRangeContext";
import { TIME_RANGE_OPTIONS } from "@/components/ui-shared/TimeRangeFilter";

interface MetricCardProps {
  title: string;
  value: number;
  percentageChange: number;
  previousValue: number;
  prefix?: string;
  isLoading: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  percentageChange,
  previousValue,
  prefix = "",
  isLoading
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: prefix === "$" ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: prefix === "$" ? 2 : 0,
    maximumFractionDigits: prefix === "$" ? 2 : 0,
  });

  const formattedValue = prefix === "$" 
    ? formatter.format(value) 
    : `${prefix}${formatter.format(value)}`;

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedValue}</div>
            <div className="flex items-center pt-1">
              {percentageChange > 0 ? (
                <>
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">
                    {percentageChange.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-red-500">
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </>
              )}
              <span className="ml-1 text-xs text-muted-foreground">
                vs previous period
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardCards = () => {
  const { timeRange } = useTimeRange();
  const { data, isLoading } = useQuery({
    queryKey: ['metrics', timeRange],
    queryFn: () => fetchMetrics(timeRange),
  });

  const timeRangeLabel = TIME_RANGE_OPTIONS.find(option => option.value === timeRange)?.label || '';

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Metrics Overview - {timeRangeLabel}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Sales"
          value={data?.totalSales.currentValue || 0}
          previousValue={data?.totalSales.previousValue || 0}
          percentageChange={data?.totalSales.percentageChange || 0}
          prefix="$"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Orders"
          value={data?.totalOrders.currentValue || 0}
          previousValue={data?.totalOrders.previousValue || 0}
          percentageChange={data?.totalOrders.percentageChange || 0}
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Customers"
          value={data?.totalCustomers.currentValue || 0}
          previousValue={data?.totalCustomers.previousValue || 0}
          percentageChange={data?.totalCustomers.percentageChange || 0}
          isLoading={isLoading}
        />
        <MetricCard
          title="Items Sold"
          value={data?.totalItemsSold.currentValue || 0}
          previousValue={data?.totalItemsSold.previousValue || 0}
          percentageChange={data?.totalItemsSold.percentageChange || 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
