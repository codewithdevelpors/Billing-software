/**
 * Calculates the subtotal of invoice items.
 * @param {Array} items - Array of invoice items, each with quantity and price.
 * @returns {number} The subtotal amount.
 */
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
};

/**
 * Calculates the tax amount based on subtotal and tax rate.
 * @param {number} subtotal - The subtotal amount.
 * @param {number} taxRate - The tax rate as a percentage.
 * @returns {number} The calculated tax amount.
 */
export const calculateTax = (subtotal, taxRate) => {
  return subtotal * (taxRate / 100);
};

/**
 * Calculates the total amount including subtotal and tax.
 * @param {number} subtotal - The subtotal amount.
 * @param {number} tax - The tax amount.
 * @returns {number} The total amount.
 */
export const calculateTotal = (subtotal, tax) => {
  return subtotal + tax;
};
