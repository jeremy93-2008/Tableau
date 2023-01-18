export function createFetchOptions<TJSON>(method: string, data: TJSON) {
    return {
        method,
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify(data),
    }
}
