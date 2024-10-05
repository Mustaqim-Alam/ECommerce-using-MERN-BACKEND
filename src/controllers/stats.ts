import { myCache } from "../app.js";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import { User } from "../Models/user.js";

export const adminDashboardStats = tryCatch(async (req, res, next) => {
  let stats;

  if (myCache.has("admin-stats"))
    stats = myCache.get(JSON.parse("admin-stats") as string);
  else {
    const today = new Date();

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProductsPromise = Product.find({
      cretedAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });


    
    const lastMonthUserPromise = User.find({
      cretedAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = tryCatch(async (req, res, next) => {});
export const getBarCharts = tryCatch(async (req, res, next) => {});
export const getLineCharts = tryCatch(async (req, res, next) => {});
