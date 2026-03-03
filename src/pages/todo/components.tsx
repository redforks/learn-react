import { useRef, useState } from 'react'
import { useFetcher, useLoaderData, useSubmit } from 'react-router-dom'
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
  const inputRef = useRef<HTMLInputElement>(null)
  const fetcher = useFetcher()

  // Clear input after successful submission
  if (fetcher.state === 'idle' && fetcher.data && inputRef.current) {
    inputRef.current.value = ''
  }

  function handleSubmit(e: React.SyntheticEvent) {
    const trimmed = inputRef.current?.value.trim()
    if (!trimmed) {
      e.preventDefault()
    }
  }

  return (
    <fetcher.Form
      method="post"
      className="flex gap-2 mb-6"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="intent" value={Intent.Create} />
      <input
        ref={inputRef}
        type="text"
        name="text"
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

function TodoItemRow({ todo }: { todo: TodoItem }) {
  const [isEditing, setIsEditing] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)
  const processedDataRef = useRef<unknown>(null)
  const toggleFetcher = useFetcher()
  const actionFetcher = useFetcher()
  const submit = useSubmit()

  // Exit edit mode after successful save (only once per fetcher response)
  if (
    actionFetcher.state === 'idle' &&
    actionFetcher.data &&
    actionFetcher.data !== processedDataRef.current &&
    isEditing
  ) {
    processedDataRef.current = actionFetcher.data
    setIsEditing(false)
  }

  function handleStartEditing() {
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
  }

  return (
    <li className="flex items-center gap-3 border border-zinc-200 rounded px-3 py-2 group">
      {/* Toggle form */}
      <toggleFetcher.Form method="post" className="contents">
        <input type="hidden" name="id" value={todo.id} />
        <input type="hidden" name="intent" value={Intent.Toggle} />
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => submit(e.target.form)}
          className="size-4 accent-blue-500"
        />
      </toggleFetcher.Form>

      {/* Edit/Delete form */}
      <actionFetcher.Form method="post" className="contents">
        <input type="hidden" name="id" value={todo.id} />

        {isEditing ? (
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
              name="intent"
              value={Intent.Update}
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
              type="submit"
              name="intent"
              value={Intent.Delete}
              className="text-sm text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </>
        )}
      </actionFetcher.Form>
    </li>
  )
}
