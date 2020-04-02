export function formatAmountForDisplay(
  amount: number,
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: 'usd',
    currencyDisplay: 'symbol'
  });

  return numberFormat.format(amount);
}