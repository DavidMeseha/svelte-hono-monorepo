import { createMiddleware } from "hono/factory";

const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    return c.json({ message: "Unauthorized", success: false }, 401);
  }

  return next();
});
