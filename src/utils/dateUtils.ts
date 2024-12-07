export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const nextFriday = (date: Date, weeks: number = 1): Date => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = 5 - day + (weeks - 1) * 7; // 5 represents Friday
    result.setDate(result.getDate() + (diff >= 0 ? diff : diff + 7));
    return result;
};

export const lastFriday = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months, 1); // Set to the first day of the target month
    result.setMonth(result.getMonth() + 1, 0); // Move to the last day of the month
    result.setDate(result.getDate() - (result.getDay() + 2) % 7); // Move to last Friday
    return result;
};
