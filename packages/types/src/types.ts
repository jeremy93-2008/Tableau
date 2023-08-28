import { Board, Status, StatusBoard, Task, User, Comment } from '.prisma/client'
import {
    BoardUserSharing,
    Checklist,
    ChecklistGroup,
    Link,
    Tag,
    TaskAssignedUser,
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
    assignedUsers: IFullTaskAssignedUser[]
    checklistsGroup: IFullCheckListGroup[]
    link: Link[]
    tags: Tag[]
    Comment: Comment[]
}

export type IFullTaskAssignedUser = TaskAssignedUser & {
    User: User
}

export type IFullCheckListGroup = ChecklistGroup & { checklists: Checklist[] }
