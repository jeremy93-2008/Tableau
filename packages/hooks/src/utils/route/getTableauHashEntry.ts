import { IHashRouteEntry } from '../../providers/route/HashRouterProvider'
import { ITableauHashRouteEntry } from '../../hooks/route/useTableauHash'

export function getTableauHashEntry(
    type: 'board' | 'task' | null,
    entry: IHashRouteEntry
) {
    if (!type) return null
    const tableauEntry: ITableauHashRouteEntry = { board: entry.values[1] }
    if (type === 'task') tableauEntry['task'] = entry.values[3]
    return tableauEntry
}
