export function formatAccountingIDR(value, currency = "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  }


export function convertDecimal4(value){
  const newValue = Math.round(value * 10000) / 10000;
  return newValue;
}