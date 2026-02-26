import { useState } from 'react'

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')

  function addTodo() {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }])
    setInput('')
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function startEditing(todo: TodoItem) {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  function saveEditing(id: number) {
    const trimmed = editingText.trim()
    if (!trimmed) return
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t)))
    setEditingId(null)
    setEditingText('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingText('')
  }

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          className="flex-1 border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      {todos.length > 0 && (
        <p className="text-sm text-zinc-500 mb-3">
          {remaining} item{remaining !== 1 ? 's' : ''} remaining
        </p>
      )}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 border border-zinc-200 rounded px-3 py-2 group"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="size-4 accent-blue-500"
            />

            {editingId === todo.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditing(todo.id)
                    if (e.key === 'Escape') cancelEditing()
                  }}
                  className="flex-1 border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => saveEditing(todo.id)}
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
                  onClick={() => startEditing(todo)}
                  className="text-sm text-zinc-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-sm text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </>
            )}
          </li>
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
