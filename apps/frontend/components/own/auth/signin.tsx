"use client";

import { signin } from "api/auth";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { useUserStore } from "store/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { signInSchema } from "@repo/common";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

type signinForm = z.infer<typeof signInSchema>;

export default function Signin() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signinForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (d: signinForm) => {
    try {
      const userData = {
        email: d.email,
        password: d.password,
      };
      const response = await signin(userData);
      useUserStore.getState().setUser({
        username: response.user.username,
        email: response.user.email,
      });
      localStorage.setItem("token", response.token.encoded);
      toast.success("Your are logged in!", { duration: 5000 });
      router.push("/draw-space");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Something went wrong during signin. Kindly check your credentials and try again!",
        { duration: 5000 }
      );
    } finally {
      reset();
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <p>
              Welcome to <a className="text-red-800">CollabDraw</a>
            </p>
            <>
              <ArrowRight size={20} />
            </>
          </CardTitle>
          <CardDescription>Welcome back champ!</CardDescription>
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
          </CardContent>
          <CardFooter className="mt-10">
            <Button
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-white/50" : "bg-white"} cursor-pointer w-full`}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
