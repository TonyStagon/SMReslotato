import mongoose, { Schema, Types, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { SocialAccount } from '../types';

// Define interface for User document methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  addSocialAccount(account: SocialAccount): void;
}

// Create User document interface by merging properties
interface IUserDocument extends Document, IUserMethods {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  socialAccounts: Types.Array<SocialAccount>;
}

const socialAccountSchema = new Schema<SocialAccount>({
  platform: { type: String, required: true },
  username: { type: String, required: true },
  isConnected: { type: Boolean, default: false },
  credentials: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
  },
  lastUsed: Date,
});

const userSchema = new Schema<IUserDocument>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  socialAccounts: [socialAccountSchema],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addSocialAccount = function (account: SocialAccount) {
  const existingIndex = this.socialAccounts.findIndex(
    (acc: SocialAccount) => acc.platform === account.platform
  );
  
  if (existingIndex >= 0) {
    this.socialAccounts[existingIndex] = account;
  } else {
    this.socialAccounts.push(account);
  }
};

export const User = mongoose.model<IUserDocument>('User', userSchema);