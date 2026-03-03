import { create } from 'zustand'

export enum Player {
  X = 'X',
  O = 'O',
}

export namespace Player {
  export function toggle(player: Player): Player {
    return player === Player.X ? Player.O : Player.X
  }
}

export function calculateWinner(squares: Array<Player | null>): Player | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

type HistoryEntry = {
  squares: Array<Player | null>
}

type GameState = {
  history: HistoryEntry[]
  currentMove: number
  play: (nextSquares: Array<Player | null>) => void
  jumpTo: (move: number) => void
  reset: () => void
}

const initialHistory: HistoryEntry[] = [{ squares: Array(9).fill(null) }]

export const useGameStore = create<GameState>((set, get) => ({
  history: initialHistory,
  currentMove: 0,
  play: (nextSquares) => {
    const { history, currentMove } = get()
    const nextHistory = history
      .slice(0, currentMove + 1)
      .concat([{ squares: nextSquares }])
    set({
      history: nextHistory,
      currentMove: nextHistory.length - 1,
    })
  },
  jumpTo: (move) => {
    set({ currentMove: move })
  },
  reset: () => {
    set({
      history: initialHistory,
      currentMove: 0,
    })
  },
}))

// Selectors for derived state
export const useCurrentPlayer = () => {
  const currentMove = useGameStore((state) => state.currentMove)
  return currentMove % 2 === 0 ? Player.X : Player.O
}

export const useCurrentSquares = () => {
  const history = useGameStore((state) => state.history)
  const currentMove = useGameStore((state) => state.currentMove)
  return history[currentMove].squares
}
