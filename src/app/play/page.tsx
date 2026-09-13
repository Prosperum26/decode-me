import { useState } from 'react'

import { EncodedPassage } from '../../components/game/EncodedPassage'
import { EyeReveal } from '../../components/game/EyeReveal'
import { TargetWord } from '../../components/game/TargetWord'
import { generatePuzzle, type Puzzle, type PuzzleDifficulty, type PuzzleWord } from '../../lib/puzzle-generator'

type Round = 1 | 2 | 3
type SessionStatus = 'playing' | 'round-complete' | 'failed' | 'completed'

type RoundConfig = {
  round: Round
  attempts: number
  difficulty: PuzzleDifficulty
}

const ROUND_CONFIG: RoundConfig[] = [
  { round: 1, attempts: 5, difficulty: 'easy' },
  { round: 2, attempts: 3, difficulty: 'medium' },
  { round: 3, attempts: 1, difficulty: 'hard' },
]

const COMPLETION_QUOTES = [
  'Not bad. Perhaps the language was never that mysterious.',
  'Three rounds. You may officially call yourself suspiciously clever.',
  'Apparently, ancient languages are no match for you.',
  'The glyphs have been decoded. Your ego may now grow accordingly.',
]

function getWordAtIndex(puzzle: Puzzle, index: number): PuzzleWord | undefined {
  return puzzle.words.find((word) => index >= word.encodedStart && index < word.encodedEnd)
}

function getRoundConfig(round: Round) {
  return ROUND_CONFIG[round - 1]
}

function navigateHome() {
  window.history.pushState({}, '', '/')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function PlayPage() {
  const firstRound = getRoundConfig(1)
  const [currentRound, setCurrentRound] = useState<Round>(1)
  const [attemptsRemaining, setAttemptsRemaining] = useState(firstRound.attempts)
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('playing')
  const [puzzle, setPuzzle] = useState(() => generatePuzzle({ difficulty: firstRound.difficulty }))
  const [discoveredClues, setDiscoveredClues] = useState<ReadonlySet<number>>(() => new Set())
  const [eyePressed, setEyePressed] = useState(false)
  const [showFirstClickHint, setShowFirstClickHint] = useState(true)
  const [completionQuote, setCompletionQuote] = useState('')

  const solved = sessionStatus === 'round-complete' || sessionStatus === 'completed'

  const handleGlyphClick = (index: number) => {
    if (sessionStatus !== 'playing') return

    const word = getWordAtIndex(puzzle, index)
    if (!word) return

    setShowFirstClickHint(false)

    if (word.normalizedWord === puzzle.target) {
      setSessionStatus(currentRound === 3 ? 'completed' : 'round-complete')
      if (currentRound === 3) {
        setCompletionQuote(COMPLETION_QUOTES[Math.floor(Math.random() * COMPLETION_QUOTES.length)])
      }
      return
    }

    if (discoveredClues.has(word.encodedStart)) return

    setDiscoveredClues((current) => {
      const next = new Set(current)
      next.add(word.encodedStart)
      return next
    })

    const nextAttempts = attemptsRemaining - 1
    setAttemptsRemaining(nextAttempts)
    if (nextAttempts <= 0) {
      setSessionStatus('failed')
      setEyePressed(false)
    }
  }

  const startRound = (round: Round, showHint: boolean) => {
    const config = getRoundConfig(round)
    setCurrentRound(round)
    setAttemptsRemaining(config.attempts)
    setPuzzle(generatePuzzle({ difficulty: config.difficulty }))
    setDiscoveredClues(new Set())
    setEyePressed(false)
    setShowFirstClickHint(showHint)
    setSessionStatus('playing')
  }

  const handleNextRound = () => {
    if (currentRound < 3) {
      startRound((currentRound + 1) as Round, false)
    }
  }

  const handleTryAgain = () => {
    startRound(1, true)
  }

  const showClues = eyePressed && discoveredClues.size > 0 && sessionStatus === 'playing'
  const roundConfig = getRoundConfig(currentRound)

  return (
    <section className="page-section play-page">
      {sessionStatus === 'failed' ? (
        <FailureScreen onTryAgain={handleTryAgain} />
      ) : sessionStatus === 'completed' ? (
        <CompletionScreen quote={completionQuote} plaintext={puzzle.plaintext} onReturnHome={navigateHome} />
      ) : (
        <>
          <div className="session-header">
            <span>Round {currentRound} // {roundConfig.difficulty}</span>
            <AttemptDisplay remaining={attemptsRemaining} total={roundConfig.attempts} />
          </div>

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

          {showFirstClickHint && currentRound === 1 && (
            <aside className="first-click-hint" role="note">
              <span>Try clicking a word.</span>
            </aside>
          )}

          {solved && (
            <div className="solved-panel" aria-live="polite">
              <p className="eyebrow">Round {currentRound} understood</p>
              <p>{puzzle.plaintext}</p>
              <button className="next-button" type="button" onClick={handleNextRound}>
                Next round
              </button>
            </div>
          )}
        </>
      )}

      <RoundProgress currentRound={currentRound} status={sessionStatus} />
    </section>
  )
}

type AttemptDisplayProps = {
  remaining: number
  total: number
}

function AttemptDisplay({ remaining, total }: AttemptDisplayProps) {
  return (
    <div className="attempt-display" aria-label={`${remaining} attempts remaining out of ${total}`}>
      <span>Tries</span>
      <div aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <i className={index < remaining ? 'attempt-dot filled' : 'attempt-dot'} key={index} />
        ))}
      </div>
    </div>
  )
}

type RoundProgressProps = {
  currentRound: Round
  status: SessionStatus
}

function RoundProgress({ currentRound, status }: RoundProgressProps) {
  return (
    <div className="round-progress" aria-label={`Round ${currentRound} of 3`}>
      {[1, 2, 3].map((round) => {
        const isCompleted = round < currentRound || (round === 3 && status === 'completed')
        const isCurrent = round === currentRound && status !== 'completed'
        const isFailed = round === currentRound && status === 'failed'

        return (
          <span className="round-step" key={round}>
            <i className={[
              'round-dot',
              isCompleted ? 'completed' : '',
              isCurrent ? 'current' : '',
              isFailed ? 'failed' : '',
            ].filter(Boolean).join(' ')} />
            {round < 3 && <b className={round < currentRound ? 'progress-line completed' : 'progress-line'} />}
          </span>
        )
      })}
    </div>
  )
}

type FailureScreenProps = {
  onTryAgain: () => void
}

function FailureScreen({ onTryAgain }: FailureScreenProps) {
  return (
    <div className="session-screen failure-screen">
      <p className="eyebrow">The trail grows quiet</p>
      <h1>The language remains unsolved.</h1>
      <p>Perhaps the glyphs were a little smarter this time.</p>
      <button className="next-button" type="button" onClick={onTryAgain}>Try again</button>
    </div>
  )
}

type CompletionScreenProps = {
  quote: string
  plaintext: string
  onReturnHome: () => void
}

function CompletionScreen({ quote, plaintext, onReturnHome }: CompletionScreenProps) {
  return (
    <div className="session-screen completion-screen">
      <p className="eyebrow">The language is open</p>
      <h1>Congratulations.</h1>
      <p className="completion-quote">“{quote}”</p>
      <p className="completion-passage">{plaintext}</p>
      <button className="next-button" type="button" onClick={onReturnHome}>Back to home</button>
    </div>
  )
}