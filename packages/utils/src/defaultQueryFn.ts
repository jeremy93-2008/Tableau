import axios from 'axios'
import { QueryKey } from '@tanstack/query-core'

export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
    const response = await axios.get(`${queryKey[0]}`)
    return response.data
}
