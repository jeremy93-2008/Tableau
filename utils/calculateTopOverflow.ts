export function calculateTopOverflow(
    element: HTMLElement,
    scrollParent: HTMLElement
) {
    const rectElement = element.getBoundingClientRect()
    const rectScrollParentElement = scrollParent.getBoundingClientRect()

    const bottomElementHeight = rectElement.top + rectElement.height
    const bottomScrollParentElement =
        rectScrollParentElement.top + rectScrollParentElement.height

    return bottomElementHeight - bottomScrollParentElement
}
