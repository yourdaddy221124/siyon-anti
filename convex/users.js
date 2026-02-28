import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProfiles = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("user_profiles").order("desc").collect();
    },
});

export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("user_profiles")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});

export const updateStatus = mutation({
    args: { id: v.id("user_profiles"), status: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { subscription_status: args.status });
    },
});

export const updateTier = mutation({
    args: { id: v.id("user_profiles"), tier: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            subscription_tier: args.tier,
            subscription_status: "Active"
        });
    },
});

export const deleteUser = mutation({
    args: { id: v.id("user_profiles") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const signIn = mutation({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("user_profiles")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user || user.password !== args.password) {
            return null;
        }
        return user;
    },
});

export const createProfile = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        full_name: v.optional(v.string()),
        subscription_status: v.string(),
        subscription_tier: v.string()
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existing = await ctx.db
            .query("user_profiles")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (existing) {
            throw new Error("User already exists with this email.");
        }

        return await ctx.db.insert("user_profiles", {
            ...args,
            created_at: Date.now(),
        });
    },
});
