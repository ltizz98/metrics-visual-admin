
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimeRangeProvider } from "@/contexts/TimeRangeContext";
import { TimeRange, TimeRangeFilter } from "@/components/ui-shared/TimeRangeFilter";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentOrdersList } from "@/components/dashboard/RecentOrdersList";
import { TopProductsList } from "@/components/dashboard/TopProductsList";
import { useTimeRange } from "@/contexts/TimeRangeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const DashboardHeader = () => {
  const { timeRange, setTimeRange } = useTimeRange();
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>
      <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardCards />
      <SalesChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrdersList />
        <TopProductsList />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TimeRangeProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <Dashboard />
          </div>
        </div>
      </TimeRangeProvider>
    </QueryClientProvider>
  );
};

export default Index;
