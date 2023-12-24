export function fReportCurrency(number?: number | null) {
  if (number !== null && number !== undefined) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    return '0.00';
  }
}
