import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Categories = lazy(() => import("../pages/Categories"));
const Home = lazy(() => import("../pages/Home")); // Path sahi hona chahiye

export const adminRoutes = [
  {
    path: "", // This represents /admin
    element: <Dashboard />,
    title: "Dashboard",
  },
  {
    path: "categories",
    element: <Categories />,
    title: "Categories",
  },
  {
    path: "home", // This will be /admin/home
    element: <Home />,
    title: "Home",
  },
];
