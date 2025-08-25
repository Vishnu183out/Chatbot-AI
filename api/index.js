import express from "express";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("✅ API is alive");
});

// Example JSON route
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express + Vercel!" });
});

// Export correctly for Vercel
export default serverless(app);
