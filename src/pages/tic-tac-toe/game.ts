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
