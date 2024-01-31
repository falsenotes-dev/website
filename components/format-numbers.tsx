export function formatNumberWithSuffix(num: number): string {
  if (num === 0 || isNaN(num)) return "0";
  const units = ["", "K", "M", "B", "T"];
  const unitIndex = Math.floor(Math.log(num) / Math.log(1024));
  const unit = units[unitIndex];
  const numWith2Decimals = parseFloat((num / Math.pow(1024, unitIndex)).toFixed(2));
  if (numWith2Decimals === 0) return "0";
  return numWith2Decimals % 1 === 0
    ? numWith2Decimals.toString() + unit
    : numWith2Decimals.toFixed(2) + unit;
}