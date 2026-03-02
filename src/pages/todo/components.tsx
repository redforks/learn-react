import { useState } from 'react'
import {
  createTodo,
  deleteTodo,
  toggleTodo,
  updateTodoText,
  countRemaining,
} from './data'
import type { TodoItem } from './data'

export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')

  function handleAdd() {
    setTodos((prev) => createTodo(input, prev))
    setInput('')
  }

  function handleDelete(id: number) {
    setTodos((prev) => deleteTodo(id, prev))
  }

  function handleToggle(id: number) {
    setTodos((prev) => toggleTodo(id, prev))
  }

  function handleStartEditing(todo: TodoItem) {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  function handleSave(id: number) {
    const trimmed = editingText.trim()
    if (!trimmed) return
    setTodos((prev) => updateTodoText(id, trimmed, prev))
    setEditingId(null)
    setEditingText('')
  }

  function handleCancelEditing() {
    setEditingId(null)
    setEditingText('')
  }

  const remaining = countRemaining(todos)

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="What needs to be done?"
          className="flex-1 border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleAdd}
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
          <TodoItemRow
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            editingText={editingText}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onStartEditing={handleStartEditing}
            onSave={handleSave}
            onCancelEditing={handleCancelEditing}
            onEditingTextChange={setEditingText}
          />
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

type TodoItemRowProps = {
  todo: TodoItem
  isEditing: boolean
  editingText: string
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onStartEditing: (todo: TodoItem) => void
  onSave: (id: number) => void
  onCancelEditing: () => void
  onEditingTextChange: (text: string) => void
}

function TodoItemRow({
  todo,
  isEditing,
  editingText,
  onToggle,
  onDelete,
  onStartEditing,
  onSave,
  onCancelEditing,
  onEditingTextChange,
}: TodoItemRowProps) {
  return (
    <li className="flex items-center gap-3 border border-zinc-200 rounded px-3 py-2 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="size-4 accent-blue-500"
      />

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editingText}
            onChange={(e) => onEditingTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave(todo.id)
              if (e.key === 'Escape') onCancelEditing()
            }}
            className="flex-1 border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => onSave(todo.id)}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancelEditing}
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
            onClick={() => onStartEditing(todo)}
            className="text-sm text-zinc-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="text-sm text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        </>
      )}
    </li>
  )
}
