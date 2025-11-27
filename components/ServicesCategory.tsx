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
import { useServices } from "@/hooks/use-services";
import { Package } from "lucide-react";
import { Service } from "@/types/api";

import { useTranslation } from "@/lib/translations";

interface BestServicesProps {
  services: Service[];
}

function BestServicesList({ services }: BestServicesProps) {
  const { t } = useTranslation('admin');

  if (!services.length) {
    return (
      <EmptyState
        icon={Package}
        title={t('serviceCategories.noServices')}
        description={t('serviceCategories.noServicesDesc')}
      />
    );
  }

  const categoryCounts = services.reduce((acc, service) => {
    if (service.category) {
      const categoryName = service.category.name || "null";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {Object.entries(categoryCounts).map(([category, count]) => (
        <div
          key={category}
          className="flex items-center justify-between border p-4 py-2 rounded-lg"
        >
          <p className="text-sm font-medium">{category}</p>
          <Badge className="p-2 px-3 rounded-lg" variant="outline">
            {count} {t('serviceCategories.services')}
          </Badge>
        </div>
      ))}
    </div>
  );
}

export default function BestServicesCard() {
  const { t } = useTranslation('admin');
  const { data: services = [], isLoading: isServiceLoading } = useServices();
  const bestServices = services.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('serviceCategories.title')}</CardTitle>
        <CardDescription>
          {t('serviceCategories.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isServiceLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[50px] w-full rounded-lg" />
            ))}
          </div>
        ) : services.length == 0 ? (
          <EmptyState
            icon={Package}
            title={t('serviceCategories.noServices')}
            description={t('serviceCategories.noServicesDesc')}
          />
        ) : (
          <BestServicesList services={bestServices} />
        )}
      </CardContent>
    </Card>
  );
}
