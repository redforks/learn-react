import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Game } from './components'
import { useGameStore } from './data'

afterEach(() => {
  act(() => {
    useGameStore.getState().reset()
  })
})

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

describe('Game with userEvent', () => {
  it('alternates X and O using userEvent.click', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const buttons = screen.getAllByRole('button')

    await user.click(buttons[0])
    expect(buttons[0]).toHaveTextContent('X')

    await user.click(buttons[1])
    expect(buttons[1]).toHaveTextContent('O')

    await user.click(buttons[2])
    expect(buttons[2]).toHaveTextContent('X')
  })

  it('plays a full game using userEvent', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Play a winning game for X (top row: 0, 1, 2)
    await user.click(squareButtons[0]) // X
    await user.click(squareButtons[3]) // O
    await user.click(squareButtons[1]) // X
    await user.click(squareButtons[4]) // O
    await user.click(squareButtons[2]) // X wins

    expect(screen.getByText('Winner: X')).toBeInTheDocument()
  })

  it('prevents clicking on already filled squares', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    await user.click(squareButtons[0])
    expect(squareButtons[0]).toHaveTextContent('X')

    // Try to click the same square again
    await user.click(squareButtons[0])
    // Should still be X (not O)
    expect(squareButtons[0]).toHaveTextContent('X')
  })

  it('plays draw game using userEvent', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squares = screen.getAllByRole('button').slice(0, 9)

    // Play a draw game:
    // X O X
    // X X O
    // O X O
    await user.click(squares[0]) // X
    await user.click(squares[1]) // O
    await user.click(squares[2]) // X
    await user.click(squares[5]) // O
    await user.click(squares[3]) // X
    await user.click(squares[6]) // O
    await user.click(squares[4]) // X
    await user.click(squares[8]) // O
    await user.click(squares[7]) // X

    // Game should be over but no winner declared in status
    // All squares should be filled
    squares.forEach((sq) => {
      expect(sq).toHaveTextContent(/[XO]/)
    })
  })
})

describe('Game history', () => {
  it('shows "Go to game start" button initially', () => {
    render(<Game />)
    expect(screen.getByText('Go to game start')).toBeInTheDocument()
  })

  it('adds history entry after each move', () => {
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    fireEvent.click(squareButtons[0])
    expect(screen.getByText('Go to move #1')).toBeInTheDocument()

    fireEvent.click(squareButtons[1])
    expect(screen.getByText('Go to move #2')).toBeInTheDocument()
  })

  it('jumps back to game start when clicking "Go to game start"', () => {
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Make some moves
    fireEvent.click(squareButtons[0]) // X
    fireEvent.click(squareButtons[1]) // O
    expect(squareButtons[0]).toHaveTextContent('X')
    expect(squareButtons[1]).toHaveTextContent('O')

    // Jump to start
    fireEvent.click(screen.getByText('Go to game start'))

    // Board should be empty
    expect(squareButtons[0]).toHaveTextContent('')
    expect(squareButtons[1]).toHaveTextContent('')
    expect(screen.getByText('Current player: X')).toBeInTheDocument()
  })

  it('jumps to specific move when clicking history button', () => {
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Make moves: X at 0, O at 1, X at 2
    fireEvent.click(squareButtons[0])
    fireEvent.click(squareButtons[1])
    fireEvent.click(squareButtons[2])

    // Jump to move #1 (only X at 0)
    fireEvent.click(screen.getByText('Go to move #1'))

    expect(squareButtons[0]).toHaveTextContent('X')
    expect(squareButtons[1]).toHaveTextContent('')
    expect(squareButtons[2]).toHaveTextContent('')
    expect(screen.getByText('Current player: O')).toBeInTheDocument()
  })

  it('highlights current move button with bold class', () => {
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    const startButton = screen.getByText('Go to game start')
    expect(startButton).toHaveClass('font-bold')

    fireEvent.click(squareButtons[0])
    expect(startButton).not.toHaveClass('font-bold')
    expect(screen.getByText('Go to move #1')).toHaveClass('font-bold')
  })

  it('creates new branch when making move from past state', () => {
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Make moves: X at 0, O at 1, X at 2
    fireEvent.click(squareButtons[0])
    fireEvent.click(squareButtons[1])
    fireEvent.click(squareButtons[2])

    // Jump back to move #1
    fireEvent.click(screen.getByText('Go to move #1'))

    // Make a different move
    fireEvent.click(squareButtons[3]) // O at 3

    // History should be truncated and new move added
    expect(screen.queryByText('Go to move #3')).not.toBeInTheDocument()
    expect(screen.getByText('Go to move #2')).toBeInTheDocument()
    expect(squareButtons[2]).toHaveTextContent('') // Old move #2 is gone
    expect(squareButtons[3]).toHaveTextContent('O') // New move is there
  })
})

describe('Game history with userEvent', () => {
  it('adds history entries using userEvent.click', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    await user.click(squareButtons[0])
    expect(screen.getByText('Go to move #1')).toBeInTheDocument()

    await user.click(squareButtons[1])
    expect(screen.getByText('Go to move #2')).toBeInTheDocument()
  })

  it('jumps back to game start using userEvent.click', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Make some moves
    await user.click(squareButtons[0]) // X
    await user.click(squareButtons[1]) // O
    expect(squareButtons[0]).toHaveTextContent('X')
    expect(squareButtons[1]).toHaveTextContent('O')

    // Jump to start
    await user.click(screen.getByText('Go to game start'))

    // Board should be empty
    expect(squareButtons[0]).toHaveTextContent('')
    expect(squareButtons[1]).toHaveTextContent('')
    expect(screen.getByText('Current player: X')).toBeInTheDocument()
  })

  it('jumps to specific move using userEvent.click', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Make moves: X at 0, O at 1, X at 2
    await user.click(squareButtons[0])
    await user.click(squareButtons[1])
    await user.click(squareButtons[2])

    // Jump to move #1 (only X at 0)
    await user.click(screen.getByText('Go to move #1'))

    expect(squareButtons[0]).toHaveTextContent('X')
    expect(squareButtons[1]).toHaveTextContent('')
    expect(squareButtons[2]).toHaveTextContent('')
    expect(screen.getByText('Current player: O')).toBeInTheDocument()
  })

  it('time travels through history using userEvent', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Play a full game
    await user.click(squareButtons[0]) // X
    await user.click(squareButtons[1]) // O
    await user.click(squareButtons[2]) // X
    await user.click(squareButtons[3]) // O
    await user.click(squareButtons[4]) // X

    // Jump back to move #3
    await user.click(screen.getByText('Go to move #3'))
    expect(squareButtons[0]).toHaveTextContent('X')
    expect(squareButtons[1]).toHaveTextContent('O')
    expect(squareButtons[2]).toHaveTextContent('X')
    expect(squareButtons[3]).toHaveTextContent('')

    // Jump back to start
    await user.click(screen.getByText('Go to game start'))
    squareButtons.forEach((sq) => {
      expect(sq).toHaveTextContent('')
    })
  })

  it('creates new branch from past state using userEvent', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const squareButtons = screen.getAllByRole('button').slice(0, 9)

    // Make moves: X at 0, O at 1, X at 2
    await user.click(squareButtons[0])
    await user.click(squareButtons[1])
    await user.click(squareButtons[2])

    // Jump back to move #1
    await user.click(screen.getByText('Go to move #1'))

    // Make a different move
    await user.click(squareButtons[3]) // O at 3

    // History should be truncated and new move added
    expect(screen.queryByText('Go to move #3')).not.toBeInTheDocument()
    expect(screen.getByText('Go to move #2')).toBeInTheDocument()
    expect(squareButtons[2]).toHaveTextContent('') // Old move #2 is gone
    expect(squareButtons[3]).toHaveTextContent('O') // New move is there
  })
})
