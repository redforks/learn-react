import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  FilterableProductTable,
  type Product,
  ProductCategoryRow,
  ProductRow,
  ProductTable,
  SearchBar,
} from './components'

const PRODUCTS: Array<Product> = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
]

describe('ProductCategoryRow', () => {
  it('renders category name', () => {
    render(
      <table>
        <tbody>
          <ProductCategoryRow category="Fruits" />
        </tbody>
      </table>,
    )
    expect(screen.getByText('Fruits')).toBeInTheDocument()
  })

  it('renders as table header with colSpan=2', () => {
    const { container } = render(
      <table>
        <tbody>
          <ProductCategoryRow category="Test" />
        </tbody>
      </table>,
    )
    const th = container.querySelector('th')
    expect(th).toHaveAttribute('colSpan', '2')
  })
})

describe('ProductRow', () => {
  it('renders product name and price', () => {
    const product = {
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    }
    render(<ProductRow product={product} />)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('$1')).toBeInTheDocument()
  })

  it('renders stocked product in normal text', () => {
    const product = {
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    }
    const { container } = render(<ProductRow product={product} />)

    const nameSpan = container.querySelector('span')
    expect(nameSpan).not.toHaveClass('text-red-500')
  })

  it('renders out-of-stock product in red text', () => {
    const product = {
      category: 'Fruits',
      price: '$2',
      stocked: false,
      name: 'Passionfruit',
    }
    const { container } = render(<ProductRow product={product} />)

    const nameSpan = container.querySelector('span')
    expect(nameSpan).toHaveClass('text-red-500')
  })
})

describe('ProductTable', () => {
  it('renders table with name and price headers', () => {
    render(<ProductTable products={[]} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
  })

  it('renders products grouped by category', () => {
    const products = [
      { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
      { category: 'Fruits', price: '$2', stocked: false, name: 'Banana' },
      { category: 'Vegetables', price: '$1', stocked: true, name: 'Carrot' },
    ]
    render(<ProductTable products={products} />)

    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
  })

  it('renders empty table when no products', () => {
    render(<ProductTable products={[]} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('renders only category header once per category', () => {
    const products = [
      { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
      { category: 'Fruits', price: '$2', stocked: true, name: 'Orange' },
    ]
    const { container } = render(<ProductTable products={products} />)

    const categoryHeaders = container.querySelectorAll('th[colSpan="2"]')
    expect(categoryHeaders).toHaveLength(1)
  })
})

describe('SearchBar', () => {
  it('renders search input and checkbox', () => {
    const mockSetArgs = vi.fn()
    render(<SearchBar args={{}} setArgs={mockSetArgs} />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /only show products in stock/i }),
    ).toBeInTheDocument()
  })

  it('calls setArgs when typing in search input', () => {
    const mockSetArgs = vi.fn()
    render(<SearchBar args={{}} setArgs={mockSetArgs} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'apple' } })

    expect(mockSetArgs).toHaveBeenCalledWith({ search: 'apple' })
  })

  it('preserves existing args when updating search', () => {
    const mockSetArgs = vi.fn()
    render(<SearchBar args={{ inStockOnly: true }} setArgs={mockSetArgs} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'fruit' } })

    expect(mockSetArgs).toHaveBeenCalledWith({
      inStockOnly: true,
      search: 'fruit',
    })
  })

  it('calls setArgs when toggling in-stock checkbox', () => {
    const mockSetArgs = vi.fn()
    render(<SearchBar args={{}} setArgs={mockSetArgs} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    fireEvent.click(checkbox)

    expect(mockSetArgs).toHaveBeenCalledWith({ inStockOnly: true })
  })

  it('preserves existing args when toggling checkbox', () => {
    const mockSetArgs = vi.fn()
    render(<SearchBar args={{ search: 'apple' }} setArgs={mockSetArgs} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    fireEvent.click(checkbox)

    expect(mockSetArgs).toHaveBeenCalledWith({
      search: 'apple',
      inStockOnly: true,
    })
  })

  it('displays current search value', () => {
    const mockSetArgs = vi.fn()
    render(<SearchBar args={{ search: 'dragon' }} setArgs={mockSetArgs} />)

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    expect(input.value).toBe('dragon')
  })
})

describe('FilterableProductTable', () => {
  it('renders all products by default', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.getByText('Pumpkin')).toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()
  })

  it('filters products by search text (case insensitive)', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'apple' } })

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.queryByText('Dragonfruit')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinach')).not.toBeInTheDocument()
  })

  it('filters products by search text with uppercase input', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'DRAGON' } })

    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('filters products by search text with partial match', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'fruit' } })

    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinach')).not.toBeInTheDocument()
  })

  it('filters to show only in-stock products when checkbox is checked', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    fireEvent.click(checkbox)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.queryByText('Passionfruit')).not.toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.queryByText('Pumpkin')).not.toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()
  })

  it('shows all products again when checkbox is unchecked', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })

    // Check the checkbox
    fireEvent.click(checkbox)
    expect(screen.queryByText('Passionfruit')).not.toBeInTheDocument()

    // Uncheck the checkbox
    fireEvent.click(checkbox)
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
  })

  it('combines search and in-stock filters', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const input = screen.getByPlaceholderText('Search...')
    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })

    // Search for "fruit" - should show Dragonfruit and Passionfruit
    fireEvent.change(input, { target: { value: 'fruit' } })
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()

    // Check in-stock only - should now only show Dragonfruit (stocked)
    fireEvent.click(checkbox)
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.queryByText('Passionfruit')).not.toBeInTheDocument()
  })

  it('shows no results when filter matches nothing', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'nonexistent' } })

    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinach')).not.toBeInTheDocument()
  })

  it('clears search filter and shows all products', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'apple' } })
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.queryByText('Dragonfruit')).not.toBeInTheDocument()

    // Clear the search
    fireEvent.change(input, { target: { value: '' } })
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
  })

  it('renders category headers even when filter reduces products in category', () => {
    render(<FilterableProductTable products={PRODUCTS} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    fireEvent.click(checkbox)

    // Vegetables category should still show (has Spinach and Peas in stock)
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()
  })

  it('handles empty product list', () => {
    render(<FilterableProductTable products={[]} />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
  })
})
