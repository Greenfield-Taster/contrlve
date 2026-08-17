import { AppSection } from './components/AppSection'
import { Cast } from './components/Cast'
import { Footer } from './components/Footer'
import { Guests } from './components/Guests'
import { Hero } from './components/Hero'
import { HowToPlay } from './components/HowToPlay'
import { Socials } from './components/Socials'
import { WordsForm } from './components/WordsForm'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <HowToPlay />
        <Cast />
        <Guests />
        <AppSection />
        <WordsForm />
        <Socials />
      </main>
      <Footer />
    </>
  )
}
