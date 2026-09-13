import { useState } from 'react'

import { EncodedPassage } from '../../components/game/EncodedPassage'
import { EyeReveal } from '../../components/game/EyeReveal'
import { TargetWord } from '../../components/game/TargetWord'
import { generatePuzzle, type Puzzle, type PuzzleWord } from '../../lib/puzzle-generator'

function getWordAtIndex(puzzle: Puzzle, index: number): PuzzleWord | undefined {
  return puzzle.words.find((word) => index >= word.encodedStart && index < word.encodedEnd)
}

export function PlayPage() {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle())
  const [discoveredClues, setDiscoveredClues] = useState<ReadonlySet<number>>(() => new Set())
  const [eyePressed, setEyePressed] = useState(false)
  const [solved, setSolved] = useState(false)

  const handleGlyphClick = (index: number) => {
    if (solved) return

    const word = getWordAtIndex(puzzle, index)
    if (!word) return

    if (word.normalizedWord === puzzle.target) {
      setSolved(true)
      return
    }

    setDiscoveredClues((current) => {
      const next = new Set(current)
      next.add(word.encodedStart)
      return next
    })
  }

  const handleNextPuzzle = () => {
    setPuzzle(generatePuzzle())
    setDiscoveredClues(new Set())
    setEyePressed(false)
    setSolved(false)
  }

  const showClues = eyePressed && discoveredClues.size > 0 && !solved

  return (
    <section className="page-section play-page">
      <div className="game-layout">
        <div className="target-column">
          <TargetWord target={puzzle.target} />
          <EyeReveal
            disabled={discoveredClues.size === 0 || solved}
            pressed={eyePressed && !solved}
            onPressChange={(pressed) => setEyePressed(pressed && discoveredClues.size > 0 && !solved)}
          />
        </div>
        <div className="passage-frame">
          <EncodedPassage
            puzzle={puzzle}
            discoveredClues={discoveredClues}
            revealClues={showClues}
            solved={solved}
            onGlyphClick={handleGlyphClick}
          />
          <div className="passage-meta">
            <span>{discoveredClues.size} discovered {discoveredClues.size === 1 ? 'clue' : 'clues'}</span>
          </div>
        </div>
      </div>

      {solved && (
        <div className="solved-panel" aria-live="polite">
          <p className="eyebrow">Passage understood</p>
          <p>{puzzle.plaintext}</p>
          <button className="next-button" type="button" onClick={handleNextPuzzle}>Next puzzle</button>
        </div>
      )}
    </section>
  )
}