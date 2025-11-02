const isProd = process.env.NODE_ENV === "production";

export const HTTP_URL = isProd
  ? process.env.NEXT_PUBLIC_HTTP_URL ||
    "https://collabdraw-http-server.onrender.com"
  : "http://localhost:3001";

export const WS_URL = isProd
  ? process.env.NEXT_PUBLIC_WS_URL || "https://collabdraw-ws.onrender.com"
  : "ws://localhost:8000";

export const APP_URL = isProd
  ? process.env.NEXT_PUBLIC_APP_URL || "https://collabdraw.vercel.app"
  : "http://localhost:3000";
