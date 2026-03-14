import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  description: string;
  category: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a skill title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Programming', 'Design', 'Languages', 'Business', 'Creative', 'Other'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'skills' }
);

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);
