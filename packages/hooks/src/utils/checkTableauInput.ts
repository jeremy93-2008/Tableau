import { IHashRouteEntry } from '../providers/HashRouterProvider'

export function checkTableauInput(entry: IHashRouteEntry) {
    if (entry.values.length === 2 && entry.values[0] === 'b') return 'board'
    if (
        entry.values.length === 4 &&
        entry.values[0] === 'b' &&
        entry.values[2] === 'b'
    )
        return 'task'
    return null
}
