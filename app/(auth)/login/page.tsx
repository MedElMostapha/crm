"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from "@/schemas";
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
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";
import { Target } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onLogin(values: LoginFormValues) {
    setIsPending(true);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    setIsPending(false);

    if (error) {
      toast.error(error.message ?? "Invalid credentials");
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  async function onRegister(values: RegisterFormValues) {
    setIsPending(true);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    setIsPending(false);

    if (error) {
      toast.error(error.message ?? "Registration failed");
      return;
    }

    toast.success("Account created successfully");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md animate-[fade-in-up_0.5s_ease-out] shadow-xl">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-sm">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {APP_NAME}
            </CardTitle>
            <CardDescription className="text-sm">
              {isRegister
                ? "Create an account to get started"
                : "Sign in to manage your CRM"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isRegister ? (
          <form
            onSubmit={registerForm.handleSubmit(onRegister)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...registerForm.register("name")} />
              {registerForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...registerForm.register("email")} />
              {registerForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerForm.register("confirmPassword")}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...loginForm.register("email")} />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </CardFooter>
    </Card>
  );
}
