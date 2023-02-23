import { Screenshot } from './assets/screenshot'
import { ScreenshotDark } from './assets/screenshot-dark'

export function Hero() {
    return (
        <div className="flex justify-between overflow-hidden h-[50vh] min-h-[420px] bg-gradient-to-tr from-[#319795] to-[#38B2AC] dark:from-teal-700 dark:to-teal-800">
            <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col mt-10 lg:mt-0">
                    <div className="text-white text-4xl xl:text-5xl font-bold font-[Montserrat] w-[75vw] md:w-[30vw]">
                        <div className="flex">
                            Manage your tasks easily and collaboratively
                        </div>
                    </div>
                    <div className="flex mt-10">
                        <a
                            href="https://tableau-beta.vercel.app/"
                            target="_blank"
                            className="w-full lg:w-[25vw] bg-white text-[#38B2AC] dark:bg-teal-900 dark:text-gray-100 text-center text-lg font-semibold cursor-pointer
                            rounded-lg shadow-lg px-14 py-3 hover:scale-110 transition-transform"
                            rel="noreferrer"
                        >
                            Go To Tableau
                        </a>
                    </div>
                </div>
            </div>
            <div className="hidden mt-[-15px] md:flex">
                <Screenshot className="block dark:hidden w-[60vw] xl:w-fit" />
                <ScreenshotDark className="hidden dark:block w-[60vw] xl:w-fit" />
            </div>
        </div>
    )
}
