"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowRight } from "lucide-react";
import React from "react";

export default function Signin() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-">
            Welcome to <a className="text-red-800"> CollabDraw</a>
            <>
              <ArrowRight size={20} />
            </>
          </CardTitle>
          <CardDescription>Welcome back champ!</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="flex flex-col gap-5">
            <div className="grid gap-y-2">
              <Label>Email</Label>
              <Input placeholder="example@gmail.com" />
            </div>
            <div className="grid gap-y-2">
              <Label>Password</Label>
              <Input placeholder="*******" />
            </div>
          </CardContent>
          <CardFooter className="mt-10">
            <Button className="w-full cursor-pointer">Sign in</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
