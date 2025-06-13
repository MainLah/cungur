import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardPage from "./pages/dashboard";
import OtherUsersPage from "./pages/otherusers";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { BASE_URL } from "./utils/env";

const routerGuard = async () => {
  const res = await fetch(BASE_URL + "/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw redirect("/");
  }
  return res.json();
};

const checkIfParamIsTheCurrentUser = async ({ params }: LoaderFunctionArgs) => {
  const { username } = params;

  const res = await fetch(BASE_URL + "/api/auth/me", {
    credentials: "include",
  });

  const data = await res.json();

  if (data.data.username === username) {
    throw redirect("/dashboard");
  }

  return null;
};

const checkIfLoggedIn = async () => {
  const res = await fetch(BASE_URL + "/api/auth/me", {
    credentials: "include",
  });

  if (res.ok) {
    throw redirect("/dashboard");
  }

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    loader: checkIfLoggedIn,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: checkIfLoggedIn,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: routerGuard,
  },
  {
    path: "/dashboard/:username",
    element: <OtherUsersPage />,
    loader: checkIfParamIsTheCurrentUser,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
