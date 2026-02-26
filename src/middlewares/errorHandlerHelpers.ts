import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandlerHelper(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  // manually thrown errors (e.g. res.status(404) style custom errors)
  if (err.statusCode) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }
  // prisma clientValidation error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage =
      "Bad Request - Validation Error: Incorrect field type or missing required field";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "Conflict Error - Unique constraint failed";
    } else if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Not Found Error - Required record not found";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 400;
    errorMessage = "Bad Request - Unknown Request Error";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "Internal Error - Prisma query engine crashed";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 500;
      errorMessage =
        "Initialization Error - Authentication failed, check database credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = 500;
      errorMessage =
        "Initialization Error - Cannot reach database server, make sure it is running";
    } else if (err.errorCode === "P1003") {
      statusCode = 500;
      errorMessage =
        "Initialization Error - Database does not exist at the provided URL";
    } else if (err.errorCode === "P1008") {
      statusCode = 500;
      errorMessage = `Initialization Error - Operation timed out after ${(err as any).timeout} ms`;
    } else {
      statusCode = 500;
      errorMessage = "Initialization Error - Failed to connect to database";
    }
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
}

export default errorHandlerHelper;