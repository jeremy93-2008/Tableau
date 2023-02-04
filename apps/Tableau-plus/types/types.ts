import { Board, Status, StatusBoard, Task, User } from '.prisma/client'

export type IBoardWithAllRelation = Board & {
    Task: Task[]
    Status: IFullStatus[]
    user: User
}

export type IFullStatus = StatusBoard & {
    status: Status
}
