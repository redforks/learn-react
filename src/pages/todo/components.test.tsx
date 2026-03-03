import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { Todo } from './components'
import { action, loader } from './data'
import { resetTodos, server } from './mocks'
import type { TodoItem } from './types'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetTodos()
})

afterAll(() => server.close())

function renderTodo(initialTodos: TodoItem[] = []) {
  resetTodos(initialTodos)

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
    await userEvent.type(input, '{enter}')
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
})

describe('Deleting todos', () => {
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
  it('shows edit input when clicking Edit button', async () => {
    renderTodo([{ id: 1, text: 'Original text', completed: false }])
    await screen.findByText('Original text')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByDisplayValue('Original text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('saves edited todo when clicking Save', async () => {
    const user = userEvent.setup()
    renderTodo([{ id: 1, text: 'Old text', completed: false }])
    await screen.findByText('Old text')

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const editInput = screen.getByDisplayValue('Old text')
    await user.clear(editInput)
    await user.type(editInput, 'New text')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('New text')).toBeInTheDocument()
    expect(screen.queryByText('Old text')).not.toBeInTheDocument()
  })

  it('saves edited todo when pressing Enter', async () => {
    renderTodo([{ id: 1, text: 'Before edit', completed: false }])
    await screen.findByText('Before edit')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const editInput = screen.getByDisplayValue('Before edit')
    fireEvent.change(editInput, { target: { value: 'After edit' } })
    await userEvent.type(editInput, '{enter}')

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

  it('can enter edit mode again after saving', async () => {
    renderTodo([{ id: 1, text: 'First edit', completed: false }])
    await screen.findByText('First edit')

    // First edit
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const editInput = screen.getByDisplayValue('First edit')
    fireEvent.change(editInput, { target: { value: 'Saved text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    // Wait for save to complete
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Save' }),
      ).not.toBeInTheDocument(),
    )
    expect(await screen.findByText('Saved text')).toBeInTheDocument()

    // Enter edit mode again
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByDisplayValue('Saved text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })
})

describe('Remaining count', () => {
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
