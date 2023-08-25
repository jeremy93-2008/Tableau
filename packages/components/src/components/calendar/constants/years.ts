export const years = Array.from({ length: 120 }, (_, i) => {
    const now = new Date()
    const date = new Date(now.getFullYear() + 50 - i, 0)
    return date.getFullYear()
})
export const minYear = years[years.length - 1]
export const maxYear = years[0]
