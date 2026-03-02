import type { RouteObject } from 'react-router-dom'
import { FilterableProductTable } from './components'
import { loader } from './data'

export default {
  Component: FilterableProductTable,
  loader,
} as const satisfies RouteObject
