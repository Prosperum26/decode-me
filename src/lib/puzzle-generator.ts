import { passages, type Passage } from '../data/passages'
import { FIXED_CIPHER_MAPPING, type CipherMapping } from './cipher'

export type Puzzle = {
  id: string
  plaintext: string
  target: string
  encoded: string
  targetRange: {
    start: number
    end: number
  }
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'had',
  'has', 'have', 'he', 'her', 'his', 'i', 'in', 'into', 'is', 'it', 'its',
  'of', 'on', 'or', 'our', 'that', 'the', 'their', 'there', 'they', 'this',
  'to', 'was', 'were', 'which', 'while', 'with', 'you',
])

const WORD_PATTERN = /[A-Za-z]+/g

type WordToken = {
  normalized: string
  encodedStart: number
}

function getWordTokens(text: string): WordToken[] {
  const tokens: WordToken[] = []
  let encodedStart = 0
  let match = WORD_PATTERN.exec(text)

  while (match !== null) {
    const normalized = match[0].toUpperCase()
    tokens.push({ normalized, encodedStart })
    encodedStart += normalized.length
    match = WORD_PATTERN.exec(text)
  }

  WORD_PATTERN.lastIndex = 0
  return tokens
}

export function extractTargetCandidates(text: string): string[] {
  const frequency = new Map<string, number>()

  for (const token of getWordTokens(text)) {
    frequency.set(token.normalized, (frequency.get(token.normalized) ?? 0) + 1)
  }

  return [...frequency.entries()]
    .filter(([word, count]) => count === 1 && word.length >= 4 && !STOP_WORDS.has(word.toLowerCase()))
    .map(([word]) => word)
}

export function encodeText(text: string, mapping: CipherMapping = FIXED_CIPHER_MAPPING): string {
  return [...text.toUpperCase()]
    .filter((character) => character >= 'A' && character <= 'Z')
    .map((character) => mapping.encodeMap[character as keyof typeof mapping.encodeMap])
    .join('')
}

function getTargetRange(
  text: string,
  target: string,
  encoded: string,
  mapping: CipherMapping,
): Puzzle['targetRange'] {
  const matches = getWordTokens(text).filter((token) => token.normalized === target)

  if (matches.length !== 1) {
    throw new Error(`Target "${target}" must occur exactly once as a whole word.`)
  }

  const start = matches[0].encodedStart
  const end = start + target.length
  const encodedTarget = encodeText(target, mapping)

  if (encoded.slice(start, end) !== encodedTarget) {
    throw new Error(`Encoded target "${target}" does not match its encoded passage range.`)
  }

  return { start, end }
}

function validatePassage(passage: Passage, mapping: CipherMapping): string[] {
  const candidates = extractTargetCandidates(passage.text)

  if (candidates.length === 0) {
    throw new Error(`Passage "${passage.id}" has no valid target candidates.`)
  }

  const encoded = encodeText(passage.text, mapping)

  if (encoded.length === 0) {
    throw new Error(`Passage "${passage.id}" produces an empty encoded sequence.`)
  }

  for (const candidate of candidates) {
    getTargetRange(passage.text, candidate, encoded, mapping)
  }

  return candidates
}

export function generatePuzzle(mapping: CipherMapping = FIXED_CIPHER_MAPPING): Puzzle {
  const passage = passages[Math.floor(Math.random() * passages.length)]
  const candidates = validatePassage(passage, mapping)
  const target = candidates[Math.floor(Math.random() * candidates.length)]
  const encoded = encodeText(passage.text, mapping)
  const targetRange = getTargetRange(passage.text, target, encoded, mapping)

  return {
    id: passage.id,
    plaintext: passage.text,
    target,
    encoded,
    targetRange,
  }
}

// Development check for validating the curated dataset without adding a test framework.
export function validatePassageDataset(mapping: CipherMapping = FIXED_CIPHER_MAPPING): void {
  for (const passage of passages) {
    validatePassage(passage, mapping)
  }
}