import { Request, Response } from "express";
import axios from "axios";
import { generateOptionChain } from "../services/optionGreeksCalculator";

export const getOptionChain = async (req: Request, res: Response) => {
    const { market } = req.params;
    const { contractSize = 1, riskFreeRate = 0.05, volatility = 0.2 } = req.query;

    try {
        // Mock API call to fetch spot price
        const spotPriceResponse = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${market}`);
        // console.log(spotPriceResponse?.data)
        const spotPrice = parseFloat(spotPriceResponse.data?.lastPrice); 
        const priceChange=parseFloat(spotPriceResponse.data?.priceChange); 
        const percentPriceChange = parseFloat(spotPriceResponse.data?.priceChangePercent);
        const optionChain = generateOptionChain(
            spotPrice,
            parseFloat(contractSize as string),
            parseFloat(riskFreeRate as string),
            parseFloat(volatility as string)
        );

        res.json({ market,priceChange,percentPriceChange, spotPrice, optionChain });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getOptionChainHtml = async (req: Request, res: Response) => {
    const { market } = req.params;
    const { contractSize = 1, riskFreeRate = 0.05, volatility = 0.2 } = req.query;

    try {
        // Mock API call to fetch spot price
        const spotPriceResponse = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${market}`);
        // console.log(spotPriceResponse?.data)
        const spotPrice = parseFloat(spotPriceResponse.data?.lastPrice); 
        const priceChange=parseFloat(spotPriceResponse.data?.priceChange); 
        const percentPriceChange = parseFloat(spotPriceResponse.data?.priceChangePercent);

        const optionChain = generateOptionChain(
            spotPrice,
            parseFloat(contractSize as string),
            parseFloat(riskFreeRate as string),
            parseFloat(volatility as string)
        );

        // Render HTML table
        const tableRows = optionChain.map((option) => `
            <tr>
                <td>${option.expiry}</td>
                <td>${option.strikePrice}</td>
                <td>${option.type}</td>
                <td>${option.greeks.delta.toFixed(4)}</td>
                <td>${option.greeks.gamma.toFixed(4)}</td>
                <td>${option.greeks.theta.toFixed(4)}</td>
                <td>${option.greeks.rho.toFixed(4)}</td>
            </tr>
        `).join("");

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title> ${market.toUpperCase()}  $${spotPrice}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                table, th, td {
                    border: 1px solid #ddd;
                }
                th, td {
                    padding: 10px;
                    text-align: center;
                }
                th {
                    background-color: #f4f4f4;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
            </style>
        </head>
        <body>
            <h1>Option Chain: ${market.toUpperCase()} = ${spotPrice}</h1>
            <h1>Price Change: ${priceChange}</h1>
            <h1>% Price Change: ${percentPriceChange}% </h1>

            <table>
                <thead>
                    <tr>
                        <th>Expiry</th>
                        <th>Strike Price</th>
                        <th>Type</th>
                        <th>Delta</th>
                        <th>Gamma</th>
                        <th>Theta</th>
                        <th>Rho</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
        `;

        res.setHeader("Content-Type", "text/html");
        res.send(htmlContent);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

