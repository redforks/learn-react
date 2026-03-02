import type { RouteObject } from 'react-router-dom'
import { FilterableProductTable } from './components'
import { loader } from './data'

export default {
  path: 'product-table',
  Component: FilterableProductTable,
  loader,
} as const satisfies RouteObject
