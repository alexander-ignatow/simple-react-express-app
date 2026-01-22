import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const App = (): React.JSX.Element => {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto p-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Vite + React + TypeScript</h1>
          <p className="text-muted-foreground">With Tailwind CSS and shadcn/ui components</p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Button Component</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => { setCount((count) => count + 1); }}>Count is {count}</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Textarea Component</h2>
            <Textarea placeholder="Type your message here..." rows={4} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
