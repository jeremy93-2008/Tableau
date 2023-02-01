import React, { useCallback, useEffect } from 'react'
import { calculateOverflow } from '../../../../../utils/calculateOverflow'
import { useAtom } from 'jotai'
import { HighlightTaskAtom } from '../../../../../atoms/highlightTaskAtom'
import { Task } from '.prisma/client'

export function useHighlightTaskItem(
    ref: React.MutableRefObject<HTMLDivElement | undefined>,
    task: Task,
    readonly?: boolean
) {
    const taskContainer = ref
    const [highlightTask, setHighlightTask] = useAtom(HighlightTaskAtom)
    const isCurrentTaskHighlighted = highlightTask?.id === task.id && !readonly

    const clearHighlight = useCallback(() => {
        setHighlightTask(null)
    }, [setHighlightTask])

    useEffect(() => {
        if (!taskContainer.current) return
        if (highlightTask?.id !== task.id) return
        const { scrollTop, scrollBottom } = calculateOverflow(
            taskContainer.current?.parentElement!,
            taskContainer.current.parentElement!.parentElement!
        )
        if (scrollTop < 0) {
            document
                .getElementById('tasklist-container')!
                .scrollTo({ top: scrollTop })
        }
        if (scrollTop > 0) {
            document
                .getElementById('tasklist-container')!
                .scrollTo({ top: scrollBottom })
        }

        window.requestIdleCallback(() => {
            document.body.addEventListener('click', clearHighlight)
        })

        return () => document.body.removeEventListener('click', clearHighlight)
    }, [taskContainer, highlightTask, setHighlightTask, task, clearHighlight])

    return { isCurrentTaskHighlighted }
}
