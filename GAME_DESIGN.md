# Decode Me - Core Gameplay Design

> This document is the source of truth for Decode Me's core gameplay design.
> Future gameplay-related changes must consult this document first.

## 1. Core Concept

Decode Me is a puzzle game about deciphering an unknown written language.

The player is presented with passages written entirely using an unknown glyph alphabet. Each round gives the player:

1. An encoded passage.
2. One English target word that they must find inside the encoded passage.

The player must discover which sequence of glyphs represents the target word. The player is not simply asked to translate the entire passage.

The main gameplay is based on:

- Pattern recognition.
- Deduction.
- Experimentation.
- Learning glyph-to-letter relationships.
- Using information obtained from previous failed attempts.

The intended feeling is that the player is gradually learning an unknown language, rather than solving a conventional Caesar cipher or generic cipher puzzle.

## 2. The Encoded Passage

Each round contains an English plaintext passage internally, but the player only sees its encoded form. The plaintext must not be shown initially.

Early gameplay passages should generally be around 50 characters or letters, with the exact length allowed to vary as difficulty increases.

Word boundaries must not be directly exposed. Do not display the passage with spaces that reveal every word length, such as:

```text
THE OLD WATCHMAN STOOD BESIDE THE GATE
```

Instead, the encoded passage should appear as a continuous or irregular sequence of glyphs, for example:

```text
⌗○┐◊┤⌁⌗╋┐...
```

The game may later experiment with visual grouping, but word boundaries must not trivially reveal the answer.

## 3. The Target Word

Every round gives the player one English target word to find.

Example:

```text
WATCHMAN
```

The objective is to find the glyph sequence representing the target word, not to translate the entire passage. The target word must be shown clearly in the game UI.

## 4. The Player's Main Action

The player can select a portion of the encoded passage and submit or try that selection as their guess for the target word.

The exact interaction method is intentionally not finalized. It may later use clicking glyphs, dragging across glyphs, or selecting a start and end position.

Do not invent or lock in a specific interaction model unless explicitly requested.

## 5. Correct Attempt

If the player selects the correct sequence:

1. The selected sequence is recognized as the target word.
2. The entire encoded passage is decoded and revealed.
3. The player can read the complete English passage.
4. The round is completed.
5. The player proceeds to the next round.

Core rule:

```text
CORRECT TARGET
    -> DECODE ENTIRE PASSAGE
    -> COMPLETE ROUND
    -> NEXT ROUND
```

The exact visual transition or animation can be designed later.

## 6. Incorrect Attempt

An incorrect attempt must not simply behave like a traditional "Wrong! Try again." response.

When the player selects an incorrect span:

1. The selected span becomes visually marked as an incorrect or previously tested region.
2. The player can later inspect that region.
3. The failed attempt becomes evidence that helps the player learn the glyph alphabet.

Core rule:

```text
WRONG ATTEMPT
    -> MARK AS TESTED
    -> CREATE EVIDENCE
    -> PLAYER CAN INVESTIGATE IT
    -> PLAYER LEARNS GLYPHS
    -> PLAYER TRIES AGAIN
```

A wrong answer is not wasted. A wrong answer produces information.

## 7. The Eye / Reveal Mechanic

The game contains an Eye interaction. The player can press and hold the Eye to inspect information from previously tested incorrect selections.

The Eye does not reveal the current puzzle's solution. It only reveals information about passages or spans that the player has already attempted.

For example, after an incorrect selection, the Eye may reveal:

```text
⌗ = T
◊ = H
┐ = E
◇ = R
○ = E
```

This allows the player to discover that the tested sequence represents `THERE`.

The Eye is not a free hint button. It is an evidence-analysis mechanic. The player must first choose a location and make an attempt before that information becomes available. The Eye must never simply decode the target word for the player.

## 8. Learning Through Failed Attempts

This is a core mechanic of Decode Me.

The player may attempt a random sequence, receive an incorrect result, inspect it with the Eye, and learn several glyph meanings. They can then search for repeated glyphs, form another hypothesis, and try again.

The intended feeling is:

> I learned something from my mistake.

It is not:

> I lost a life.

## 9. Pattern Recognition

The player should be able to use patterns to identify candidate words. For a target such as `WATCHMAN`, the player can reason from its letter pattern:

```text
W A T C H M A N
```

The game should support reasoning from:

- Repeated glyphs.
- Known glyph and letter relationships.
- Word patterns.
- Previously discovered words.
- Repeated sequences.
- Contextual clues from decoded text.

The player gradually solves a substitution-style language puzzle through deduction.

## 10. Fixed Glyph Alphabet

The glyph alphabet is persistent across the game. The mapping must not change between puzzles.

If a glyph represents `T`, it continues to represent `T` in future rounds. This persistence is essential because the player is learning a language.

Do not randomize the A-Z to glyph mapping for every puzzle.

The current glyph set is a temporary or master glyph pool during development. Once the actual alphabet mapping is established, the resulting alphabet mapping must remain consistent across the entire game.

## 11. Glyph Alphabet vs Puzzle

These are separate concepts.

### Glyph Alphabet

The game's persistent language:

```text
A -> glyph X
B -> glyph Y
C -> glyph Z
```

This remains stable.

### Puzzle

A puzzle contains:

- A plaintext passage.
- Its encoded passage.
- A target word.
- Information or evidence associated with player attempts.
- Optional future metadata such as difficulty or chapter.

A puzzle does not generate a new alphabet. It uses the existing Decode Me language.

## 12. No Traditional Game Progression

Core progression must not rely on:

- XP.
- Levels.
- Combat.
- Lives.
- Health.
- Enemies.
- Inventory.
- Coins.
- Energy.
- Multiplayer.
- Time limits.

The player's progression is their understanding of the language:

```text
Unknown glyphs
    -> A few known glyphs
    -> Known words
    -> Recognizing patterns
    -> Understanding passages
    -> Reading the language naturally
```

Knowledge is the progression system.

## 13. Difficulty Progression

Difficulty should increase through information and reasoning complexity, not artificial punishment.

### Early rounds

- Shorter passages.
- Simple target words.
- Obvious patterns.
- More useful discoveries.
- Easier-to-identify repeated glyphs.

### Middle rounds

- Longer passages.
- Fewer obvious patterns.
- More candidate sequences.
- Less direct information.

### Later rounds

- Longer passages.
- Similar-looking candidate patterns.
- Less obvious word boundaries.
- More reliance on previously learned glyphs.
- More deduction.

The game becomes harder because the player must reason more carefully.

## 14. Example Complete Round

Target word:

```text
WATCHMAN
```

Hidden plaintext:

```text
THE OLD WATCHMAN STOOD BESIDE THE GATE AND WAITED FOR THE FIRST LIGHT OF MORNING
```

The encoded passage is a continuous or irregular sequence of glyphs with original word boundaries hidden. The player sees the target:

```text
TARGET: WATCHMAN
```

### Attempt 1

The player selects a random sequence. The result is incorrect. The sequence becomes marked as tested. The player holds the Eye, which reveals glyph meanings from that tested sequence.

### Attempt 2

The player notices a promising pattern and selects another sequence. It is incorrect again. Inspecting it reveals more glyphs and perhaps a recognizable decoded word.

### Attempt 3

Using the newly discovered information, the player identifies the sequence corresponding to `WATCHMAN`. The selection is correct, the entire passage is decoded, the round is completed, and the player moves to the next puzzle.

## 15. Core Gameplay Loop

```text
FIND PASSAGE
    -> READ TARGET WORD
    -> SEARCH GLYPH SEQUENCE
    -> MAKE A GUESS

WRONG
    -> MARK AS EVIDENCE
    -> HOLD EYE
    -> LEARN GLYPHS
    -> FORM NEW THEORY
    -> TRY AGAIN

OR

CORRECT
    -> DECODE PASSAGE
    -> COMPLETE ROUND
    -> NEXT ROUND
```

This loop is the core identity of Decode Me.

## 16. Design Principles

### Principle 1 - Discovery over instruction

Do not explain everything to the player immediately. Let the player discover relationships.

### Principle 2 - Failure provides information

Incorrect selections should contribute to the player's understanding.

### Principle 3 - The player should reason

Do not automatically solve the puzzle for the player.

### Principle 4 - Persistent language

Glyph meanings remain consistent across the game.

### Principle 5 - No generic cipher-game UI

Avoid turning the game into a conventional form with:

```text
Encoded text -> input answer -> Correct/Wrong
```

The encoded passage itself should be the main interactive object.

### Principle 6 - Keep the core simple

Do not add unnecessary systems unless they support the central experience of deciphering the language.

## 17. Currently Not Finalized

The following details are intentionally left open and must not be invented by an AI coding agent:

- Exact glyph selection interaction.
- Click versus drag versus start/end selection.
- Exact Eye UI.
- Animations.
- Sound design.
- Scoring.
- Hint limitations.
- Number of rounds.
- Story or lore structure.
- Final visual style of the puzzle screen.
- Mobile interaction.
- Difficulty algorithm.
- Puzzle generation algorithm.

These must be decided explicitly later.

Until then, preserve the core gameplay described above.

## 18. Implementation Rule for Future AI Agents

Whenever a future task involves gameplay, puzzles, encoding, glyphs, or the `/play` experience:

1. Read `GAME_DESIGN.md` first.
2. Preserve the core gameplay loop.
3. Do not invent mechanics that contradict this document.
4. Do not change the persistent glyph alphabet without explicit instruction.
5. Do not turn the game into a generic cipher-input game.
6. If a requested implementation detail is not specified here, keep the implementation minimal and ask for clarification rather than inventing a major mechanic.
7. Update `GAME_DESIGN.md` only when the human explicitly decides to change the game's design.

This document describes the intended game design, not necessarily the current implementation. The implementation may be incomplete while the design remains authoritative.
