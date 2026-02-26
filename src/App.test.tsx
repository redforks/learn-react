import { fireEvent, render, screen } from '@testing-library/react'
import App, { calculateWinner, Player } from './App'

describe('App', () => {
  it('renders the board', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
  })

  it('alternates X and O on clicks', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveTextContent('X')
    fireEvent.click(buttons[1])
    expect(buttons[1]).toHaveTextContent('O')
    fireEvent.click(buttons[2])
    expect(buttons[2]).toHaveTextContent('X')
  })

  it('declares X as winner when X gets three in a row', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    // X: 0, 1, 2 (top row)
    fireEvent.click(buttons[0]) // X
    fireEvent.click(buttons[3]) // O
    fireEvent.click(buttons[1]) // X
    fireEvent.click(buttons[4]) // O
    fireEvent.click(buttons[2]) // X wins
    expect(screen.getByText('Winner: X')).toBeInTheDocument()
  })

  it('prevents clicking after game is won', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    // X wins with top row
    fireEvent.click(buttons[0]) // X
    fireEvent.click(buttons[3]) // O
    fireEvent.click(buttons[1]) // X
    fireEvent.click(buttons[4]) // O
    fireEvent.click(buttons[2]) // X wins
    // Try to click another square - should remain empty
    fireEvent.click(buttons[5])
    expect(buttons[5]).toHaveTextContent('')
  })
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
