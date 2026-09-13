// Temporary canonical glyph pool. This is not the final cipher mapping.
// Puzzle creation shuffles this pool to generate the actual cipher alphabet.
export const GLYPH_POOL = [
  '┐', '◇', '∩', '├', '○', '┤', '⌁', '╋', '◊', '∪', '└', '⌞', '⊙',
  '⌂', '⌒', '╳', '◬', '⊕', '⋔', '⌗', '⌄', '⋈', '⧫', '⨯', '⊗', '◩',
] as const

export type Glyph = typeof GLYPH_POOL[number]

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const
export type Letter = typeof ALPHABET[number]