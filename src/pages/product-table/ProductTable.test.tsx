import { render, screen } from '@testing-library/react'
import ProductTable from './ProductTable'

describe('ProductTable', () => {
  it('renders FilterableProductTable with default products', () => {
    render(<ProductTable />)

    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
  })

  it('renders search bar', () => {
    render(<ProductTable />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /only show products in stock/i }),
    ).toBeInTheDocument()
  })
})
