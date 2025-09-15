"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { CardFooter } from "@/components/ui/card";

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Password Reimpostata</CardTitle>
          <CardDescription>La tua password è stata aggiornata correttamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Il tuo account è ora protetto con la nuova password.</p>
              <p className="mt-2">Puoi ora accedere al tuo account TopSMM.</p>
            </div>
            
            <Button asChild className="w-full">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Vai al Login
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Ricorda di mantenere la tua password sicura
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}