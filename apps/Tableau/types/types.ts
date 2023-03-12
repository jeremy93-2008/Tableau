import { Board, Status, StatusBoard, Task, User } from '.prisma/client'
import { BoardUserSharing } from '@prisma/client'

export type IBoardWithAllRelation = Board & {
    Task: (Task & { user: User; assignedUser: User })[]
    Status: IFullStatus[]
    user: User
}

export type IFullStatus = StatusBoard & {
    status: Status
}

export type IFullTask = Task & { user: User; assignedUser: User }
