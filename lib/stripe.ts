export function formatAmountForDisplay(
  amount: number,
  currency = 'usd',
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol'
  });

  return numberFormat.format(amount / 100);
}