import { myCache } from "../app.js";
import { tryCatch } from "../Middlewares/error.js";

export const adminDashboardStats = tryCatch(async (req, res, next) => {
  let stats;

  if (myCache.has("admin-stats"))
    stats = myCache.get(JSON.parse("admin-stats") as string);

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = tryCatch(async (req, res, next) => {});
export const getBarCharts = tryCatch(async (req, res, next) => {});
export const getLineCharts = tryCatch(async (req, res, next) => {});
