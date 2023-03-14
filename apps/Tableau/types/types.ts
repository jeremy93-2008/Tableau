import { Board, Status, StatusBoard, Task, User } from '.prisma/client'
import { BoardUserSharing, Checklist, ChecklistGroup } from '@prisma/client'

export type IBoardWithAllRelation = Board & {
    Task: IFullTask[]
    Status: IFullStatus[]
    user: User
}

export type IFullStatus = StatusBoard & {
    status: Status
}

export type IFullTask = Task & {
    user: User
    assignedUser: User
    checklistsGroup: IFullCheckListGroup[]
}

export type IFullCheckListGroup = ChecklistGroup & { checklists: Checklist[] }
