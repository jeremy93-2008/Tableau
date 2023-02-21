import { GridIcon } from './assets/gridIcon'
import { TaskIcon } from './assets/taskIcon'
import { SearchIcon } from './assets/searchIcon'
import { ShareIcon } from './assets/shareIcon'

export function Features() {
    return (
        <div
            id="features"
            className="flex flex-col justify-center items-center px-3 py-8 gap-6
            lg:gap-0 lg:py-0 lg:h-[432px] lg:flex-row bg-gradient-to-t from-white from-[#E6F5F5] dark:from-teal-900 dark:to-teal-800"
        >
            <div className="flex flex-col items-center w-[320px] px-3">
                <GridIcon className="dark:text-white" />
                <h2 className="mt-3 text-[#38B2AC] dark:text-white text-xl font-semibold">
                    Manage boards
                </h2>
                <p className="mt-2 text-[#38B2AC] dark:text-white text-center">
                    Create, Edit and Delete Boards to keep separated all the
                    different works
                </p>
            </div>
            <div className="flex flex-col items-center w-[320px] px-3">
                <TaskIcon />
                <h2 className="mt-3 text-[#38B2AC] dark:text-white text-xl font-semibold">
                    Schedule your tasks
                </h2>
                <p className="mt-2 text-[#38B2AC] dark:text-white text-center">
                    Manage Tasks across Status Column to keep track of all you
                    work
                </p>
            </div>
            <div className="flex flex-col items-center w-[320px] px-3">
                <SearchIcon />
                <h2 className="mt-3 text-[#38B2AC] dark:text-white text-xl font-semibold">
                    Search Feature
                </h2>
                <p className="mt-2 text-[#38B2AC] dark:text-white text-center">
                    Found a Task acroos Boards quickly, thanks to our new search
                    functionality
                </p>
            </div>
            <div className="flex flex-col items-center w-[320px] px-3">
                <ShareIcon />
                <h2 className="mt-3 text-[#38B2AC] dark:text-white text-xl font-semibold">
                    Share with people
                </h2>
                <p className="mt-2 text-[#38B2AC] dark:text-white text-center">
                    Invite peoples to see or work together in a board
                </p>
            </div>
        </div>
    )
}
