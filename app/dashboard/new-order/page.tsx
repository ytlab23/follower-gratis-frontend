"use client";

import AddNewOrderWithService from "@/components/order/AddNewOrderWithService";
import { useTranslation } from "@/lib/translations";
import React from "react";

const page = () => {
  const { t } = useTranslation('newOrder');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      <div className="md:w-1/2 mx-auto">
        <AddNewOrderWithService />
      </div>
    </div>
  );
};

export default page;
