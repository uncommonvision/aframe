import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="tw-min-h-screen tw-bg-background tw-font-sans tw-antialiased">
        <main className="tw-container tw-mx-auto tw-p-4">
          <h1 className="tw-text-4xl tw-font-bold tw-text-foreground tw-mb-4">
            Welcome to Kubey
          </h1>
          <p className="tw-text-lg tw-text-muted-foreground">
            A modern React application with Vite, TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
