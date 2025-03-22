import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  name: string;
  imageUrl: string;
  gameUrl: string;
  landingPageUrl: string;
  signUpBonus: number;
  minWithdraw: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema: Schema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  gameUrl: { type: String, default: '' },
  landingPageUrl: { type: String, required: true },
  signUpBonus: { type: Number, required: true },
  minWithdraw: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model<IGame>('Game', GameSchema); 