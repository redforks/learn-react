import { Link, Outlet } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function Layout() {
  return (
    <div className="min-h-screen p-8">
      <nav className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">← Home</Link>
        </Button>
      </nav>
      <Outlet />
    </div>
  )
}
