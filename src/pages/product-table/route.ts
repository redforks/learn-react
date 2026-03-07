import { createRoute } from '@tanstack/react-router'
import { layoutRoute } from '../../routes'
import { FilterableProductTable } from './components'
import { loader, searchSchema } from './data'

export const productRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'product-table',
  component: FilterableProductTable,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => {
    return loader(deps)
  },
})
