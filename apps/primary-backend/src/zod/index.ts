import {z} from "zod"
export const SignupSchema = z.object({
    name: z.string(),
    phone: z.string().length(10),
    password: z.string().min(6)
})

export const SigninSchema = z.object({
    phone: z.string().length(10),
    password: z.string().min(6)
})
export const MessageSchema = z.object({
    senderId : z.string().uuid(),
    receiverId : z.string().uuid(),
    text : z.string(),
    timestamp: z.string().datetime(),
})

export const ChatSchema = z.object({
    senderId : z.string().uuid(),
    receiverId : z.string().uuid(),
})