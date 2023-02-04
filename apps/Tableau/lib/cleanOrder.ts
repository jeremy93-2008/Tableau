export type IReorderRows<TData> = TData & { id: string; order: number }

export function cleanOrder<TData>(rows: IReorderRows<TData>[]) {
    const orderedRows = rows.sort((a, b) => a.order - b.order)
    return orderedRows.map((row, idx) => {
        return { ...row, order: idx }
    })
}
