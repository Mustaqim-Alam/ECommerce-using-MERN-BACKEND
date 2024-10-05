import express from "express";
import {
  adminDashboardStats,
  getBarCharts,
  getLineCharts,
  getPieCharts,
} from "../Controllers/stats.js";
import { adminOnly } from "../Middlewares/auth.js";

const app = express();

//route --  /api/v1/dashboard/stats
app.get("/stats", adminOnly, adminDashboardStats);
//route -- /api/v1/dashboard/pie
app.get("/pie", adminOnly, getPieCharts);
//route --  /api/v1/dashboard/bar
app.get("/bar", adminOnly, getBarCharts);
//route --  /api/v1/dashboard/line
app.get("/line", adminOnly, getLineCharts);

export default app;
