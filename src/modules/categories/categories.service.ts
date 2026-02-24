import { Request, Response } from "express";


const getCategories = async (req: Request, res: Response) => {
    try {
       res.send("Hello from Categories service")
    } catch (error) {
        throw new Error("Error fetching categories");
    }
}

export const CategoriesService = {
    getCategories
}