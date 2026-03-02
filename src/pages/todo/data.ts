export type TodoItem = {
  id: number
  text: string
  completed: boolean
}

export function createTodo(text: string, todos: TodoItem[]): TodoItem[] {
  const trimmed = text.trim()
  if (!trimmed) return todos
  return [...todos, { id: Date.now(), text: trimmed, completed: false }]
}

export function deleteTodo(id: number, todos: TodoItem[]): TodoItem[] {
  return todos.filter((t) => t.id !== id)
}

export function toggleTodo(id: number, todos: TodoItem[]): TodoItem[] {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
}

export function updateTodoText(
  id: number,
  text: string,
  todos: TodoItem[],
): TodoItem[] {
  const trimmed = text.trim()
  if (!trimmed) return todos
  return todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
}

export function countRemaining(todos: TodoItem[]): number {
  return todos.filter((t) => !t.completed).length
}
