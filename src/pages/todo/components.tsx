import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import type { TodoItem } from './data'
import {
  countRemaining,
  createAction,
  deleteAction,
  toggleAction,
  updateAction,
} from './data'
import { todoRoute } from './route'

export function Todo() {
  const todos = todoRoute.useLoaderData() as TodoItem[]
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
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = inputRef.current?.value.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createAction(formData)
      if (inputRef.current) inputRef.current.value = ''
      await router.invalidate()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="flex gap-2 mb-6" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        name="text"
        disabled={isSubmitting}
        placeholder="What needs to be done?"
        className="flex-1 border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        Add
      </button>
    </form>
  )
}

function TodoItemRow({ todo }: { todo: TodoItem }) {
  const [isEditing, setIsEditing] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleStartEditing() {
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
  }

  async function handleDelete() {
    const formData = new FormData()
    formData.append('id', String(todo.id))
    await deleteAction(formData)
    await router.invalidate()
  }

  async function handleUpdate(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await updateAction(formData)
    setIsEditing(false)
    await router.invalidate()
  }

  async function handleToggle() {
    if (isEditing) setIsEditing(false)
    const formData = new FormData()
    formData.append('id', String(todo.id))
    await toggleAction(formData)
    await router.invalidate()
  }

  return (
    <li className="flex items-center gap-3 border border-zinc-200 rounded px-3 py-2 group">
      {/* Toggle */}
      <div className="contents">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="size-4 accent-blue-500"
        />
      </div>

      {/* Edit/Delete form */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="contents">
          <input type="hidden" name="id" value={todo.id} />
          <div className="flex-1 flex gap-2">
            <input
              ref={editInputRef}
              key={todo.id}
              type="text"
              name="text"
              defaultValue={todo.text}
              onKeyDown={(e) => {
                if (e.key === 'Escape') cancelEditing()
              }}
              className="flex-1 border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="text-sm text-green-600 hover:text-green-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="text-sm text-zinc-500 hover:text-zinc-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleDelete} className="contents">
          <input type="hidden" name="id" value={todo.id} />
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
            type="submit"
            className="text-sm text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        </form>
      )}
    </li>
  )
}
