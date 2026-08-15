const isDevelopment = process.env.NODE_ENV === "development";

export const API_URL = isDevelopment
  ? "http://localhost:3000"
  : "https://api-cerocode.heyabhishek.in";

export const CLERK_FRONTEND_API = isDevelopment
  ? "https://more-bluejay-39.clerk.accounts.dev"
  : "https://clerk.heyabhishek.in";

export const CLERK_OAUTH_CLIENT_ID = isDevelopment
  ? "WjU6HL1wRT57md37"
  : "iGhRMTc5tfBnx37h";
