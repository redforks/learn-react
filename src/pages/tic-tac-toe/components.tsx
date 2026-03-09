import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  calculateWinner,
  type Player,
  useCurrentPlayer,
  useCurrentSquares,
  useGameStore,
} from './data'

type SquareProps = {
  value: Player | null
  onClick: () => void
}

function Square({ value, onClick }: SquareProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-10 text-2xl font-bold rounded-none -mr-px -mt-px align-top"
      onClick={onClick}
    >
      {value}
    </Button>
  )
}

type BoardProps = {
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

export function Game() {
  const history = useGameStore((state) => state.history)
  const currentMove = useGameStore((state) => state.currentMove)
  const play = useGameStore((state) => state.play)
  const jumpTo = useGameStore((state) => state.jumpTo)

  const currentPlayer = useCurrentPlayer()
  const currentSquares = useCurrentSquares()

  function handlePlay(nextSquares: Array<Player | null>) {
    play(nextSquares)
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
        <Button
          variant={move === currentMove ? 'default' : 'ghost'}
          size="sm"
          onClick={() => jumpTo(move)}
          className={move === currentMove ? 'font-bold' : ''}
        >
          {description}
        </Button>
      </li>
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Tic-Tac-Toe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <Board
              squares={currentSquares}
              currentPlayer={currentPlayer}
              onPlay={handlePlay}
            />
          </div>
          <div>
            <ol className="flex flex-col gap-1">{moves}</ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
