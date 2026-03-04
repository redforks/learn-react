import { afterEach, describe, expect, it } from 'vitest'
import { calculateWinner, Player, useGameStore } from './data'

afterEach(() => {
  useGameStore.getState().reset()
})

describe('calculateWinner', () => {
  it('returns null for empty board', () => {
    const squares = Array(9).fill(null)
    expect(calculateWinner(squares)).toBeNull()
  })

  it('detects X winning with top row', () => {
    const squares: Array<Player | null> = [
      Player.X,
      Player.X,
      Player.X,
      null,
      null,
      null,
      null,
      null,
      null,
    ]
    expect(calculateWinner(squares)).toBe(Player.X)
  })

  it('detects O winning with middle row', () => {
    const squares: Array<Player | null> = [
      null,
      null,
      null,
      Player.O,
      Player.O,
      Player.O,
      null,
      null,
      null,
    ]
    expect(calculateWinner(squares)).toBe(Player.O)
  })

  it('detects X winning with left column', () => {
    const squares: Array<Player | null> = [
      Player.X,
      null,
      null,
      Player.X,
      null,
      null,
      Player.X,
      null,
      null,
    ]
    expect(calculateWinner(squares)).toBe(Player.X)
  })

  it('detects O winning with diagonal', () => {
    const squares: Array<Player | null> = [
      Player.O,
      null,
      null,
      null,
      Player.O,
      null,
      null,
      null,
      Player.O,
    ]
    expect(calculateWinner(squares)).toBe(Player.O)
  })

  it('detects X winning with anti-diagonal', () => {
    const squares: Array<Player | null> = [
      null,
      null,
      Player.X,
      null,
      Player.X,
      null,
      Player.X,
      null,
      null,
    ]
    expect(calculateWinner(squares)).toBe(Player.X)
  })

  it('returns null for ongoing game', () => {
    const squares: Array<Player | null> = [
      Player.X,
      Player.O,
      Player.X,
      Player.O,
      null,
      null,
      null,
      null,
      null,
    ]
    expect(calculateWinner(squares)).toBeNull()
  })
})

describe('useGameStore', () => {
  describe('initial state', () => {
    it('has empty board in initial history', () => {
      const { history } = useGameStore.getState()
      expect(history).toHaveLength(1)
      expect(history[0].squares).toEqual(Array(9).fill(null))
    })

    it('starts at move 0', () => {
      const { currentMove } = useGameStore.getState()
      expect(currentMove).toBe(0)
    })
  })

  describe('play', () => {
    it('adds new entry to history', () => {
      const { play } = useGameStore.getState()
      const squares: Array<Player | null> = Array(9).fill(null)
      squares[0] = Player.X

      play(squares)

      const { history, currentMove } = useGameStore.getState()
      expect(history).toHaveLength(2)
      expect(history[1].squares[0]).toBe(Player.X)
      expect(currentMove).toBe(1)
    })

    it('truncates history when playing from past state', () => {
      const { play, jumpTo } = useGameStore.getState()

      // Make 3 moves
      const squares1 = Array(9).fill(null) as Array<Player | null>
      squares1[0] = Player.X
      play(squares1)

      const squares2 = squares1.slice()
      squares2[1] = Player.O
      play(squares2)

      const squares3 = squares2.slice()
      squares3[2] = Player.X
      play(squares3)

      expect(useGameStore.getState().history).toHaveLength(4)

      // Jump back to move 1
      jumpTo(1)

      // Make a different move
      const newSquares = useGameStore.getState().history[1].squares.slice()
      newSquares[3] = Player.O
      play(newSquares)

      const { history, currentMove } = useGameStore.getState()
      expect(history).toHaveLength(3) // Truncated from 4 to 3
      expect(currentMove).toBe(2)
    })
  })

  describe('jumpTo', () => {
    it('changes current move', () => {
      const { play, jumpTo } = useGameStore.getState()

      // Make a move
      const squares = Array(9).fill(null) as Array<Player | null>
      squares[0] = Player.X
      play(squares)

      expect(useGameStore.getState().currentMove).toBe(1)

      // Jump back to start
      jumpTo(0)

      expect(useGameStore.getState().currentMove).toBe(0)
    })

    it('does not modify history', () => {
      const { play, jumpTo } = useGameStore.getState()

      // Make a move
      const squares = Array(9).fill(null) as Array<Player | null>
      squares[0] = Player.X
      play(squares)

      const historyBefore = useGameStore.getState().history.slice()

      jumpTo(0)

      expect(useGameStore.getState().history).toEqual(historyBefore)
    })
  })

  describe('reset', () => {
    it('resets to initial state', () => {
      const { play, reset } = useGameStore.getState()

      // Make some moves
      const squares = Array(9).fill(null) as Array<Player | null>
      squares[0] = Player.X
      play(squares)

      expect(useGameStore.getState().history).toHaveLength(2)

      reset()

      const { history, currentMove } = useGameStore.getState()
      expect(history).toHaveLength(1)
      expect(history[0].squares).toEqual(Array(9).fill(null))
      expect(currentMove).toBe(0)
    })
  })
})
