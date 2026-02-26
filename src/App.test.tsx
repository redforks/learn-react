import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the board', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
  })

  it('toggles X when a square is clicked', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveTextContent('X')
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveTextContent('')
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveTextContent('X')
  })
})
