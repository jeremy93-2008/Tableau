export function getDateString(date: Date) {
    return date.toLocaleString('default', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}
