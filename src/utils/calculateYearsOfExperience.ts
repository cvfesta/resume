// src/utils/calculateYearsOfExperience.ts

/**
 * Calculates years of professional experience since May 2009
 * Returns string in format "16+"
 */
export const calculateYearsOfExperience = (): string => {
    const startYear = 2009;
    const startMonth = 5; // May (1-indexed for readability)

    const startDate = new Date(startYear, startMonth - 1); // Months are 0-indexed in JS
    const currentDate = new Date();

    let years = currentDate.getFullYear() - startDate.getFullYear();
    const monthDiff = currentDate.getMonth() - startDate.getMonth();
    const dayDiff = currentDate.getDate() - startDate.getDate();

    // Adjust if we haven't reached the anniversary month/day yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        years--;
    }

    return `${years}+`;
};