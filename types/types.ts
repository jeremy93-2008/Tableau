import { Board, Task, Status, User } from '.prisma/client'

export type IBoardWithAllRelation = Board & {
    Task: Task[]
    Status: Status[]
    user: User
}
