import { Cards } from './cards'
import { Features } from './features'
import { Footer } from './footer'
import { Header } from './header'
import { Hero } from './hero'
import { QA } from './qa'

export function App() {
    return (
        <div className="flex flex-col">
            <Header />
            <Hero />
            <Features />
            <Cards />
            <QA />
            <Footer />
        </div>
    )
}
