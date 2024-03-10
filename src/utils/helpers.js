export const currencyFormatter = (value) => Intl.NumberFormat('en', {
    style: 'currency', currency: 'USD', maximumSignificantDigits: 7,
}).format(value)
