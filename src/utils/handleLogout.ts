import { BASE_URL } from "./env";

const handleLogout = async () => {
  try {
    const res = await fetch(BASE_URL + "/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export default handleLogout;
