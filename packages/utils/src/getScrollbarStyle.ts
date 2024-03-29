export function getScrollbarStyle() {
    return {
        sx: {
            '&::-webkit-scrollbar': {
                width: '6px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                backgroundColor: `rgba(0, 0, 0, 0.3)`,
            },
        },
        style: {
            scrollbarGutter: 'stable',
            scrollbarWidth: 'thin' as any,
            scrollbarColor: 'rgb(44, 122, 123) transparent',
        },
    }
}
