import type { RouteObject } from 'react-router-dom'
import { Game } from './components'

export default {
  path: 'tic-tac-toe',
  Component: Game,
} as const satisfies RouteObject
