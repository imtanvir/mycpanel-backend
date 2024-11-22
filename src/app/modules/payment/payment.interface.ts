import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: string;
  date: Date;
  transactionId: string;
};
