import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ error: "Username or email is required" })
    .trim()
    .min(1, "Username or email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: z
    .string({ error: "New password is required" })
    .min(4, "New password must be at least 4 characters")
    .max(50, "New password cannot exceed 50 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  avatarUrl: z.string().trim().optional(),
  sidebarTitle: z.string().trim().optional(),
});