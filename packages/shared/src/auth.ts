import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254),
  password: z.string().min(8, 'Password must contain at least 8 characters.').max(128),
});

export const changePasswordInputSchema = z
  .object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z
      .string()
      .min(12, 'New password must contain at least 12 characters.')
      .max(128)
      .regex(/[a-z]/, 'Include a lowercase letter.')
      .regex(/[A-Z]/, 'Include an uppercase letter.')
      .regex(/[0-9]/, 'Include a number.'),
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: 'The new password must differ from the current password.',
    path: ['newPassword'],
  });

export type LoginInput = z.infer<typeof loginInputSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;

export interface AuthenticatedAdmin {
  id: string;
  email: string;
}
