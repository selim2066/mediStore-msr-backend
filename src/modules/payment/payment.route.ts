import { Router } from 'express';
import * as PaymentController from './payment.controller';

const router = Router();

router.post('/init', PaymentController.initiatePayment);
router.post('/success', PaymentController.handleSuccess);
router.post('/fail', PaymentController.handleFail);
router.post('/cancel', PaymentController.handleCancel);
router.post('/ipn', PaymentController.handleIpn);

export const PaymentRoutes = router;