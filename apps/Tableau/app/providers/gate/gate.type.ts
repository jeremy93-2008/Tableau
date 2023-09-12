import { Session } from 'next-auth'

export namespace IGate {
    export interface Attempt {
        session: Session
        policies: GatePolicy[]
        params?: Record<string, any> & { boardId: string | undefined }
    }
    export interface Guard {
        api: IGate.Attempt
        success: (result: boolean) => any
        fail: (result: boolean) => any
    }
    export interface GetRoles {
        session: Session
        boardId: string
    }
}

export enum GatePolicy {
    ReadBoardList = 'read-board-list',
    ReadBoard = 'read-board',
    ReadTask = 'read-task',

    CreateBoard = 'create-board',
    CreateTask = 'create-task',
    CreateStatus = 'create-status',
    CreateBoardUserSharing = 'create-board-user-sharing',

    UpdateBoard = 'update-board',
    UpdateTask = 'update-task',
    UpdateStatus = 'update-status',
    UpdateBoardUserSharing = 'update-board-user-sharing',

    DeleteBoard = 'delete-board',
    DeleteTask = 'delete-task',
    DeleteStatus = 'delete-status',
    DeleteBoardUserSharing = 'delete-board-user-sharing',
}
