export function getDateAndTimeString(date: Date) {
    return date.toLocaleString('default', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
}
