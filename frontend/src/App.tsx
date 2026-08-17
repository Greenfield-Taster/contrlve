import { Cast } from './components/Cast'
import { Guests } from './components/Guests'
import { Hero } from './components/Hero'
import { HowToPlay } from './components/HowToPlay'

export default function App() {
  return (
    <main>
      <Hero />
      <HowToPlay />
      <Cast />
      <Guests />
    </main>
  )
}
