import { ConvexClient } from "convex/browser";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
export const convex = new ConvexClient(convexUrl);
