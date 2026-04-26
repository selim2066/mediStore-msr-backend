import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";


// ✅ UPDATED — pass page & limit from query
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const result = await UserService.getAllUsers({
      page: page as string,
      limit: limit as string,
    });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isBanned } = req.body;

    if (typeof isBanned !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isBanned must be a boolean",
      });
      return;
    }
    if (typeof req.params.id !== "string") {
      res.status(400).json({
        success: false,
        message: "You cannot ban/unban yourself, type error from params {user.controller.ts}",
      });
      return;
    }

    const user = await UserService.updateUserStatus(req.params.id, isBanned);
    res.status(200).json({
      success: true,
      message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getMe(req.user!.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getAllUsers,
  updateUserStatus,
  getMe,
};