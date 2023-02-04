import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react'
import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    SetStateAction,
    useCallback,
    useState,
} from 'react'
import { IFinderSearchResult, IFinderSearchValues } from './index'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

interface ISearchInputProps {
    onClose: () => void
    onOpen: () => void
    isLoading: boolean
    isSuccess: boolean
    mutateAsync: UseMutateAsyncFunction<
        AxiosResponse<IFinderSearchResult, unknown>,
        unknown,
        IFinderSearchValues,
        unknown
    >
    setResult: Dispatch<SetStateAction<IFinderSearchResult>>
}

export function SearchInput(props: ISearchInputProps) {
    const { onClose, onOpen, mutateAsync, setResult, isLoading, isSuccess } =
        props
    const [searchText, setSearchText] = useState('')

    const handleClearText = useCallback(() => {
        setSearchText('')
        onClose()
    }, [setSearchText, onClose])

    const mutateSearch = useCallback(
        (text: string) => {
            mutateAsync({ searchText: text, types: ['task'] }).then((res) => {
                onOpen()
                setResult(res.data)
            })
        },
        [mutateAsync, onOpen, setResult]
    )

    const handleFocus = useCallback(() => {
        if (searchText.length > 0 && !isLoading && isSuccess) onOpen()
    }, [searchText, onOpen, isLoading, isSuccess])

    const handleChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement>) => {
            setSearchText((evt.target as HTMLInputElement).value)
            if (
                (evt.target as HTMLInputElement).value.length === 0 ||
                !isSuccess
            )
                return onClose()
            mutateSearch((evt.target as HTMLInputElement).value)
        },
        [setSearchText, mutateSearch, isSuccess, onClose]
    )

    const handleKeySubmit = useCallback(
        (evt: KeyboardEvent<HTMLInputElement>) => {
            if (evt.key !== 'Enter') return
            mutateSearch(searchText)
        },
        [mutateSearch, searchText]
    )
    return (
        <InputGroup>
            <InputLeftElement>
                <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
                variant="filled"
                fontWeight="medium"
                color="gray.600"
                width="25vw"
                minWidth="300px"
                _focusVisible={{ bgColor: 'white' }}
                name={'search'}
                value={searchText}
                onFocus={handleFocus}
                onChange={handleChange}
                onKeyDown={handleKeySubmit}
            />
            {searchText.length > 0 && (
                <InputRightElement>
                    <CloseIcon
                        onClick={handleClearText}
                        boxSize={3}
                        color="gray.500"
                        cursor="pointer"
                    />
                </InputRightElement>
            )}
        </InputGroup>
    )
}
