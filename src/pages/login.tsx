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

  const handleSubmit = form.handleSubmit((data) => {
    fetch(BASE_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 403) {
          setError(await res.json().then((e) => e.message));
          return;
        }
        window.location.href = "/dashboard";
      })
      .catch((e) => {
        console.error(e, "error");
        setError("Invalid username or password");
      });
  });

  return (
    <div className="items-center h-screen max-w-2xl mx-auto py-10 px-4">
      {error ? (
        <div className="text-red-500 text-center mb-4 text-2xl">{error}</div>
      ) : null}
      <Card>
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
