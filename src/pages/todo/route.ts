import type { RouteObject } from 'react-router-dom'
import { Todo } from './components'

export default {
  Component: Todo,
} as const satisfies RouteObject
