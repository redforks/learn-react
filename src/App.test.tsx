import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

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
})
