import { useCallback } from 'react'
export function useSwapEntity<TData extends { id: string; order: number }>(
    orderedEntities?: TData[]
) {
    const swapEntity = useCallback(
        (currentEntity: TData, nextEntity: TData) => {
            if (!orderedEntities) return
            const cloneOrderedEntities = structuredClone(orderedEntities)

            const currentIndex = cloneOrderedEntities.findIndex(
                (entity) => entity.id === currentEntity.id
            )
            const nextIndex = cloneOrderedEntities.findIndex(
                (entity) => entity.id === nextEntity.id
            )

            const newCurrentEntity = structuredClone(
                cloneOrderedEntities[currentIndex]
            )

            cloneOrderedEntities[currentIndex] = nextEntity
            cloneOrderedEntities[nextIndex] = newCurrentEntity

            cloneOrderedEntities.forEach((entity, idx) => {
                entity.order = idx
            })

            return cloneOrderedEntities
        },
        [orderedEntities]
    )

    return {
        swapEntity,
    }
}
