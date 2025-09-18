"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateOrderFormValues, createOrderSchema } from "@/schemas/order";
import { useCreateOrder } from "@/hooks/use-orders";
import { useServices } from "@/hooks/use-services";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddNewOrderWithService() {
  const { data: services = [], isLoading } = useServices();
  const createOrder = useCreateOrder();
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      type: "default",
      runs: 0,
      interval: 0,
    },
  });

  React.useEffect(() => {
    return () => {
      form.clearErrors("root");
    };
  }, [form]);

  const selectedType = form.watch("type");
  const selectedServiceId = form.watch("serviceId");
  const selectedService = services.find(
    (service) => service._id === selectedServiceId
  );
  const isFree = selectedService?.isFree || false;

  async function onSubmit(values: CreateOrderFormValues) {
    try {
      if ("link" in values && values.link) {
        if (selectedService?.orderBy === "username") {
          // Automatically add @ symbol if not present
          let username = values.link.trim();
          if (!username.startsWith("@")) {
            username = "@" + username;
            values.link = username; // Update the values object
          }

          // For free services, validate username format
          const usernameRegex = /^@[a-zA-Z0-9._]+$/;
          if (!usernameRegex.test(username)) {
            form.setError("link", {
              type: "manual",
              message:
                "Formato nome utente non valido. Utilizza solo lettere, numeri, trattini bassi e punti.",
            });
            return;
          }
          if (username.length < 4) {
            // @ + 3 chars minimum
            form.setError("link", {
              type: "manual",
              message: "Il nome utente deve essere lungo almeno 3 caratteri.",
            });
            return;
          }
          if (username.length > 31) {
            // @ + 30 chars maximum
            form.setError("link", {
              type: "manual",
              message: "Il nome utente deve contenere meno di 30 caratteri.",
            });
            return;
          }
        } else {
          // For paid services, validate URL format
          try {
            new URL(values.link);
          } catch {
            form.setError("link", {
              type: "manual",
              message: "Formato URL non valido. Inserisci un URL valido.",
            });
            return;
          }
        }
      }

      if (isFree) {
        if (values.type === "default") {
          values.runs = 0;
          values.interval = 0;
        }
      }

      await createOrder.mutateAsync(values);
      form.reset({
        type: "default",
      });
    } catch (error) {
      console.log(error);
      form.setError("root", {
        type: "manual",
        message: "Creazione ordine fallita",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servizio</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value ? value : "");
                  form.setValue("quantity", 0);
                }}
                value={field.value?.toString() || ""}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoading
                          ? "Caricamento servizi..."
                          : "Seleziona un servizio"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service, index) => (
                    <SelectItem key={index} value={service._id}>
                      {`${service.name} (Tariffa: ${service.rate})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {selectedService?.orderBy === "username"
                  ? "Nome utente"
                  : "Link"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    selectedService?.orderBy === "username"
                      ? "nomeutente"
                      : "https://esempio.com"
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Quantità (Min: {selectedService?.min} e Max:{" "}
                {selectedService?.max})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={
                    selectedService
                      ? `Min: ${selectedService.min} e Max ${selectedService.max}`
                      : "Seleziona prima un servizio"
                  }
                  min={selectedService?.min}
                  max={selectedService?.max}
                  disabled={!selectedService}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "default" && !isFree && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="runs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Esecuzioni (Opzionale)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number.parseInt(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervallo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number.parseInt(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={createOrder.isPending || isLoading || !selectedService}
          onClick={() => {
            console.log(form.getValues());
          }}
        >
          {createOrder.isPending ? "Creazione ordine..." : "Crea ordine"}
        </Button>
      </form>
    </Form>
  );
}
