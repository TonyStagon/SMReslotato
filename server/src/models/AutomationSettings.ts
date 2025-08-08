import mongoose, { Schema, Document } from 'mongoose';
import { AutomationSettings as IAutomationSettings } from '../types';

const automationSettingsSchema = new Schema<IAutomationSettings & Document>({
  userId: { type: String, required: true, unique: true },
  isEnabled: { type: Boolean, default: false },
  browserType: {
    type: String,
    enum: ['puppeteer', 'playwright'],
    default: 'puppeteer',
  },
  headlessMode: { type: Boolean, default: true },
  retryAttempts: { type: Number, default: 3, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

automationSettingsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const AutomationSettings = mongoose.model<IAutomationSettings & Document>(
  'AutomationSettings',
  automationSettingsSchema
);