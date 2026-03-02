import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRoutesStub } from 'react-router-dom'
import { Todo } from './components'
import { action, loader, STORAGE_KEY } from './data'

function renderTodo(
  initialTodos: { id: number; text: string; completed: boolean }[] = [],
) {
  localStorage.setItem('todos', JSON.stringify(initialTodos))

  const Stub = createRoutesStub([
    {
      path: '/',
      Component: Todo,
      loader,
      action,
    },
  ])

  return render(<Stub initialEntries={['/']} />)
}

describe('Todo', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state message when no todos exist', async () => {
    renderTodo()
    expect(
      await screen.findByText('No todos yet. Add one above!'),
    ).toBeInTheDocument()
  })

  it('renders input field and add button', async () => {
    renderTodo()
    expect(
      await screen.findByPlaceholderText('What needs to be done?'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })
})

describe('Adding todos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a todo when clicking the Add button', async () => {
    renderTodo()
    const input = await screen.findByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('Buy groceries')).toBeInTheDocument()
  })

  it('adds a todo when pressing Enter', async () => {
    renderTodo()
    const input = await screen.findByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'Walk the dog' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(await screen.findByText('Walk the dog')).toBeInTheDocument()
  })

  it('clears input after adding a todo', async () => {
    renderTodo()
    const input = (await screen.findByPlaceholderText(
      'What needs to be done?',
    )) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    await waitFor(() => expect(input.value).toBe(''))
  })

  it('does not add empty todos', async () => {
    renderTodo()
    await screen.findByPlaceholderText('What needs to be done?')
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(
      await screen.findByText('No todos yet. Add one above!'),
    ).toBeInTheDocument()
  })

  it('trims whitespace from todo text', async () => {
    renderTodo()
    const input = await screen.findByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: '   Trimmed task   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('Trimmed task')).toBeInTheDocument()
  })

  it('does not add whitespace-only todos', async () => {
    renderTodo()
    const input = await screen.findByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(
      await screen.findByText('No todos yet. Add one above!'),
    ).toBeInTheDocument()
  })
})

describe('Deleting todos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deletes a todo when clicking Delete button', async () => {
    renderTodo([{ id: 1, text: 'Task to delete', completed: false }])
    await screen.findByText('Task to delete')
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() =>
      expect(screen.queryByText('Task to delete')).not.toBeInTheDocument(),
    )
    expect(
      await screen.findByText('No todos yet. Add one above!'),
    ).toBeInTheDocument()
  })
})

describe('Toggling todos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('toggles todo completion when clicking checkbox', async () => {
    renderTodo([{ id: 1, text: 'Complete me', completed: false }])
    const checkbox = (await screen.findByRole('checkbox')) as HTMLInputElement
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    await waitFor(() => expect(checkbox).toBeChecked())

    fireEvent.click(checkbox)
    await waitFor(() => expect(checkbox).not.toBeChecked())
  })

  it('applies line-through style to completed todos', async () => {
    renderTodo([{ id: 1, text: 'Done task', completed: false }])
    const todoText = await screen.findByText('Done task')
    expect(todoText).not.toHaveClass('line-through')

    fireEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(todoText).toHaveClass('line-through'))
  })
})

describe('Editing todos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows edit input when clicking Edit button', async () => {
    renderTodo([{ id: 1, text: 'Original text', completed: false }])
    await screen.findByText('Original text')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByDisplayValue('Original text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('saves edited todo when clicking Save', async () => {
    renderTodo([{ id: 1, text: 'Old text', completed: false }])
    await screen.findByText('Old text')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Old text')
    fireEvent.change(editInput, { target: { value: 'New text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('New text')).toBeInTheDocument()
    expect(screen.queryByText('Old text')).not.toBeInTheDocument()
  })

  it('saves edited todo when pressing Enter', async () => {
    renderTodo([{ id: 1, text: 'Before edit', completed: false }])
    await screen.findByText('Before edit')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Before edit')
    fireEvent.change(editInput, { target: { value: 'After edit' } })
    fireEvent.keyDown(editInput, { key: 'Enter' })

    expect(await screen.findByText('After edit')).toBeInTheDocument()
  })

  it('cancels editing when clicking Cancel', async () => {
    renderTodo([{ id: 1, text: 'Keep this', completed: false }])
    await screen.findByText('Keep this')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Keep this')
    fireEvent.change(editInput, { target: { value: 'Changed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Keep this')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Changed')).not.toBeInTheDocument()
  })

  it('cancels editing when pressing Escape', async () => {
    renderTodo([{ id: 1, text: 'Original', completed: false }])
    await screen.findByText('Original')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Original')
    fireEvent.change(editInput, { target: { value: 'Modified' } })
    fireEvent.keyDown(editInput, { key: 'Escape' })

    expect(screen.getByText('Original')).toBeInTheDocument()
  })

  it('trims whitespace when saving', async () => {
    renderTodo([{ id: 1, text: 'Task', completed: false }])
    await screen.findByText('Task')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Task')
    fireEvent.change(editInput, { target: { value: '   Trimmed task   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Trimmed task')).toBeInTheDocument()
  })

  it('does not save empty or whitespace-only edits', async () => {
    renderTodo([{ id: 1, text: 'Important task', completed: false }])
    await screen.findByText('Important task')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue(
      'Important task',
    ) as HTMLInputElement
    fireEvent.change(editInput, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    // Should still be in edit mode (Save button visible)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    // Original text remains unchanged
    expect(screen.queryByText('Important task')).not.toBeInTheDocument()
  })
})

describe('Remaining count', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('shows remaining count when todos exist', async () => {
    renderTodo()
    const input = await screen.findByPlaceholderText('What needs to be done?')

    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('1 item remaining')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('2 items remaining')).toBeInTheDocument()
  })

  it('updates remaining count when toggling todos', async () => {
    renderTodo([{ id: 1, text: 'Task', completed: false }])
    expect(await screen.findByText('1 item remaining')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox'))
    expect(await screen.findByText('0 items remaining')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox'))
    expect(await screen.findByText('1 item remaining')).toBeInTheDocument()
  })

  it('does not show remaining count when no todos exist', async () => {
    renderTodo()
    await screen.findByText('No todos yet. Add one above!')
    expect(screen.queryByText(/item.*remaining/)).not.toBeInTheDocument()
  })
})
