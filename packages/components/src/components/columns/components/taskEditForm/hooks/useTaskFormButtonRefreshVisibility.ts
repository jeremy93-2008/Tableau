import { useEffect, useRef, useState } from 'react'

export function useTaskFormButtonRefreshVisibility() {
    const [isVisible, setIsVisible] = useState(true)

    let interval = useRef<number | null>(null)

    useEffect(() => {
        const commentsElm = document.querySelector('#comments-container')
        const commentsInputElm = document.querySelector('#comments-input')
        if (!commentsElm || !commentsInputElm) return

        let isFocused = false

        const listenerCommentsRefreshButtonVisible = () => {
            if (isFocused) return
            setIsVisible(true)
            if (interval.current) window.clearInterval(interval.current)
            interval.current = window.setInterval(() => {
                setIsVisible(false)
            }, 10000)
        }

        const listenerCommentsRefreshButtonHidden = () => {
            setIsVisible(false)
        }

        const listenerCommentsInputButtonHidden = () => {
            setIsVisible(false)
            isFocused = true
        }

        const listenerCommentsInputButtonVisible = () => {
            setIsVisible(true)
            isFocused = false
        }

        commentsElm.addEventListener(
            'mouseover',
            listenerCommentsRefreshButtonVisible
        )

        commentsElm.addEventListener(
            'mouseleave',
            listenerCommentsRefreshButtonHidden
        )

        commentsInputElm.addEventListener(
            'focus',
            listenerCommentsInputButtonHidden
        )

        commentsInputElm.addEventListener(
            'blur',
            listenerCommentsInputButtonVisible
        )

        return () => {
            commentsElm.removeEventListener(
                'mouseover',
                listenerCommentsRefreshButtonVisible
            )
            commentsElm.removeEventListener(
                'mouseleave',
                listenerCommentsRefreshButtonHidden
            )
            commentsInputElm.removeEventListener(
                'focus',
                listenerCommentsInputButtonHidden
            )

            commentsInputElm.removeEventListener(
                'blur',
                listenerCommentsInputButtonVisible
            )
        }
    }, [])

    return {
        isVisible,
        setIsVisible,
        stopInterval: () =>
            interval.current && window.clearInterval(interval.current),
    }
}
