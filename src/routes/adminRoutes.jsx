import { lazy } from "react";
// REMOVE THIS LINE: import Categories from "../pages/Categories";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Categories = lazy(() => import("../pages/Categories"));

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
];
