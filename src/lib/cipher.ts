import { ALPHABET, GLYPH_POOL, type Glyph, type Letter } from '../data/glyphs'

export type CipherMapping = {
  encodeMap: Record<Letter, Glyph>
  decodeMap: Record<Glyph, Letter>
}

function createMapping(glyphs: readonly Glyph[]): CipherMapping {
  const encodeMap = {} as Record<Letter, Glyph>
  const decodeMap = {} as Record<Glyph, Letter>

  ALPHABET.split('').forEach((letter, index) => {
    const glyph = glyphs[index]
    encodeMap[letter as Letter] = glyph
    decodeMap[glyph] = letter as Letter
  })

  return { encodeMap, decodeMap }
}

// This is the temporary but fixed game alphabet. It is shared by every puzzle.
export const FIXED_CIPHER_MAPPING = createMapping(GLYPH_POOL)

// Returns the shared game alphabet. Puzzles must reuse this mapping rather than
// creating a new substitution alphabet for each puzzle.
export function createCipherMapping(): CipherMapping {
  return FIXED_CIPHER_MAPPING
}