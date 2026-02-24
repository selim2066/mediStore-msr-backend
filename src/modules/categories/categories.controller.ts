import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";

const getCategories = async (req:Request, res:Response) => {
  try {
    const result = await CategoriesService.getCategories(req, res);
    res.status(200).send(result);
  } catch (error) {
    throw new Error("Error fetching categories");
  }
}

export const CategoriesController = {
    getCategories
}