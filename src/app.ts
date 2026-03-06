import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { auth } from "./lib/auth";
import { CategoriesRoutes } from "./modules/categories/categories.route";
import errorHandlerHelper from "./middlewares/errorHandlerHelpers";
import { MedicineRoutes } from "./modules/medicine/medicine.route";
import { OrdersRoutes } from "./modules/orders/order.route";
import { authMiddleware } from "./middlewares/authMiddleware";
import { ReviewsRoutes } from "./modules/reviews/reviews.routes";
import { UserRoutes } from "./modules/User/user.route";

const app: Application = express();

// *✅ parsers FIRST
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true,
  }),
);


//* custom auth routes FIRST
app.get("/api/auth/me", authMiddleware(), (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: req.user,
  });
});

//* then better-auth
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("Assalamu alaikum! Welcome to the MediStore API");
});

app.use("/api/categories", CategoriesRoutes);
app.use("/api/medicine", MedicineRoutes);
app.use("/api/orders", OrdersRoutes);
app.use("/api/reviews", ReviewsRoutes);
app.use("/api/admin/users", UserRoutes);

app.use(errorHandlerHelper);
app.use(errorHandlerHelper)
export default app;

