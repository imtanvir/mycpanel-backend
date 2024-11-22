import express from 'express';
import authCheck from '../../middleware/authCheck';
import { USER_ROLE } from '../user/user.constant';
import { PaymentController } from './payment.controll';

const router = express.Router();

router.post(
  '/add-payment-history',
  // authCheck(USER_ROLE.user),
  PaymentController.PaymentHistoryCreate,
);

router.post(
  '/create-client-secret',
  // authCheck(USER_ROLE.user),
  PaymentController.makePayment,
);
router.get(
  '/all-payment-history',
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  PaymentController.getPaymentHistory,
);

router.delete(
  '/delete-payment-history/:id',
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  PaymentController.deletePaymentHistory,
);

router.get(
  '/user-payment-history/:id',
  authCheck(USER_ROLE.user),
  PaymentController.getUserPaymentHistory,
);
export const PaymentHistoryRoute = router;
