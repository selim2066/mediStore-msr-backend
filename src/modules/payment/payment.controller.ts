import { Request, Response } from 'express';
import * as PaymentService from './payment.service';

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user.id;

    const result = await PaymentService.initiatePayment(orderId, userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleSuccess = async (req: Request, res: Response) => {
  try {
    const redirectUrl = await PaymentService.handleSuccess(req.body);
    res.redirect(redirectUrl);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
};

export const handleFail = async (req: Request, res: Response) => {
  try {
    const redirectUrl = await PaymentService.handleFail(req.body);
    res.redirect(redirectUrl);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
};

export const handleCancel = async (req: Request, res: Response) => {
  try {
    const redirectUrl = await PaymentService.handleCancel(req.body);
    res.redirect(redirectUrl);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
  }
};

export const handleIpn = async (req: Request, res: Response) => {
  try {
    await PaymentService.handleSuccess(req.body);
    res.status(200).json({ success: true });
  } catch {
    res.status(200).json({ success: false });
  }
};