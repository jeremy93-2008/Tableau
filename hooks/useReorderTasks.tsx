import { useCallback } from 'react'
import { Task } from '.prisma/client'
import { structuredClone } from 'next/dist/compiled/@edge-runtime/primitives/structured-clone'

export function useReorderTasks(orderedTasks?: Task[], currentTask?: Task) {
    const reorderTasks = useCallback(
        (originalTask: Task) => {
            if (!orderedTasks) return
            const cloneOrderedTasks = structuredClone(orderedTasks)
            const currentIndex = cloneOrderedTasks.findIndex(
                (task) => task.id === originalTask.id
            )
            cloneOrderedTasks.splice(currentIndex, 1)

            const nextIndex = currentTask
                ? cloneOrderedTasks.findIndex(
                      (task) => task.order === currentTask.order
                  )
                : orderedTasks.length

            if (currentTask)
                cloneOrderedTasks.splice(
                    nextIndex,
                    0,
                    structuredClone(originalTask)
                )

            cloneOrderedTasks.forEach((task, idx) => {
                task.order = idx
            })

            return cloneOrderedTasks
        },
        [orderedTasks, currentTask]
    )
    return {
        reorderTasks,
    }
}
