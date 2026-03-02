import { NextFunction, Request, Response } from "express"
import { MedicineService } from "./medicine.service";

// !create-medicine-controller
const createMedicineController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, manufacturer, image, categoryId } =
      req.body;

    if (!name || !description || !price || !stock || !manufacturer || !categoryId) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const medicine = await MedicineService.createMedicineService(req.user!.id, {
      name,
      description,
      price,
      stock,
      manufacturer,
      image,
      categoryId
    })
    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    next(error)
  }
}

// ! get all medicine controller
const getAllMedicineController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQuery = req.query.search;
    const searchString = typeof searchQuery === "string" ? searchQuery : undefined;


    //const medicines = await MedicineService.getAllMedicinesService({searchQuery: searchString,});
    const medicines = await MedicineService.getAllMedicinesService(req.query as any);

    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error)
  }
}

// ! get medicine by id controller
const getMedicineByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const medicine = await MedicineService.getMedicineByIdService(id as string);
    if (!medicine) {
      res.status(404).json({ success: false, message: "Medicine not found" });
      return;
    }
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    next(error)
  }

}

export const MedicineController = {createMedicineController, getAllMedicineController, getMedicineByIdController}