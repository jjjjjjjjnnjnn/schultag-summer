import { useGameStore } from './store/gameStore'
import { TitleScreen } from './scenes/TitleScreen'
import { GameScreen } from './scenes/GameScreen'

function App() {
  const isPlaying = useGameStore(s => s.isPlaying)

  return isPlaying ? <GameScreen /> : <TitleScreen />
}

export default App
