import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("messages").order("desc").take(50);
    },
});

export const send = mutation({
    args: { text: v.string(), sender: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            text: args.text,
            sender: args.sender,
            timestamp: Date.now(),
        });
    },
});
