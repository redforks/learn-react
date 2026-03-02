import { fireEvent, render, screen } from '@testing-library/react'
import { Todo } from './components'

describe('Todo', () => {
  it('renders empty state message when no todos exist', () => {
    render(<Todo />)
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })

  it('renders input field and add button', () => {
    render(<Todo />)
    expect(
      screen.getByPlaceholderText('What needs to be done?'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })
})

describe('Adding todos', () => {
  it('adds a todo when clicking the Add button', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('adds a todo when pressing Enter', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Walk the dog' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })

  it('clears input after adding a todo', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText(
      'What needs to be done?',
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(input.value).toBe('')
  })

  it('does not add empty todos', () => {
    render(<Todo />)
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })

  it('trims whitespace from todo text', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: '   Trimmed task   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Trimmed task')).toBeInTheDocument()
  })

  it('does not add whitespace-only todos', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })
})

describe('Deleting todos', () => {
  it('deletes a todo when clicking Delete button', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Task to delete' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument()
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })
})

describe('Toggling todos', () => {
  it('toggles todo completion when clicking checkbox', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Complete me' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('applies line-through style to completed todos', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Done task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    const todoText = screen.getByText('Done task')
    expect(todoText).not.toHaveClass('line-through')

    fireEvent.click(screen.getByRole('checkbox'))
    expect(todoText).toHaveClass('line-through')
  })
})

describe('Editing todos', () => {
  it('shows edit input when clicking Edit button', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Original text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByDisplayValue('Original text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('saves edited todo when clicking Save', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Old text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Old text')
    fireEvent.change(editInput, { target: { value: 'New text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('New text')).toBeInTheDocument()
    expect(screen.queryByText('Old text')).not.toBeInTheDocument()
  })

  it('saves edited todo when pressing Enter', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Before edit' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Before edit')
    fireEvent.change(editInput, { target: { value: 'After edit' } })
    fireEvent.keyDown(editInput, { key: 'Enter' })

    expect(screen.getByText('After edit')).toBeInTheDocument()
  })

  it('cancels editing when clicking Cancel', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Keep this' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Keep this')
    fireEvent.change(editInput, { target: { value: 'Changed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Keep this')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Changed')).not.toBeInTheDocument()
  })

  it('cancels editing when pressing Escape', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Original' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Original')
    fireEvent.change(editInput, { target: { value: 'Modified' } })
    fireEvent.keyDown(editInput, { key: 'Escape' })

    expect(screen.getByText('Original')).toBeInTheDocument()
  })

  it('trims whitespace when saving', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Task')
    fireEvent.change(editInput, { target: { value: '   Trimmed task   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Trimmed task')).toBeInTheDocument()
  })

  it('does not save empty or whitespace-only edits', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Important task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue(
      'Important task',
    ) as HTMLInputElement
    fireEvent.change(editInput, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    // Should still be in edit mode (Save button visible) with whitespace value
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(editInput.value).toBe('   ')
    // Original text should not be replaced
    expect(screen.queryByText('Important task')).not.toBeInTheDocument()
  })
})

describe('Remaining count', () => {
  it('shows remaining count when todos exist', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')

    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('1 item remaining')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('2 items remaining')).toBeInTheDocument()
  })

  it('updates remaining count when toggling todos', () => {
    render(<Todo />)
    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('1 item remaining')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('0 items remaining')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('1 item remaining')).toBeInTheDocument()
  })

  it('does not show remaining count when no todos exist', () => {
    render(<Todo />)
    expect(screen.queryByText(/item.*remaining/)).not.toBeInTheDocument()
  })
})
