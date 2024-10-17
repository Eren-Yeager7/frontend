export function formatCurrency(value: number) {
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2
    })

    // A little workaround to add a space after the currency symbol.
    const parts = formatter.formatToParts(value)
    return parts
        .map(part => part.type === 'currency' ? `${part.value} ` : part.value)
        .join('')
}
