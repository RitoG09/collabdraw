"use client";

import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@repo/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signup } from "api/auth";
import { useUserStore } from "store/useUserStore";

type signupForm = z.infer<typeof signUpSchema>;

export default function Signup() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<signupForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (d: signupForm) => {
    try {
      const userData = {
        username: d.username,
        email: d.email,
        password: d.password,
      };
      const response = await signup(userData);
      useUserStore.getState().setUser({
        username: response.user.username,
        email: response.user.email,
      });
      localStorage.setItem("token", response.token.encoded);
      toast.success("Your account has been created successfully!");
      router.push("/draw-space");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Something went wrong during signin. Kindly check your credentials and try again!"
      );
    } finally {
      reset();
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Welcome to <a className="text-red-800">CollabDraw </a>
            <>
              <ArrowRight size={20} />
            </>
          </CardTitle>
          <CardDescription>
            We need your following information to set up your profile!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-5">
            <div className="grid gap-y-2">
              <Label>Email</Label>
              <Input {...register("email")} placeholder="example@gmail.com" />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Password</Label>
              <Input {...register("password")} placeholder="*******" />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-red-800">
                  collabdraw.com/
                </span>
                <Input
                  {...register("username")}
                  placeholder="ritog09"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-red-500 text-sm">{errors.username?.message}</p>
            </div>
          </CardContent>
          <CardFooter className="mt-10">
            <Button
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-white/50" : "bg-white"} cursor-pointer w-full`}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
