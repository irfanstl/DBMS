import { mongoDB } from './db.js';

export const loggingMiddleware = (req, res, next) => {
  mongoDB.logs.push({
    logId: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "API_REQUEST",
    details: `${req.method} ${req.url}`
  });
  next();
};

export const placeholderMiddleware = (req, res, next) => {
  // Example: Add a custom header to the request or response
  // req.customData = "This is a placeholder";
  // res.setHeader("X-Custom-Header", "MangoBite-API");
  next();
};
