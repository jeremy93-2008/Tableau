import { Board, Status, StatusBoard, Task, User } from '.prisma/client'
import {
    BoardUserSharing,
    Checklist,
    ChecklistGroup,
    Link,
} from '@prisma/client'

export type IBoardWithAllRelation = Board & {
    Task: IFullTask[]
    Status: IFullStatus[]
    user: User
}

export type IFullStatus = StatusBoard & {
    status: Status
}

export type IFullBoardSharing = BoardUserSharing & {
    board: Board
    user: User
}

export type IFullTask = Task & {
    user: User
    assignedUser: User
    checklistsGroup: IFullCheckListGroup[]
    link: Link[]
}

export type IFullCheckListGroup = ChecklistGroup & { checklists: Checklist[] }
