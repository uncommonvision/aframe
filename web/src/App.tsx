import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <main className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Kubey
          </h1>
          <p className="text-lg text-muted-foreground">
            A modern React application with Vite, TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
