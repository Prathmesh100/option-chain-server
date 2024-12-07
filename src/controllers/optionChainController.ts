import { Request, Response } from "express";
import axios from "axios";
import { generateOptionChain } from "../services/optionGreeksCalculator";

export const getOptionChain = async (req: Request, res: Response) => {
    const { market } = req.params;
    const { contractSize = 1, riskFreeRate = 0.05, volatility = 0.2 } = req.query;

    try {
        // Mock API call to fetch spot price
        const spotPriceResponse = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${market}`);
        const spotPrice = parseFloat(spotPriceResponse.data?.data?.rates?.USD);

        const optionChain = generateOptionChain(
            spotPrice,
            parseFloat(contractSize as string),
            parseFloat(riskFreeRate as string),
            parseFloat(volatility as string)
        );

        res.json({ market, spotPrice, optionChain });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



