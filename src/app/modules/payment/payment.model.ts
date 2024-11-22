import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const PaymentModel = model<TPayment>('payment-history', paymentSchema);
