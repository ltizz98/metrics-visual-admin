
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchTopProducts } from "@/api/dashboardApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const TopProductsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["topProducts"],
    queryFn: fetchTopProducts,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Take only the first 5 items
  const topFiveProducts = data?.slice(0, 5);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Top Performing Items</CardTitle>
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
        ) : !topFiveProducts || topFiveProducts.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topFiveProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={"/placeholder.svg"}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(product.totalRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
