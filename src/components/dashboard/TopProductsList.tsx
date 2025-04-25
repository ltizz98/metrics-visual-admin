
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchTopProducts } from "@/api/dashboardApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type SortKey = "unitsSold" | "totalRevenue";

export const TopProductsList = () => {
  const [sortKey, setSortKey] = useState<SortKey>("unitsSold");
  const { data, isLoading } = useQuery({
    queryKey: ["topProducts"],
    queryFn: fetchTopProducts,
  });

  const sortedProducts = data
    ? [...data].sort((a, b) => b[sortKey] - a[sortKey])
    : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Top Performing Items</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Sort By:</span>
          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortKey)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Units Sold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unitsSold">Units Sold</SelectItem>
              <SelectItem value="totalRevenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.unitsSold}</TableCell>
                    <TableCell>
                      {formatCurrency(product.totalRevenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-center">
              <Button variant="outline">View Complete Report</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
