import { Screenshot } from './assets/screenshot'

export function Hero() {
    return (
        <div
            className="flex justify-between overflow-hidden h-[50vh]"
            style={{
                background:
                    'linear-gradient(258.92deg, #319795 -100.4%, #38B2AC 105.71%)',
            }}
        >
            <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col mt-[-45px]">
                    <div className="text-white text-5xl font-bold font-[Montserrat] w-[30vw]">
                        <div className="flex">
                            Manage your tasks easily and collaboratively
                        </div>
                    </div>
                    <div className="flex mt-10">
                        <a
                            href="https://tableau-jeremy93-2008.vercel.app/"
                            target="_blank"
                            className="w-[25vw] bg-white text-[#38B2AC] text-center text-lg font-semibold cursor-pointer rounded-lg shadow-lg px-14 py-3 hover:scale-110 transition-transform"
                            rel="noreferrer"
                        >
                            Go To Tableau
                        </a>
                    </div>
                </div>
            </div>
            <div className="flex mt-[-85px]">
                <Screenshot
                    style={{ width: '55vw', minWidth: 'fit-content' }}
                />
            </div>
        </div>
    )
}
