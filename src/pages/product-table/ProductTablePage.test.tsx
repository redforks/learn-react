import { render, screen } from '@testing-library/react'
import ProductTablePage from './ProductTablePage'

describe('ProductTablePage', () => {
  it('renders FilterableProductTable with default products', () => {
    render(<ProductTablePage />)

    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
  })

  it('renders search bar', () => {
    render(<ProductTablePage />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /only show products in stock/i }),
    ).toBeInTheDocument()
  })
})
