import { createRoute } from '@tanstack/react-router'
import { layoutRoute } from '../../routes'
import { FilterableProductTable } from './components'
import { loader } from './data'

export const productRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'product-table',
  component: FilterableProductTable,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      search: (search.search as string) || '',
      inStockOnly: search.inStockOnly === 'true' || search.inStockOnly === true,
    }
  },
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => {
    const url = new URL('http://localhost')
    if (deps.search) url.searchParams.set('search', deps.search)
    if (deps.inStockOnly) url.searchParams.set('inStockOnly', 'true')
    return loader({ request: new Request(url) })
  },
})
