// Temporary canonical glyph pool used by the shared fixed cipher mapping.
export const GLYPH_POOL = [
  '┐', '◇', '∩', '├', '○', '┤', '⌁', '╋', '◊', '∪', '└', '⌞', '⊙',
  '⌂', '⌒', '╳', '◬', '⊕', '⋔', '⌗', '⌄', '⋈', '⧫', '⨯', '⊗', '◩',
] as const

export type Glyph = typeof GLYPH_POOL[number]

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const
export type Letter = typeof ALPHABET[number]