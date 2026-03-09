import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col gap-6">
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
