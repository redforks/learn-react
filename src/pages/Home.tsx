import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      role="img"
      aria-label="Light mode"
    >
      <title>Light mode</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      role="img"
      aria-label="Dark mode"
    >
      <title>Dark mode</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  )
}

export default function Home() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen p-8 flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {resolvedTheme === 'dark' ? (
            <SunIcon className="size-5" />
          ) : (
            <MoonIcon className="size-5" />
          )}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Learn React</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button variant="outline" asChild>
            <Link to="/tic-tac-toe">Tic-Tac-Toe</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/todo">Todo</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/product-table">Product Table</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
