import React, { useCallback, useEffect } from 'react'
import {
    calculateHorizontalOverflow,
    calculateVerticalOverflow,
} from 'shared-utils'
import { useAtom } from 'jotai'
import { HighlightTaskAtom } from 'shared-atoms'
import { Task } from '.prisma/client'

export function useHighlightTaskItem(
    ref: React.MutableRefObject<HTMLDivElement | undefined>,
    task: Task,
    readonly?: boolean,
    noHighlightIt?: boolean
) {
    const taskContainer = ref
    const [highlightTask, setHighlightTask] = useAtom(HighlightTaskAtom)
    const isCurrentTaskHighlighted =
        highlightTask?.id === task.id && !noHighlightIt

    const clearHighlight = useCallback(() => {
        setHighlightTask(null)
    }, [setHighlightTask])

    useEffect(() => {
        if (!taskContainer.current || readonly || noHighlightIt) return
        if (highlightTask?.id !== task.id) return
        const columnTaskContainerList =
            taskContainer.current.parentElement!.parentElement!

        // We reset the value of the scroll to make the calculation of the next scroll easier
        columnTaskContainerList.scrollTo({ top: 0 })

        const { scrollTop, scrollBottom } = calculateVerticalOverflow(
            taskContainer.current?.parentElement!,
            columnTaskContainerList
        )
        if (scrollTop < 0) {
            columnTaskContainerList.scrollTo({ top: scrollTop })
        }
        if (scrollTop > 0) {
            columnTaskContainerList.scrollTo({ top: scrollBottom })
        }

        const columnsContainer = document.getElementById('columns-container')

        const { scrollLeft } = calculateHorizontalOverflow(
            taskContainer.current?.parentElement!,
            columnsContainer!
        )

        if (scrollLeft > window.innerWidth - 200 || scrollLeft < 0)
            columnsContainer!.scrollTo({ left: scrollLeft, behavior: 'smooth' })

        // We wait until the Scroll make is job, and after we hook the click to disable the highlight in whatever click that the user do
        window.requestAnimationFrame(() => {
            document.body.addEventListener('click', clearHighlight)
        })

        return () => document.body.removeEventListener('click', clearHighlight)
    }, [
        taskContainer,
        highlightTask,
        setHighlightTask,
        task,
        clearHighlight,
        readonly,
        noHighlightIt,
    ])

    return { isCurrentTaskHighlighted }
}
