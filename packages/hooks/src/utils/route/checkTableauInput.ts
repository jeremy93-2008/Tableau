import { IHashRouteEntry } from '../../providers/route/HashRouterProvider'

export function checkTableauInput(entry: IHashRouteEntry) {
    if (
        entry.values.length === 2 &&
        (entry.values[0] === 'b' || entry.values[0] === 'board')
    )
        return 'board'
    if (
        entry.values.length === 4 &&
        (entry.values[0] === 'b' || entry.values[0] === 'board') &&
        (entry.values[2] === 't' || entry.values[2] === 'task')
    )
        return 'task'
    return null
}
