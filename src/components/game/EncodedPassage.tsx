import type { Puzzle, PuzzleWord } from '../../lib/puzzle-generator'

type EncodedPassageProps = {
  puzzle: Puzzle
  discoveredClues: ReadonlySet<number>
  revealClues: boolean
  solved: boolean
  onGlyphClick: (index: number) => void
}

function findWord(words: PuzzleWord[], index: number) {
  return words.find((word) => index >= word.encodedStart && index < word.encodedEnd)
}

export function EncodedPassage({
  puzzle,
  discoveredClues,
  revealClues,
  solved,
  onGlyphClick,
}: EncodedPassageProps) {
  return (
    <div className={solved ? 'encoded-passage solved' : 'encoded-passage'} aria-label="Encoded passage">
      {[...puzzle.encoded].map((glyph, index) => {
        const word = findWord(puzzle.words, index)
        const isDiscovered = word !== undefined && discoveredClues.has(word.encodedStart)
        const isInspected = revealClues && isDiscovered && !solved
        const revealedLetter = isInspected ? word.normalizedWord[index - word.encodedStart] : null

        return (
          <button
            className={[
              'glyph',
              isDiscovered ? 'discovered' : '',
              isInspected ? 'inspected' : '',
              solved && word?.normalizedWord === puzzle.target ? 'target-glyph' : '',
            ].filter(Boolean).join(' ')}
            key={`${puzzle.id}-${index}`}
            type="button"
            aria-label={`Encoded glyph ${index + 1}`}
            onClick={() => onGlyphClick(index)}
          >
            {revealedLetter ?? (solved && word ? word.normalizedWord[index - word.encodedStart] : glyph)}
          </button>
        )
      })}
    </div>
  )
}