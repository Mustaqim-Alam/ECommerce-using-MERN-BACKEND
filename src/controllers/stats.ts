import { myCache } from "../app.js";
import { tryCatch } from "../Middlewares/error.js";
import { Order } from "../Models/order.js";
import { Product } from "../Models/product.js";
import { User } from "../Models/user.js";
import {
  calculatePercentage,
  getChartData,
  getProductCategories,
} from "../Utils/features.js";

export const adminDashboardStats = tryCatch(async (req, res, next) => {
  let stats;

  const key = "admin-stats";
  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
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
      const monthsDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthsDiff < 6) {
        orderMonthsCount[6 - monthsDiff - 1] += 1;

        orderMonthsRevenue[6 - monthsDiff - 1] += order.total;
      }
    });

    const categoriesCount = await getProductCategories({
      productCategory,
      productCount,
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
      quantity: i.orderItems.length,
    }));

    stats = {
      changePercent,
      count,
      chart: {
        order: orderMonthsCount,
        revenue: orderMonthsRevenue,
      },
      categoriesCount,
      userGenderRatio,
      latestTransaction: modifiedLatestTransactions,
    };

    myCache.set(key, JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = tryCatch(async (req, res, next) => {
  let chart;

  const key = "admin-pie-chart";
  if (myCache.has(key)) chart = JSON.parse(myCache.get(key) as string);
  else {
    const allOrderPromise = Order.find({}).select([
      "tax",
      "total",
      "subtotal",
      "discount",
      "shippingCharge",
    ]);

    const [
      ProcessingOrderCount,
      shippedOrderCount,
      deliveredOrderCount,
      productCategory,
      productCount,
      productOutOfStock,
      allOrders,
      usersDOB,
      adminCount,
      userCount,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullFilmentsStatus = {
      processing: ProcessingOrderCount,
      shipped: shippedOrderCount,
      delivered: deliveredOrderCount,
    };

    const categoriesCount = await getProductCategories({
      productCategory,
      productCount,
    });

    const stockAvailablity = {
      inStock: productCount - productOutOfStock,
      productOutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharge || 0),
      0
    );
    const brunt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    const marketingCost = Math.round(grossIncome * (30 / 100));
    const netMargin =
      grossIncome - discount - productCost - brunt - marketingCost;

    const revenueDistibution = {
      netMargin,
      discount,
      productCost,
      brunt,
      marketingCost,
    };

    const adminUSer = {
      admin: adminCount,
      user: userCount,
    };

    const userAgeGroup = {
      teen: usersDOB.filter((user) => user.age < 20).length,
      adult: usersDOB.filter((user) => user.age >= 20 && user.age < 40).length,
      old: usersDOB.filter((user) => user.age >= 40).length,
    };

    chart = {
      orderFullFilmentsStatus,
      categoriesCount,
      stockAvailablity,
      revenueDistibution,
      userAgeGroup,
      adminUSer,
    };

    myCache.set(key, JSON.stringify(chart));
  }
  return res.status(200).json({
    success: true,
    chart,
  });
});

export const getBarCharts = tryCatch(async (req, res, next) => {
  let charts;

  const key = "admin-bar-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    };

    const twelveMonthOrderPromise = Order.find(baseQuery).select("createdAt");
    const sixMonthProductPromise = Product.find(baseQuery).select("createdAt");
    const sixMonthUserPromise = User.find(baseQuery).select("createdAt");

    const [sixMonthOrders, sixMonthProducts, sixMonthUsers] = await Promise.all(
      [twelveMonthOrderPromise, sixMonthProductPromise, sixMonthUserPromise]
    );

    const productCounts = getChartData({
      length: 6,
      docArr: sixMonthProducts,
      today,
    });
    const userCounts = getChartData({
      length: 6,
      docArr: sixMonthUsers,
      today,
    });
    const orderCounts = getChartData({
      length: 12,
      docArr: sixMonthOrders,
      today,
    });

    charts = {
      users: userCounts,
      products: productCounts,
      orderCounts: orderCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineCharts = tryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  // charts = await redis.get(key);

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});
