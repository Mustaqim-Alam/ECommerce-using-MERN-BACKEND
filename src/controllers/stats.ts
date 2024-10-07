import { myCache } from "../app.js";
import { tryCatch } from "../Middlewares/error.js";
import { Order } from "../Models/order.js";
import { Product } from "../Models/product.js";
import { User } from "../Models/user.js";
import { calculatePercentage } from "../Utils/features.js";

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

    const lastMonthOrderPromise = Order.find({
      cretedAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const [
      thisMonthOrders,
      thisMonthProducts,
      thisMonthUsers,
      lastMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
    ] = await Promise.all([
      thisMonthOrderPromise,
      thisMonthProductsPromise,
      thisMonthUserPromise,
      lastMonthOrderPromise,
      lastMonthProductsPromise,
      lastMonthUserPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
    };

    stats = {
      changePercent,
    };
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = tryCatch(async (req, res, next) => {});
export const getBarCharts = tryCatch(async (req, res, next) => {});
export const getLineCharts = tryCatch(async (req, res, next) => {});
