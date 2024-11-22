import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../config';
import { ExtendModel, TUser } from './user.interface';

const userSchema = new Schema<TUser, ExtendModel>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: [
        {
          _id: false,
          id: { type: String, required: true },
          url: { type: String, required: true },
          isRemove: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'superAdmin'],
      default: 'user',
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Hash the password to secure
userSchema.pre('save', async function (next) {
  console.log(await bcrypt.hash(this.password, Number(config.dcrypt_salt_round)));
  this.password = await bcrypt.hash(this.password, Number(config.dcrypt_salt_round));
  next();
});

// Not sending password field in document
userSchema.post('save', function (doc, next) {
  // set empty value for password and it will not send value in client
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await UserModel.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const UserModel = model<TUser, ExtendModel>('user', userSchema);
