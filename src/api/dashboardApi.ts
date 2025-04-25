
import { TimeRange } from "@/components/ui-shared/TimeRangeFilter";

// Define our data models
export interface MetricData {
  currentValue: number;
  previousValue: number;
  percentageChange: number;
}

export interface DashboardMetrics {
  totalSales: MetricData;
  totalOrders: MetricData;
  totalCustomers: MetricData;
  totalItemsSold: MetricData;
}

export interface SalesDataPoint {
  date: string;
  value: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
}

// Helper function to generate mock data based on time range
const generateRandomPercentChange = () => {
  return (Math.random() * 30 - 10).toFixed(2);
};

const createMetricData = (baseValue: number): MetricData => {
  const percentageChange = Number(generateRandomPercentChange());
  const previousValue = baseValue / (1 + percentageChange / 100);
  
  return {
    currentValue: baseValue,
    previousValue,
    percentageChange
  };
};

const getDaysInRange = (range: TimeRange): number => {
  switch (range) {
    case 'this-week':
    case 'last-week':
      return 7;
    case 'this-month':
    case 'last-month':
      return 30;
    case 'this-quarter':
    case 'last-quarter':
      return 90;
    default:
      return 30;
  }
};

// Mock API calls
export const fetchMetrics = async (timeRange: TimeRange): Promise<DashboardMetrics> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data based on time range
  const multiplier = timeRange.includes('quarter') ? 3 : 
                    timeRange.includes('month') ? 1 : 0.25;
                    
  return {
    totalSales: createMetricData(125000 * multiplier),
    totalOrders: createMetricData(1200 * multiplier),
    totalCustomers: createMetricData(450 * multiplier),
    totalItemsSold: createMetricData(3200 * multiplier)
  };
};

export const fetchSalesData = async (timeRange: TimeRange): Promise<SalesDataPoint[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const days = getDaysInRange(timeRange);
  const data: SalesDataPoint[] = [];
  
  // Generate dates in the past based on time range
  const baseDate = new Date();
  const multiplier = timeRange.includes('quarter') ? 3000 : 
                   timeRange.includes('month') ? 1000 : 300;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(baseDate.getDate() - (days - i));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * multiplier) + multiplier
    });
  }
  
  return data;
};

export const fetchRecentOrders = async (): Promise<Order[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const statuses: ('pending' | 'shipped' | 'delivered')[] = ['pending', 'shipped', 'delivered'];
  const orders: Order[] = [];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    
    orders.push({
      id: `ORD-${10000 + i}`,
      customerName: `Customer ${i + 1}`,
      date: date.toISOString().split('T')[0],
      totalAmount: Math.floor(Math.random() * 500) + 50,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  // Sort by date, newest first
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const fetchTopProducts = async (): Promise<TopProduct[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const categories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Books'];
  const products: TopProduct[] = [];
  
  for (let i = 0; i < 10; i++) {
    const unitsSold = Math.floor(Math.random() * 500) + 100;
    const price = Math.floor(Math.random() * 200) + 20;
    
    products.push({
      id: `PRD-${1000 + i}`,
      name: `Product ${i + 1}`,
      sku: `SKU-${10000 + i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      unitsSold,
      totalRevenue: unitsSold * price
    });
  }
  
  // Sort by units sold, highest first
  return products.sort((a, b) => b.unitsSold - a.unitsSold);
};
