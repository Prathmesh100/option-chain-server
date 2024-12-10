import express from "express";
import { getOptionChain,getOptionChainHtml } from "../controllers/optionChainController";

const router = express.Router();

router.get("/option-chain/:market", getOptionChain);
router.get("/option-chain/html/:market", getOptionChainHtml);


export default router;
