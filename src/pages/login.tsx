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
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // const handleSubmit = form.handleSubmit((data) => {
  //   console.log(data);
  //   fetch("https://cungur-v2.vercel.app/api/auth/login", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       username: data.username,
  //       password: data.password,
  //     }),
  //   })
  //     .then((e) => {
  //       console.log(e);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // });
  const handleSubmit = form.handleSubmit((data) => {
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
      credentials: "include",
    })
      .then((_) => {
        window.location.href = "/dashboard";
      })
      .catch((e) => {
        console.error(e, "error");
      });
  });

  return (
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
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginPage;
