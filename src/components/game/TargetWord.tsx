import { ScrambleText } from '../ui/ScrambleText'

type TargetWordProps = {
  target: string
}

export function TargetWord({ target }: TargetWordProps) {
  return (
    <div className="target-word" aria-label={`Find ${target}`}>
      <span className="target-label">Find</span>
      <strong><ScrambleText text={target} /></strong>
    </div>
  )
}