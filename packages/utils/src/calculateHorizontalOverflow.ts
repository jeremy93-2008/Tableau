export function calculateHorizontalOverflow(
    element: HTMLElement,
    scrollParent: HTMLElement
) {
    const rectElement = element.getBoundingClientRect()
    const rectScrollParentElement = scrollParent.getBoundingClientRect()

    const leftElementHeight = rectElement.left + rectElement.width
    const leftScrollParentElement = rectScrollParentElement.left

    return {
        scrollLeft: leftElementHeight - leftScrollParentElement,
    }
}
