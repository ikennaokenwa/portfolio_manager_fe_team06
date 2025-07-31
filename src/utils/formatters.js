// src/utils/formatters.js

/**
 * Formats a number as a currency string (USD).
 * @param {number} value - The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

/**
 * Formats a number as a percentage string with two decimal places.
 * @param {number} value - The number to format.
 * @returns {string} The formatted percentage string.
 */
export const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};
