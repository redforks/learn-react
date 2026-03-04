import type { RouteObject } from 'react-router-dom'
import { FilterableProductTable } from './components'
import { action, loader } from './data'

export default {
  path: 'product-table',
  Component: FilterableProductTable,
  loader,
  action,
} as const satisfies RouteObject
