import { useState } from 'react'

enum Player {
  X = 'X',
  O = 'O',
}

namespace Player {
  export function toggle(player: Player): Player {
    return player === Player.X ? Player.O : Player.X
  }
}

interface SquareProps {
  value: Player | null
  onClick: () => void
}

function Square({ value, onClick }: SquareProps) {
  return (
    <button
      type="button"
      className="bg-white border border-zinc-500 text-2xl font-bold size-8 -mr-px -mt-px text-center"
      onClick={onClick}
    >
      {value}
    </button>
  )
}

export default function Board() {
  const [squares, setSquares] = useState<Array<Player | null>>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.X)

  function handleClick(index: number) {
    if (squares[index]) return

    const nextSquares = squares.slice()
    nextSquares[index] = currentPlayer
    setSquares(nextSquares)
    setCurrentPlayer(Player.toggle(currentPlayer))
  }

  return (
    <div className="table border-collapse">
      <div className="table-row">
        <Square value={squares[0]} onClick={() => handleClick(0)} />
        <Square value={squares[1]} onClick={() => handleClick(1)} />
        <Square value={squares[2]} onClick={() => handleClick(2)} />
      </div>
      <div className="table-row">
        <Square value={squares[3]} onClick={() => handleClick(3)} />
        <Square value={squares[4]} onClick={() => handleClick(4)} />
        <Square value={squares[5]} onClick={() => handleClick(5)} />
      </div>
      <div className="table-row">
        <Square value={squares[6]} onClick={() => handleClick(6)} />
        <Square value={squares[7]} onClick={() => handleClick(7)} />
        <Square value={squares[8]} onClick={() => handleClick(8)} />
      </div>
    </div>
  )
}
