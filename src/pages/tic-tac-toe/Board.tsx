import { calculateWinner, type Player } from './game'

interface SquareProps {
  value: Player | null
  onClick: () => void
}

function Square({ value, onClick }: SquareProps) {
  return (
    <button
      type="button"
      className="bg-white border border-zinc-500 text-2xl font-bold size-8 -mr-px -mt-px align-top"
      onClick={onClick}
    >
      {value}
    </button>
  )
}

interface BoardProps {
  squares: Array<Player | null>
  currentPlayer: Player
  onPlay: (nextSquares: Array<Player | null>) => void
}

export function Board({ squares, currentPlayer, onPlay }: BoardProps) {
  const winner = calculateWinner(squares)

  function handleClick(index: number) {
    if (squares[index] || winner) return

    const nextSquares = squares.slice()
    nextSquares[index] = currentPlayer
    onPlay(nextSquares)
  }

  return (
    <>
      <div className="mb-4 text-xl font-semibold">
        {winner ? `Winner: ${winner}` : `Current player: ${currentPlayer}`}
      </div>
      <div>
        <div>
          <Square value={squares[0]} onClick={() => handleClick(0)} />
          <Square value={squares[1]} onClick={() => handleClick(1)} />
          <Square value={squares[2]} onClick={() => handleClick(2)} />
        </div>
        <div>
          <Square value={squares[3]} onClick={() => handleClick(3)} />
          <Square value={squares[4]} onClick={() => handleClick(4)} />
          <Square value={squares[5]} onClick={() => handleClick(5)} />
        </div>
        <div>
          <Square value={squares[6]} onClick={() => handleClick(6)} />
          <Square value={squares[7]} onClick={() => handleClick(7)} />
          <Square value={squares[8]} onClick={() => handleClick(8)} />
        </div>
      </div>
    </>
  )
}
