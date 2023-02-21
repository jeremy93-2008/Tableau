import { Icon } from './assets/icon'

export function Header() {
    return (
        <div className="relative h-[68px] flex dark:bg-teal-900 shadow-sm shadow-teal-600 justify-between items-center px-4 z-10">
            <div className="flex items-center">
                <Icon />
                <div className="ml-2 text-[#2C7A7B] dark:text-white text-xl font-bold">
                    Tableau
                </div>
            </div>
            <div className="items-center hidden lg:flex">
                <a
                    href="#features"
                    className="mr-3 text-[#38B2AC] dark:text-white font-semibold border-b-2 border-transparent transition-all hover:dark:border-white hover:border-[#38B2AC]"
                >
                    Features
                </a>
                <a
                    href="#workflow"
                    className="mr-3 text-[#38B2AC] dark:text-white font-semibold border-b-2 border-transparent transition-all hover:dark:border-white hover:border-[#38B2AC]"
                >
                    Workflow
                </a>
                <a
                    href="#qa"
                    className="mr-3 text-[#38B2AC] dark:text-white font-semibold border-b-2 border-transparent transition-all hover:dark:border-white hover:border-[#38B2AC]"
                >
                    Q&A
                </a>
                <a
                    aria-disabled
                    className="mr-3 text-[#38B2AC] dark:text-white font-semibold cursor-not-allowed border-b-2 border-transparent"
                >
                    Tableau Plus
                </a>
                <a
                    href="https://tableau-jeremy93-2008.vercel.app/"
                    target="_blank"
                    className="bg-[#38B2AC] text-white font-semibold rounded-md px-4 py-2 hover:bg-teal-600 hover:dark:bg-teal-700 transition-colors"
                    rel="noreferrer"
                >
                    Go to Tableau
                </a>
            </div>
            <div className="items-center flex lg:hidden">
                <a
                    href="https://tableau-jeremy93-2008.vercel.app/"
                    target="_blank"
                    className="bg-[#38B2AC] text-white font-semibold rounded-md px-4 py-2 hover:bg-[#319795] transition-colors"
                    rel="noreferrer"
                >
                    Go to Tableau
                </a>
            </div>
        </div>
    )
}
