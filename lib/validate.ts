import mongoose from "mongoose";

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Allowed: JPEG, PNG, GIF, WebP";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "File too large. Maximum size is 10MB";
  }
  return null;
}
