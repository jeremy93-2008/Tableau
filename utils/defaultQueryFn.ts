import axios from 'axios'
import { QueryKey } from '@tanstack/query-core'
import { API_URL } from '../constants/url'

export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
    const response = await axios.get(`${API_URL}${queryKey[0]}`)
    return response.data
}
