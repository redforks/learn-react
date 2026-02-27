import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
  index('./routes/_index.tsx'),
  route('tic-tac-toe', './routes/tic-tac-toe.tsx'),
  route('todo', './routes/todo.tsx'),
  route('product-table', './routes/product-table.tsx'),
] satisfies RouteConfig
