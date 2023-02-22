import { IBoardWithAllRelation, IFullBoardSharing } from '../../../types/types'
import { useCallback, useMemo } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import {
    FaUser,
    FaUserClock,
    FaUserCog,
    FaUserEdit,
    FaUserLock,
} from 'react-icons/fa'
import { GroupBase, OptionProps } from 'chakra-react-select'
import { useSession } from 'next-auth/react'
import { useThemeMode } from 'shared-hooks'

export type IOptionsMenuItem = {
    label: string
    description: string
    value: string
    canEditSchema: boolean
    canEditContent: boolean
}

export function useShareRolesOptions(selectedBoard: IBoardWithAllRelation) {
    const { data: session } = useSession()
    const { text, bg, contrast } = useThemeMode()
    const options: IOptionsMenuItem[] = useMemo(
        () => [
            {
                label: 'Owner',
                description:
                    'As Owner of this board, you have complete authority to create, edit, and delete tasks, columns, and the board itself.',
                value: 'owner',
                canEditSchema: true,
                canEditContent: true,
            },
            {
                label: 'Administrator',
                description:
                    'As an Administrator, you have full control over tasks and columns with the ability to create, edit, and delete them. However, deleting the board itself is not permitted.',
                value: 'admin',
                canEditSchema: true,
                canEditContent: true,
            },
            {
                label: 'Collaborator',
                description:
                    'As a Collaborator, you have the ability to create, edit, and move tasks, but editing or deleting columns or the board itself is restricted.',
                value: 'collaborator',
                canEditSchema: false,
                canEditContent: true,
            },
            {
                label: 'Guest',
                description:
                    'As a Guest, you have limited access to the board and its tasks and columns, allowing you to view them but not create, edit, or delete any.',
                value: 'guest',
                canEditSchema: false,
                canEditContent: false,
            },
        ],
        []
    )

    const getBoardSharingRoleByUser = useCallback(
        (boardsSharedUser: IFullBoardSharing) => {
            if (boardsSharedUser.userId === selectedBoard.userId)
                return options[0]
            if (
                boardsSharedUser.canEditSchema &&
                boardsSharedUser.canEditContent
            )
                return options[1]
            if (
                !boardsSharedUser.canEditSchema &&
                boardsSharedUser.canEditContent
            )
                return options[2]
            if (
                !boardsSharedUser.canEditSchema &&
                !boardsSharedUser.canEditContent
            )
                return options[3]
        },
        [selectedBoard, options]
    )

    const IconRole = useCallback(({ value }: { value: string }) => {
        if (value === 'owner') return <FaUserLock />
        if (value === 'admin') return <FaUserCog />
        if (value === 'collaborator') return <FaUserEdit />
        if (value === 'guest') return <FaUserClock />
        return <FaUser />
    }, [])

    const Option = (
        props: OptionProps<IOptionsMenuItem, false, GroupBase<IOptionsMenuItem>>
    ) => {
        const isDisabled = props.isDisabled || props.data.value === 'owner'
        return (
            <Flex
                onClick={props.innerProps.onClick}
                flexDirection="column"
                color={props.isSelected ? 'white' : text.primary}
                bgColor={props.isSelected ? 'teal.600' : bg.modal}
                _hover={{
                    bgColor: isDisabled ? '' : 'teal.500',
                    color: isDisabled ? '' : 'white',
                }}
                pl={2}
                py={2}
                borderRadius={'5px'}
                filter={isDisabled ? contrast.disabled : 'contrast(1)'}
                cursor="pointer"
                pointerEvents={isDisabled ? 'none' : 'auto'}
            >
                <Flex alignItems="center">
                    <IconRole value={props.data.value} />
                    <Text ml={2}>{props.data.label}</Text>
                </Flex>
                <Text mx={4} fontSize={'12px'}>
                    {props.data.description}
                </Text>
            </Flex>
        )
    }

    return {
        options,
        getBoardSharingRoleByUser,
        Option,
    }
}
