import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../routes'
import { Game } from './components'

export const ticTacToeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tic-tac-toe',
  component: Game,
})
