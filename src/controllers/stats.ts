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
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

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
    const lastsixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionPromise = Order.find({})
      .select(["status", "discount", "orderItems", "total"])
      .limit(4);

    const [
      thisMonthOrders,
      thisMonthProducts,
      thisMonthUsers,
      lastMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastsixMonthOrders,
      userCount,
      productCount,
      allOrders,
      productCategory,
      maleUserCount,
      latestTransaction,
    ] = await Promise.all([
      thisMonthOrderPromise,
      thisMonthProductsPromise,
      thisMonthUserPromise,
      lastMonthOrderPromise,
      lastMonthProductsPromise,
      lastMonthUserPromise,
      lastsixMonthOrderPromise,
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select("total"),
      Product.distinct("category"),
      User.countDocuments({ gender: "male" }),
      latestTransactionPromise,
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
      userCount,
    };
    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const orderMonthsCount = new Array(6).fill(0);
    const orderMonthsRevenue = new Array(6).fill(0);

    lastsixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthsDiff = today.getMonth() - creationDate.getMonth();
      console.log(monthsDiff);

      if (monthsDiff < 6) {
        console.log(orderMonthsCount);
        orderMonthsCount[6 - monthsDiff - 1] += 1;
        console.log(orderMonthsCount);
        orderMonthsRevenue[6 - monthsDiff - 1] += order.total;
      }
    });
    const categoriesCountPromise = productCategory.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, Number>[] = [];
    productCategory.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productCount) * 100),
      });
    });

    const count = {
      user: userCount,
      product: productCount,
      order: allOrders.length,
      revenue,
    };

    const userGenderRatio = {
      male: maleUserCount,
      female: userCount - maleUserCount,
    };

    const modifiedLatestTransactions = latestTransaction.map((i) => ({
      _id: i.id,
      status: i.status,
      total: i.total,
      discount: i.discount,
      quantity: i.orderItems.quantity,
    }));

    stats = {
      changePercent,
      count,
      chart: {
        order: orderMonthsCount,
        revenue: orderMonthsRevenue,
      },
      categoryCount,
      userGenderRatio,
      latestTransaction,
      modifiedLatestTransactions,
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
