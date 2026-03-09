import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Todo List</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <AddTodoForm />

          {todos.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {remaining} item{remaining !== 1 ? 's' : ''} remaining
            </p>
          )}

          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoItemRow key={todo.id} todo={todo} />
            ))}
          </ul>

          {todos.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No todos yet. Add one above!
            </p>
          )}
        </CardContent>
      </Card>
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
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        ref={inputRef}
        name="text"
        disabled={isSubmitting}
        placeholder="What needs to be done?"
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting}>
        Add
      </Button>
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

  async function handleToggle(_checked: boolean) {
    if (isEditing) setIsEditing(false)
    const formData = new FormData()
    formData.append('id', String(todo.id))
    await toggleAction(formData)
    await router.invalidate()
  }

  return (
    <li className="flex items-center gap-3 border rounded-lg px-3 py-2 group">
      <Checkbox checked={todo.completed} onCheckedChange={handleToggle} />

      {isEditing ? (
        <form onSubmit={handleUpdate} className="contents">
          <input type="hidden" name="id" value={todo.id} />
          <div className="flex-1 flex gap-2">
            <Input
              ref={editInputRef}
              key={todo.id}
              name="text"
              defaultValue={todo.text}
              onKeyDown={(e) => {
                if (e.key === 'Escape') cancelEditing()
              }}
              className="flex-1 h-8"
            />
            <Button type="submit" size="sm" variant="secondary">
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleDelete} className="contents">
          <input type="hidden" name="id" value={todo.id} />
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {todo.text}
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleStartEditing}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Edit
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </Button>
        </form>
      )}
    </li>
  )
}
