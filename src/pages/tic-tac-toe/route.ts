import { createRoute } from '@tanstack/react-router'
import { layoutRoute } from '../../routes'
import { Game } from './components'

export const ticTacToeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'tic-tac-toe',
  component: Game,
})
