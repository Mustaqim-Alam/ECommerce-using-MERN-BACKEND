import express from "express";
import {
  adminDashboardStats,
  getBarCharts,
  getLineCharts,
  getPieCharts,
} from "../Controllers/stats.js";
import { adminOnly } from "../Middlewares/auth.js";

const app = express();

//route --  /api/v1/admin/dashboard
app.get("/dashbaord", adminOnly, adminDashboardStats);
//route -- /api/v1/admin/pie
app.get("/pie", adminOnly, getPieCharts);
//route --  /api/v1/admin/bar
app.get("/bar", adminOnly, getBarCharts);
//route --  /api/v1/admin/line
app.get("/line", adminOnly, getLineCharts);

export default app;
