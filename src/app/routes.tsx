import { createBrowserRouter } from "react-router";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { MainLayout } from "./components/layouts/MainLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { LoginPage } from "./components/pages/LoginPage";
import { SignupPage } from "./components/pages/SignupPage";
import { Dashboard } from "./components/pages/Dashboard";
import { DiaryEditor } from "./components/pages/DiaryEditor";
import { CalendarView } from "./components/pages/CalendarView";
import { MemoryFlashback } from "./components/pages/MemoryFlashback";
import { Analytics } from "./components/pages/Analytics";
import { Themes } from "./components/pages/Themes";
import { Settings } from "./components/pages/Settings";
import { AdminLogin } from "./components/pages/admin/AdminLogin";
import { AdminDashboard } from "./components/pages/admin/AdminDashboard";
import { UserManagement } from "./components/pages/admin/UserManagement";
import { UserDetail } from "./components/pages/admin/UserDetail";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
    ],
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "write", Component: DiaryEditor },
      { path: "calendar", Component: CalendarView },
      { path: "memories", Component: MemoryFlashback },
      { path: "analytics", Component: Analytics },
      { path: "themes", Component: Themes },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: UserManagement },
      { path: "users/:userId", Component: UserDetail },
    ],
  },
]);