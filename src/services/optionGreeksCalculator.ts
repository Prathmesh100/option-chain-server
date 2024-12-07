import { cumulativeNormalDistribution } from "../utils/mathUtils";
import { addDays, nextFriday, lastFriday } from "../utils/dateUtils"; // Utility functions
import { number } from "mathjs";

// Function to calculate option Greeks
export const calculateOptionGreeks = (
    S: number,
    K: number,
    T: number,
    r: number,
    sigma: number,
    optionType: "call" | "put" = "call"
) => {
    if (T <= 1e-6) {
        // Handle near-zero time-to-expiry (0DTE)
        const delta = optionType === "call" ? (S > K ? 1 : 0) : (S > K ? 0 : -1);
        const gamma = 0;
        const theta = 0;
        const rho = 0;

        return { delta, gamma, theta, rho };
    }

    const d1 = (Math.log(S / K) + (r + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const delta = optionType === "call"
        ? cumulativeNormalDistribution(d1)
        : -cumulativeNormalDistribution(-d1);

    const gamma = cumulativeNormalDistribution(d1) / (S * sigma * Math.sqrt(T));
    const theta = (-S * sigma * cumulativeNormalDistribution(d1)) / (2 * Math.sqrt(T))
        - r * K * Math.exp(-r * T) * cumulativeNormalDistribution(d2);
    const rho = optionType === "call"
        ? T * K * Math.exp(-r * T) * cumulativeNormalDistribution(d2)
        : -T * K * Math.exp(-r * T) * cumulativeNormalDistribution(-d2);

    return { delta, gamma, theta, rho };
};

// Function to calculate expiries
export const calculateExpiries = (): string[] => {
    const today = new Date();
    const expiries: Date[] = [
        addDays(today, 1), // 0DTE
        addDays(today, 2), // 1DTE
        nextFriday(today), // Week 1 (Friday)
        nextFriday(today, 2), // Week 2 (Friday)
        nextFriday(today, 3), // Week 3 (Friday)
        nextFriday(today, 4), // Week 4 (Friday)
        lastFriday(today, 1), // Month 1 (Last Friday)
        lastFriday(today, 2), // Month 2 (Last Friday)
        lastFriday(today, 3), // Month 3 (Last Friday)
        lastFriday(today, 6), // Quarter 2 (Last Friday)
        lastFriday(today, 9), // Quarter 3 (Last Friday)
        lastFriday(today, 12), // Year (Last Friday)
    ];

    return expiries.map((date) => date.toISOString().split("T")[0]); // Return as YYYY-MM-DD
};

// Function to generate the option chain
export const generateOptionChain = (
    spotPrice: number,
    contractSize: number,
    riskFreeRate: number,
    volatility: number
) => {
    const expiries = calculateExpiries();
    const optionChain: any[] = [];

    // Generate strike prices as multiples of 50 around the spot price
    const minStrikeRange = Math.floor(spotPrice / 50) * 50 - 500; // Start 500 below the nearest multiple of 50
    const maxStrike = Math.ceil(spotPrice / 50) * 50 + 500; // End 500 above the nearest multiple of 50
    const minStrike= minStrikeRange>0?minStrikeRange:0
    const strikePrices :number[]= [];
    for (let price = minStrike; price <= maxStrike; price += 500) {
        strikePrices.push(price);
    }

    expiries.forEach((expiry) => {
        const expiryDate = new Date(expiry);
        const timeToExpiry = (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365); // In years

        strikePrices.forEach((strikePrice) => {
            const callGreeks = calculateOptionGreeks(
                spotPrice,
                strikePrice,
                timeToExpiry,
                riskFreeRate,
                volatility,
                "call"
            );

            const putGreeks = calculateOptionGreeks(
                spotPrice,
                strikePrice,
                timeToExpiry,
                riskFreeRate,
                volatility,
                "put"
            );

            optionChain.push({
                strikePrice,
                contractSize,
                expiry,
                type: "call",
                greeks: callGreeks,
            });

            optionChain.push({
                strikePrice,
                contractSize,
                expiry,
                type: "put",
                greeks: putGreeks,
            });
        });
    });

    return optionChain;
};
