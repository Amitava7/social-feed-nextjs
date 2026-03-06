import bcrypt from "bcrypt";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  displayName: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  emailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, select: false },
    avatarUrl: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
