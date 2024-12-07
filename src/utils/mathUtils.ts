import { erf } from "mathjs";

export const cumulativeNormalDistribution = (x: number): number => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
};
