import { Router } from 'express';
import * as PaymentController from './payment.controller';

const router = Router();

// POST /api/payment/init — protected, user must be logged in
// POST /api/payment/success — public, SSLCommerz hits this
// POST /api/payment/fail
// POST /api/payment/cancel
// POST /api/payment/ipn

router.post('/init', PaymentController.initiatePayment);
router.post('/success', PaymentController.handleSuccess);
router.post('/fail', PaymentController.handleFail);
router.post('/cancel', PaymentController.handleCancel);
router.post('/ipn', PaymentController.handleIpn);

export const PaymentRoutes = router;