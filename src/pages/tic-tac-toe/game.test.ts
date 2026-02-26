import { calculateWinner, Player } from './game'

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
