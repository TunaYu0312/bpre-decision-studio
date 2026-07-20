export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
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

