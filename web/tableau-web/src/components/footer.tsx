import { Icon } from './assets/icon'

export function Footer() {
    return (
        <div className="flex bg-teal-900 px-4 h-16 justify-between items-center">
            <div className="flex items-center">
                <Icon height="26px" />
                <div className="ml-2 text-white text-xl font-semibold">
                    Tableau
                </div>
            </div>
            <div className="text-white text-sm">
                Copyright &copy; Jeremy Auvray @ 2023
            </div>
        </div>
    )
}
