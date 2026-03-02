import type { Product } from './components'

export const PRODUCTS: Array<Product> = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
]

export function loader({ request }: { request: Request }): Product[] {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') ?? ''
  const inStockOnly = url.searchParams.get('inStockOnly') === 'true'

  return PRODUCTS.filter((p) => {
    if (inStockOnly && !p.stocked) {
      return false
    }

    if (search && p.name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
      return false
    }
    return true
  })
}
