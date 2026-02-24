import express, { Request, Response } from 'express';
import { CategoriesController } from './categories.controller';


const router = express.Router()

router.get("/", CategoriesController.getCategories)

export const CategoriesRoutes = router;
