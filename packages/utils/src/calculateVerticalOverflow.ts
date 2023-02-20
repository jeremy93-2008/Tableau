export function calculateVerticalOverflow(
    element: HTMLElement,
    scrollParent: HTMLElement
) {
    const rectElement = element.getBoundingClientRect()
    const rectScrollParentElement = scrollParent.getBoundingClientRect()

    const bottomElementHeight = rectElement.top + rectElement.height
    const bottomScrollParentElement =
        rectScrollParentElement.top + rectScrollParentElement.height

    const topElementHeight = rectElement.top + rectElement.height
    const topScrollParentElement = rectScrollParentElement.top

    return {
        scrollTop: topElementHeight - topScrollParentElement,
        scrollBottom: bottomElementHeight - bottomScrollParentElement,
    }
}
