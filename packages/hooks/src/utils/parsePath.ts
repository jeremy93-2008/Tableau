export function parsePath(hash: string) {
    if (!hash.startsWith('#')) return []
    return hash.substring(2).split('/')
}
