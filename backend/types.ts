import * as z from "zod";

export interface User {
  id: number;
  username: string;
  password: string;
}

export type PlainUser = Omit<User, "password">;

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .refine((password) => /[A-Z]/.test(password), {
    error: "Password must contain uppercase letters",
  })
  .refine((password) => /[a-z]/.test(password), {
    error: "Password must contain letters",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "Password must contain numbers",
  });

export const NewUserSchema = z.object({
  username: z.string().min(5, "Username must containt at least 5 characters"),
  password: passwordSchema,
});

export type NewUser = z.infer<typeof NewUserSchema>;

export interface Payload {
  sub: number;
}

export interface Message {
  id: number;
  content: string;
  senderId: number | null;
  receiverId: number | null;
}

export type NewMessage = Omit<Message, "id">;
