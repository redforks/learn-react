import { fireEvent, render, screen } from '@testing-library/react'
import Game from './Game'

describe('Game', () => {
  it('renders the board', () => {
    render(<Game />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10) // 9 squares + 1 history button
  })

  it('alternates X and O on clicks', () => {
    render(<Game />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveTextContent('X')
    fireEvent.click(buttons[1])
    expect(buttons[1]).toHaveTextContent('O')
    fireEvent.click(buttons[2])
    expect(buttons[2]).toHaveTextContent('X')
  })

  it('declares X as winner when X gets three in a row', () => {
    render(<Game />)
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
    render(<Game />)
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
