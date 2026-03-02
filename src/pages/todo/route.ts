import type { RouteObject } from 'react-router-dom'
import { Todo } from './components'
import { action, loader } from './data'

export default {
  path: 'todo',
  Component: Todo,
  loader,
  action,
} as const satisfies RouteObject
