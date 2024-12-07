import express from "express";
import { getOptionChain } from "../controllers/optionChainController";

const router = express.Router();

router.get("/option-chain/:market", getOptionChain);

export default router;
