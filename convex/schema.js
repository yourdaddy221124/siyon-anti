import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    user_profiles: defineTable({
        full_name: v.optional(v.string()),
        email: v.string(),
        password: v.string(), // Added for custom Convex auth
        subscription_status: v.string(), // "Active" | "Canceled"
        subscription_tier: v.string(), // "Free" | "Premium Monthly" | etc
        created_at: v.number(), // timestamp
    }).index("by_email", ["email"]),

    messages: defineTable({
        sender: v.string(), // "user" | "bot"
        text: v.string(),
        timestamp: v.number(),
        userId: v.optional(v.string()), // if we want to associate with a user
    }),
});
