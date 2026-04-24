import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../middlewares/authMiddleware";
import { MedicineService } from "./medicine.service";

// todo create-medicine-controller

const createMedicineController = async (req:Request, res:Response, next:NextFunction) => {
  try {
   // console.log("BODY:", req.body); // debug
   // console.log("FILE:", req.file); // debug

    const {
      name,
      description,
      price,
      stock,
      manufacturer,
      categoryId,
    } = req.body;

    if (!name || !price || !stock || !manufacturer || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //const image = req.file?.originalname || ""; // temporary
    const image = req.body.image || null

    const medicine = await MedicineService.createMedicineService(
      req.user!.id,
      {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        manufacturer,
        image,
        categoryId
      }
    );

    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    console.log("CREATE MEDICINE ERROR:", error);
    next(error);
  }
};

// todo get all medicine controller
const getAllMedicineController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const searchQuery = req.query.search;
    const searchString =
      typeof searchQuery === "string" ? searchQuery : undefined;

    //const medicines = await MedicineService.getAllMedicinesService({searchQuery: searchString,});
    const medicines = await MedicineService.getAllMedicinesService(
      req.query as any,
    );

    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
};
// todo get seller medicines controller
const getSellerMedicinesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const medicines = await MedicineService.getSellerMedicinesService(req.user!.id)
    res.status(200).json({ success: true, data: medicines })
  } catch (error) {
    next(error)
  }
}
// todo get medicine by id controller
const getMedicineByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const medicine = await MedicineService.getMedicineByIdService(id as string);
    if (!medicine) {
      res.status(404).json({ success: false, message: "Medicine not found" });
      return;
    }
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
};

// todo update medicine controller
const updateMedicineController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params; // medicine id from params;
    //const { name, description, price, stock, manufacturer, image, categoryId } =req.body;
    const updateData = {
  ...req.body,
  ...(req.body.price && { price: parseFloat(req.body.price) }),
  ...(req.body.stock && { stock: parseInt(req.body.stock) }),
} // Get all fields from request body
    const sellerId = req.user!.id; // Get seller ID from authenticated user
    const isAdmin = req.user?.role === UserRole.ADMIN;

    const updatedMedicine = await MedicineService.updateMedicineService(
      sellerId,
      isAdmin,
      id as string,
      updateData,
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Medicine Updated successfully",
        data: updatedMedicine,
      });
  } catch (error) {
    next(error);
  }
};

// todo delete medicine controller
const deleteMedicineController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //const isAdmin = user?.role === UserRole.ADMIN;
    const isAdmin = req.user?.role === UserRole.ADMIN;
    const param_id = req.params.id as string; // medicine id from params
    await MedicineService.deleteMedicineService(
      param_id,
      req.user!.id,
      isAdmin,
    );

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const MedicineController = {
  createMedicineController,
  getAllMedicineController,
    getSellerMedicinesController,
  getMedicineByIdController,
  updateMedicineController,
  deleteMedicineController,
};
