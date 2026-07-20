export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

export const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CNY",
  notation: "compact",
  maximumFractionDigits: 2,
});

export const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CNY",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function signedCurrency(value: number) {
  const normalized = Math.abs(value) < 0.5 ? 0 : value;
  const formatted = currencyFormatter.format(Math.abs(normalized));
  return `${normalized >= 0 ? "+" : "−"}${formatted}`;
}

export function signedPercent(value: number, percentagePoints = false) {
  const normalized = Math.abs(value) < 0.00005 ? 0 : value;
  if (percentagePoints) {
    return `${normalized >= 0 ? "+" : "−"}${Math.abs(normalized * 100).toFixed(1)} pp`;
  }

  return `${normalized >= 0 ? "+" : "−"}${percentFormatter.format(Math.abs(normalized))}`;
}
