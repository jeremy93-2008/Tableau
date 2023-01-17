import { QueryKey } from '@tanstack/query-core'
import { API_URL } from '../constants/url'

export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
    const data = await fetch(`${API_URL}${queryKey[0]}`).then((res) =>
        res.json()
    )

    return JSON.parse(data)
}
