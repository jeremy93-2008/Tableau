import { ZodIssue } from 'zod'

export function getZodIssuesByPath(issues: ZodIssue[]) {
    return issues.reduce((obj, issue) => {
        const path = issue.path.join('.')
        if (obj[path]) {
            obj[path].push(issue)
        } else {
            obj[path] = [issue]
        }
        return obj
    }, {} as Record<string, ZodIssue[]>)
}
