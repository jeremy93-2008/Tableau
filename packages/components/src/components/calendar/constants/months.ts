export const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i)
    const monthNameLong = date.toLocaleString('default', { month: 'long' })
    return {
        name: monthNameLong.slice(0, 1).toUpperCase() + monthNameLong.slice(1),
        shortName: date.toLocaleString('default', { month: 'short' }),
    }
})
