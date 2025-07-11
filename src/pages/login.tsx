import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/env";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await fetch(BASE_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
        credentials: "include",
      });
      const loginData = await res.json();
      if (res.status === 403) {
        setError(loginData.message);
        return;
      }
      setError("");
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid username or password");
    }
  });

  return (
    <div className="flex flex-col justify-center h-screen max-w-2xl mx-auto py-10 px-4">
      {error && (
        <div className="text-red-500 text-center mb-4 text-2xl">{error}</div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to Cungur App,
        </h1>
        <p className="text-center mb-12">
          Send anonymous message to your friend!
        </p>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login into your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-2xl mx-auto py-10 px-4"
            >
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button type="submit">Login</Button>
                <Button variant="link" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
