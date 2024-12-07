import express from "express";
import optionChainRoutes from "./routes/optionChainRoutes";

const app = express();
app.use(express.json());

// Routes
app.use("/api", optionChainRoutes);

export default app;
