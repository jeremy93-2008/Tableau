import { useCallback } from 'react'
import { structuredClone } from 'next/dist/compiled/@edge-runtime/primitives/structured-clone'

export function useReorderDnDEntity<
    TData extends { id: string; order: number }
>(orderedEntity?: TData[], currentEntity?: TData) {
    const reorderEntity = useCallback(
        (originalEntity: TData) => {
            if (!orderedEntity) return
            const cloneOrderedEntities = structuredClone(orderedEntity)
            const currentIndex = cloneOrderedEntities.findIndex(
                (task) => task.id === originalEntity.id
            )
            cloneOrderedEntities.splice(currentIndex, 1)

            const nextIndex = currentEntity
                ? cloneOrderedEntities.findIndex(
                      (task) => task.order === currentEntity.order
                  )
                : 999

            cloneOrderedEntities.splice(
                nextIndex,
                0,
                structuredClone(originalEntity)
            )

            cloneOrderedEntities.forEach((task, idx) => {
                task.order = idx
            })

            return cloneOrderedEntities
        },
        [orderedEntity, currentEntity]
    )
    return {
        reorderEntity,
    }
}
