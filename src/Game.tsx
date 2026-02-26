import { useState } from 'react'
import { Board } from './Board'
import { Player } from './game'

interface HistoryEntry {
  squares: Array<Player | null>
}

export default function Game() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { squares: Array(9).fill(null) },
  ])
  const [currentMove, setCurrentMove] = useState(0)

  const currentPlayer: Player = currentMove % 2 === 0 ? Player.X : Player.O
  const currentSquares = history[currentMove].squares

  function handlePlay(nextSquares: Array<Player | null>) {
    const nextHistory: HistoryEntry[] = history
      .slice(0, currentMove + 1)
      .concat([{ squares: nextSquares }])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_, move) => {
    let description: string
    if (move > 0) {
      description = `Go to move #${move}`
    } else {
      description = 'Go to game start'
    }
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: move numbers are stable in game history
      <li key={move}>
        <button
          type="button"
          onClick={() => jumpTo(move)}
          className={move === currentMove ? 'font-bold' : ''}
        >
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="flex gap-8">
      <div className="flex flex-col">
        <Board
          squares={currentSquares}
          currentPlayer={currentPlayer}
          onPlay={handlePlay}
        />
      </div>
      <div>
        <ol className="pl-4 list-decimal">{moves}</ol>
      </div>
    </div>
  )
}
