import { stripe } from '../../../app';
import { UserModel } from '../user/user.model';
import { TPayment } from './payment.interface';
import { PaymentModel } from './payment.model';

const createPaymentHistory = async (payload: TPayment) => {
  const result = await PaymentModel.create(payload);
  return result;
};

const makePayment = async (amount: number) => {
  const amountConvert = amount * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountConvert,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  const result = {
    clientSecret: paymentIntent.client_secret,
  };

  return result;
};

const getPaymentHistory = async () => {
  const result = await PaymentModel.find({}).sort({ createdAt: -1 });
  return result;
};

const deletePaymentHistory = async (_id: string) => {
  const paymentHistory = await PaymentModel.findById({ _id });
  if (!paymentHistory) {
    throw new Error('Payment not found');
  }
  const result = await PaymentModel.findByIdAndDelete({ _id }, { new: true });
  return result;
};

const getUserPaymentHistory = async (_id: string) => {
  const isUserExist = await UserModel.findById({ _id });
  if (!isUserExist) {
    throw new Error('User not exist!');
  }

  const result = await PaymentModel.find({ userId: _id }).sort({ createdAt: -1 });
  return result;
};

export const PaymentService = {
  deletePaymentHistory,
  createPaymentHistory,
  makePayment,
  getPaymentHistory,
  getUserPaymentHistory,
};
