//! v2.01
import { Request, Response } from 'express';
import * as PaymentService from './payment.service';
import { auth } from '../../lib/auth';

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers['x-session-token'] as string;
    const cookieName = req.headers['x-cookie-name'] as string || 'medistore.session_token';

    if (!sessionToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `${cookieName}=${sessionToken}`,
      }),
    });

    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (session.user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account banned' });
    }

    const userId = session.user.id;
    const { orderId } = req.body;

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

// !v2.0
// import { Request, Response } from 'express';
// import * as PaymentService from './payment.service';
// import { auth } from '../../lib/auth';

// export const initiatePayment = async (req: Request, res: Response) => {
//   try {
//     // Get session directly — same way authMiddleware does it
//     const session = await auth.api.getSession({
//       headers: req.headers as any,
//     });

//     if (!session) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     const userId = session.user.id;
//     const { orderId } = req.body;

//     const result = await PaymentService.initiatePayment(orderId, userId);
//     res.json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const handleSuccess = async (req: Request, res: Response) => {
//   try {
//     const redirectUrl = await PaymentService.handleSuccess(req.body);
//     res.redirect(redirectUrl);
//   } catch {
//     res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
//   }
// };

// export const handleFail = async (req: Request, res: Response) => {
//   try {
//     const redirectUrl = await PaymentService.handleFail(req.body);
//     res.redirect(redirectUrl);
//   } catch {
//     res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
//   }
// };

// export const handleCancel = async (req: Request, res: Response) => {
//   try {
//     const redirectUrl = await PaymentService.handleCancel(req.body);
//     res.redirect(redirectUrl);
//   } catch {
//     res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
//   }
// };

// export const handleIpn = async (req: Request, res: Response) => {
//   try {
//     await PaymentService.handleSuccess(req.body);
//     res.status(200).json({ success: true });
//   } catch {
//     res.status(200).json({ success: false });
//   }
// };

// import { Request, Response } from 'express';
// import * as PaymentService from './payment.service';

// export const initiatePayment = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.body;
//     const userId = (req as any).user.id;

//     const result = await PaymentService.initiatePayment(orderId, userId);
//     res.json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const handleSuccess = async (req: Request, res: Response) => {
//   try {
//     const redirectUrl = await PaymentService.handleSuccess(req.body);
//     res.redirect(redirectUrl);
//   } catch {
//     res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
//   }
// };

// export const handleFail = async (req: Request, res: Response) => {
//   try {
//     const redirectUrl = await PaymentService.handleFail(req.body);
//     res.redirect(redirectUrl);
//   } catch {
//     res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
//   }
// };

// export const handleCancel = async (req: Request, res: Response) => {
//   try {
//     const redirectUrl = await PaymentService.handleCancel(req.body);
//     res.redirect(redirectUrl);
//   } catch {
//     res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
//   }
// };

// export const handleIpn = async (req: Request, res: Response) => {
//   try {
//     await PaymentService.handleSuccess(req.body);
//     res.status(200).json({ success: true });
//   } catch {
//     res.status(200).json({ success: false });
//   }
// };
