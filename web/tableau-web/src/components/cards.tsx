import ProjectIcon from './assets/projectIcon'
import IconAntCloud from './assets/iconAntCloud'
import IconBxsUserVoice from './assets/IconBsxUserVoice'
import IconTasks from './assets/iconTasks'

export function Cards() {
    return (
        <div id="workflow" className="my-8">
            <div className="flex flex-col justify-center gap-10 px-10 items-center lg:items-baseline lg:px-0 lg:flex-row">
                <div className="w-[260px] overflow-hidden rounded-lg shadow-md">
                    <div className="relative bg-rose-500 text-white h-12">
                        <div className="absolute top-[25px] left-[15px] p-1 bg-white text-rose-500 rounded-lg">
                            <ProjectIcon width="32px" height="32px" />
                        </div>
                    </div>
                    <div className="px-6 py-4 text-rose-500">
                        <div className="flex text-lg text-rose-800 my-2 font-semibold">
                            Manage your project
                        </div>
                        Tableau allow you to manage your tasks, control the
                        progress of you project and your team mates goals
                    </div>
                </div>
                <div className="w-[260px] overflow-hidden rounded-lg shadow-md">
                    <div className="relative bg-yellow-500 text-white h-12">
                        <div className="absolute top-[25px] left-[15px] p-1 bg-white text-yellow-500 rounded-lg">
                            <IconAntCloud width="32px" height="32px" />
                        </div>
                    </div>
                    <div className="px-6 py-4 text-yellow-500">
                        <div className="flex text-lg text-yellow-800 my-2 font-semibold">
                            Brainstorm
                        </div>
                        Collaborate with your team mates and develop new ideas,
                        and keep track, and manage them.
                    </div>
                </div>
                <div className="w-[260px] overflow-hidden rounded-lg shadow-md">
                    <div className="relative bg-cyan-500 text-white h-12">
                        <div className="absolute top-[25px] left-[15px] p-1 bg-white text-cyan-500 rounded-lg">
                            <IconBxsUserVoice width="32px" height="32px" />
                        </div>
                    </div>
                    <div className="px-6 py-4 text-cyan-500">
                        <div className="flex text-lg text-cyan-800 my-2 font-semibold">
                            Meetings
                        </div>
                        Make meetings more productive, tracking your progress
                        and make them fun
                    </div>
                </div>
                <div className="w-[260px] overflow-hidden rounded-lg shadow-md">
                    <div className="relative bg-purple-500 text-white h-12">
                        <div className="absolute top-[25px] left-[15px] p-1 bg-white text-purple-500 rounded-lg">
                            <IconTasks width="32px" height="32px" />
                        </div>
                    </div>
                    <div className="px-6 py-4 text-purple-500">
                        <div className="flex text-lg text-purple-800 my-2 font-semibold">
                            Task Management
                        </div>
                        Tableau can be use also to manage, join or create new
                        tasks that we help you to earn time
                    </div>
                </div>
            </div>
        </div>
    )
}
