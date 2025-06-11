import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import OtherUsersPage from "./pages/otherusers";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";

const routerGuard = async () => {
  const res = await fetch("http://localhost:3000/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw redirect("/");
  }
  return res.json();
};

const publicDashboardLoader = async ({ params }: LoaderFunctionArgs) => {
  const res = await fetch(
    `http://localhost:3000/api/messages/${params.username}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw redirect("/");
  }
  return res.json();
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: routerGuard,
  },
  {
    path: "/dashboard/:username",
    element: <OtherUsersPage />,
    loader: publicDashboardLoader,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
