import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Reforestation from "./pages/Reforestation";
import CampaignDetail from "./pages/CampaignDetail";
import Recycling from "./pages/Recycling";
import RecyclingCampaigns from "./pages/RecyclingCampaigns";
import RecyclingCampaignDetail from "./pages/RecyclingCampaignDetail";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminGreenPoints from "./pages/admin/AdminGreenPoints";
import AdminRoutes from "./pages/admin/AdminRoutes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStatistics from "./pages/admin/AdminStatistics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/reforestacion",
    Component: Reforestation,
  },
  {
    path: "/reforestacion/:id",
    Component: CampaignDetail,
  },
  {
    path: "/reciclaje",
    Component: Recycling,
  },
  {
    path: "/campanas-reciclaje",
    Component: RecyclingCampaigns,
  },
  {
    path: "/campanas-reciclaje/:id",
    Component: RecyclingCampaignDetail,
  },
  {
    path: "/estadisticas",
    Component: Statistics,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "campaigns", Component: AdminCampaigns },
      { path: "green-points", Component: AdminGreenPoints },
      { path: "routes", Component: AdminRoutes },
      { path: "users", Component: AdminUsers },
      { path: "statistics", Component: AdminStatistics },
    ],
  },
]);