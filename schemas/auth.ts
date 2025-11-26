import { z } from "zod";
import { getTranslation } from "@/lib/translations";

// Translation keys for validation messages
const VALIDATION_KEYS = {
  emailRequired: "login.emailRequired",
  emailInvalid: "register.invalidEmail",
  passwordRequired: "login.passwordRequired",
  passwordLength: "register.passwordLength",
  passwordStrength: "register.passwordStrength",
  nameRequired: "register.nameRequired",
  nameLength: "register.nameLength",
  passwordMismatch: "resetPassword.passwordMismatch",
  confirmPasswordRequired: "register.passwordRequired"
} as const;

// Function to get translated validation message
const getValidationMessage = (key: keyof typeof VALIDATION_KEYS): string => {
  try {
    // Try to get current language from localStorage
    const language = typeof window !== 'undefined' ? localStorage.getItem('language') as 'it' | 'en' || 'it' : 'it';
    return getTranslation(language, 'auth', VALIDATION_KEYS[key]);
  } catch {
    // Fallback to English defaults
    const fallbacks = {
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 8 characters",
      passwordStrength: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character @$!%*?&",
      nameRequired: "Name is required",
      nameLength: "Name must be at least 2 characters",
      passwordMismatch: "Passwords do not match",
      confirmPasswordRequired: "Password confirmation is required"
    };
    return fallbacks[key];
  }
};

export const loginSchema = z.object({
  email: z.string().min(1, getValidationMessage("emailRequired")).email(getValidationMessage("emailInvalid")),
  password: z
    .string()
    .min(1, getValidationMessage("passwordRequired"))
    .min(8, getValidationMessage("passwordLength"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      getValidationMessage("passwordStrength")
    ),
});

export const registerSchema = z.object({
  name: z.string().min(1, getValidationMessage("nameRequired")).min(2, getValidationMessage("nameLength")),
  email: z.string().min(1, getValidationMessage("emailRequired")).email(getValidationMessage("emailInvalid")),
  password: z
    .string()
    .min(1, getValidationMessage("passwordRequired"))
    .min(8, getValidationMessage("passwordLength"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      getValidationMessage("passwordStrength")
    ),
});

// Schemas per la gestione degli utenti
const createUserSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Indirizzo email non valido"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale @$!%*?&"
    ),
  role: z.enum(["user", "admin"]),
});

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .optional(),
  email: z.string().email("Indirizzo email non valido").optional(),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale @$!%*?&"
    )
    .optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, getValidationMessage("emailRequired")).email(getValidationMessage("emailInvalid")),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, getValidationMessage("passwordRequired"))
    .min(8, getValidationMessage("passwordLength"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      getValidationMessage("passwordStrength")
    ),
  confirmPassword: z.string().min(1, getValidationMessage("confirmPasswordRequired")),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: getValidationMessage("passwordMismatch"),
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
