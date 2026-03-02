import { useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router-dom'
import type { TodoItem } from './data'
import { countRemaining, Intent } from './data'

export function Todo() {
  const todos = useLoaderData<TodoItem[]>()
  const remaining = countRemaining(todos)

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <AddTodoForm />

      {todos.length > 0 && (
        <p className="text-sm text-zinc-500 mb-3">
          {remaining} item{remaining !== 1 ? 's' : ''} remaining
        </p>
      )}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItemRow key={todo.id} todo={todo} />
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-zinc-400 py-8">
          No todos yet. Add one above!
        </p>
      )}
    </div>
  )
}

function AddTodoForm() {
  const [input, setInput] = useState('')
  const fetcher = useFetcher()

  // Clear input after successful submission
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setInput('')
    }
  }, [fetcher.state, fetcher.data])

  function handleSubmit(e: React.SyntheticEvent) {
    const trimmed = input.trim()
    if (!trimmed) {
      e.preventDefault()
    }
    // Let fetcher.Form handle the submission naturally
  }

  return (
    <fetcher.Form
      method="post"
      className="flex gap-2 mb-6"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="intent" value={Intent.Create} />
      <input
        type="text"
        name="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add
      </button>
    </fetcher.Form>
  )
}

type TodoItemRowProps = {
  todo: TodoItem
}

function TodoItemRow({ todo }: TodoItemRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingText, setEditingText] = useState(todo.text)
  const fetcher = useFetcher()

  function handleToggle() {
    fetcher.submit(
      { intent: Intent.Toggle, id: String(todo.id) },
      { method: 'post' },
    )
  }

  function handleDelete() {
    fetcher.submit(
      { intent: Intent.Delete, id: String(todo.id) },
      { method: 'post' },
    )
  }

  function handleStartEditing() {
    setIsEditing(true)
    setEditingText(todo.text)
  }

  function handleSave() {
    const trimmed = editingText.trim()
    if (!trimmed) return
    fetcher.submit(
      { intent: Intent.Update, id: String(todo.id), text: trimmed },
      { method: 'post' },
    )
    setIsEditing(false)
  }

  function handleCancelEditing() {
    setIsEditing(false)
    setEditingText(todo.text)
  }

  return (
    <li className="flex items-center gap-3 border border-zinc-200 rounded px-3 py-2 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="size-4 accent-blue-500"
      />

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancelEditing()
            }}
            className="flex-1 border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={handleSave}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancelEditing}
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-zinc-400' : ''}`}
          >
            {todo.text}
          </span>
          <button
            type="button"
            onClick={handleStartEditing}
            className="text-sm text-zinc-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        </>
      )}
    </li>
  )
}
