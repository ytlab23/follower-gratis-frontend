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
import { useEffect } from "react";

interface AddNewOrderFormProps {
  serviceId: string;
  orderBy: string;
  min: number;
  max: number;
  onSuccess?: () => void;
  isFree: boolean;
}

export default function AddNewOrderForm({
  serviceId,
  min,
  max,
  onSuccess,
  orderBy,
  isFree,
}: AddNewOrderFormProps) {
  const createOrder = useCreateOrder();
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      type: "default",
      serviceId,
      ...(isFree && { runs: 0, interval: 0 }),
    },
  });

  // If serviceId changes, update the form value
  useEffect(() => {
    if (serviceId) {
      form.setValue("serviceId", serviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  // Clear root error when the form is unmounted (modal closed)
  useEffect(() => {
    return () => {
      form.clearErrors("root");
    };
  }, [form]);

  const selectedType = form.watch("type");

  async function onSubmit(values: CreateOrderFormValues) {
    try {
      // Validate link/username based on service type for order types that have link field
      if ("link" in values && values.link) {
        if (orderBy === "username") {
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
          if (username.length < 4) { // @ + 3 chars minimum
            form.setError("link", {
              type: "manual",
              message: "Il nome utente deve essere lungo almeno 3 caratteri.",
            });
            return;
          }
          if (username.length > 31) { // @ + 30 chars maximum
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
      if (onSuccess) onSuccess();
      form.reset({
        type: "default",
        serviceId,
      });
    } catch (error) {
      console.log(error);
      form.setError("root", {
        type: "manual",
        message: "Impossibile creare l'ordine",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Conditional Fields Based on Order Type */}
        {selectedType === "default" && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {orderBy === "username" ? "Username" : "Link"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      orderBy === "username"
                        ? "username"
                        : "https://example.com"
                    }
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
                {orderBy === "username" ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter username (e.g., username, @username, user.name)
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a valid URL (e.g., https://example.com/post/123)
                  </p>
                )}
              </FormItem>
            )}
          />
        )}
        {selectedType === "default" && (
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantity (Min: {min} and Max: {max})
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Min: ${min} and Max ${max}`}
                    min={min}
                    max={max}
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
        )}
        {selectedType === "default" && !isFree && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="runs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Runs (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          Number.parseInt(e.target.value) || undefined
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
                  <FormLabel>Interval</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? "Creating Order" : "Create Order"}
        </Button>
      </form>
    </Form>
  );
}
