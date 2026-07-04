import { handlers } from "@/lib/auth";

// [...nextauth] catch any incoming request that starts with /api/auth/
// Export GET and POST handlers for NextAuth.js
export const { GET, POST } = handlers;
