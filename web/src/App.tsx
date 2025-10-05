import { Outlet } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { DefaultLayout } from "@/components/layout"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </ThemeProvider>
  )
}

export default App
