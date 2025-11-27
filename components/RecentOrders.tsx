import { EmptyState } from "@/components/EmpityState";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { Package } from "lucide-react";

import { useTranslation } from "@/lib/translations";

const RecentOrders = () => {
  const { t } = useTranslation('admin');
  const { data: orders = [], isLoading: isOrderLoading } = useOrders();

  const recentOrders = orders.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentOrders.title')}</CardTitle>
        <CardDescription>{t('recentOrders.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isOrderLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[50px] w-full rounded-lg" />
              ))}
            </div>
          ) : recentOrders.length == 0 ? (
            <EmptyState
              icon={Package}
              title={t('recentOrders.noOrders')}
              description={t('recentOrders.noOrdersDesc')}
            />
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-4 py-2 rounded-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {t('recentOrders.order')} #{order.topsmmOrderId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.quantity} {t('recentOrders.units')} • ${order.price}
                  </p>
                </div>
                <Badge
                  className="p-2 px-3 rounded-lg"
                  variant={
                    order.status === "completed"
                      ? "default"
                      : order.status === "pending"
                        ? "secondary"
                        : order.status === "failed"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('recentOrders.noOrdersYet')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
