/**
 * Price Utility Functions
 * Format prices and calculate totals
 */

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format duration in minutes to human readable
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Calculate total price from multiple items
 */
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

/**
 * Apply discount to price
 */
export function applyDiscount(price: number, discount: number): number {
  return Math.max(0, price - discount);
}

/**
 * Calculate percentage discount
 */
export function calculatePercentageDiscount(
  price: number,
  percentage: number
): number {
  return (price * percentage) / 100;
}
