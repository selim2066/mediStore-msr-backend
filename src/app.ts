import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { auth } from "./lib/auth";
import { CategoriesRoutes } from "./modules/categories/categories.route";
import errorHandlerHelper from "./middlewares/errorHandlerHelpers";
import { MedicineRoutes } from "./modules/medicine/medicine.route";
import { OrdersRoutes } from "./modules/orders/order.route";

const app: Application = express();

// ✅ parsers FIRST
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true,
  }),
);

// ✅ THEN auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// routes
app.use("/categories", CategoriesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Assalamu alaikum! Welcome to the MediStore API");
});

// medicine routes
app.use("/medicine", MedicineRoutes);
// order routes
app.use("/orders", OrdersRoutes);


// Global error handler
app.use(errorHandlerHelper)
export default app;
