import { useState } from "react";
import AuthPage from "./AuthPage.jsx";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  const [page, setPage] = useState("auth"); // "auth" atau "dashboard"

  return page === "auth" ? (
    <AuthPage onLoginSuccess={() => setPage("dashboard")} />
  ) : (
    <Dashboard onLogout={() => setPage("auth")} />
  );
}