import IconCaretDown from './assets/iconCaretDown'

export function QA() {
    return (
        <div id="qa" className="bg-teal-800 lg:h-82 px-6 pt-4">
            <h1 className="text-white text-xl font-semibold mb-6">QA</h1>
            <div className="flex flex-col mb-8 lg:flex-row lg:mb-0 justify-center px-8">
                <div className="flex flex-col text-white mr-4">
                    <div className="flex flex-col my-6">
                        <div className="flex items-center">
                            <IconCaretDown />
                            <p className="ml-2">Tableau is free of charged?</p>
                        </div>
                        <div className="ml-8">
                            Yes, Tableau is free of charge
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <IconCaretDown />
                            <p className="ml-2">Tableau is open source?</p>
                        </div>
                        <div className="ml-8">
                            No, not yet, we need to still working to make it
                            open source but yes in the future is a possibility
                        </div>
                    </div>
                </div>
                <div className="flex flex-col text-white mr-4">
                    <div className="flex flex-col my-6">
                        <div className="flex items-center">
                            <IconCaretDown />
                            <p className="ml-2">
                                Tableau is available on the web?
                            </p>
                        </div>
                        <div className="ml-8">
                            Yes, Tableau is full on the web, no need to download
                            anything and you can access it anywhere
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <IconCaretDown />
                            <p className="ml-2">
                                Can be Tableau a alternative to Trello?
                            </p>
                        </div>
                        <div className="ml-8">
                            Yes, actually all the main features are available in
                            Tableau, and it’s totally free
                        </div>
                    </div>
                </div>
                <div className="flex flex-col text-white mr-4">
                    <div className="flex flex-col my-6">
                        <div className="flex items-center">
                            <IconCaretDown />
                            <p className="ml-2">What is Tableau Plus?</p>
                        </div>
                        <div className="ml-8">
                            Tableau Plus is a future piece of software that will
                            be a project manager based in Tableau
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <IconCaretDown />
                            <p className="ml-2">Tableau Plus will be free?</p>
                        </div>
                        <div className="ml-8">
                            We don’t know yet, but for now we focus our effort
                            on Tableau to have a robust support for Tableau Plus
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
