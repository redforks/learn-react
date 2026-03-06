import { createRoute } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { layoutRoute } from '../../routes'
import { FilterableProductTable } from './components'
import { loader } from './data'

const searchSchema = z.object({
  search: fallback(z.string(), '').default(''),
  inStockOnly: fallback(z.boolean(), false).default(false),
})

export const productRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'product-table',
  component: FilterableProductTable,
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => {
    const url = new URL('http://localhost')
    if (deps.search) url.searchParams.set('search', deps.search)
    if (deps.inStockOnly) url.searchParams.set('inStockOnly', 'true')
    return loader(url.searchParams.toString())
  },
})
