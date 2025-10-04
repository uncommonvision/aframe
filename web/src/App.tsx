import { useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { DefaultLayout } from "@/components/layout"
import { CardList } from "@/containers"
import type { CardData } from "@/containers"

// Sample data for demonstration
const sampleItems: CardData[] = [
  {
    id: '1',
    title: 'React Framework',
    description: 'A JavaScript library for building user interfaces with component-based architecture.',
  },
  {
    id: '2',
    title: 'Vue.js Framework',
    description: 'The progressive JavaScript framework for building modern web applications.',
  },
  {
    id: '3',
    title: 'Angular Framework',
    description: 'A platform for building mobile and desktop web applications using TypeScript.',
  },
  {
    id: '4',
    title: 'Svelte Framework',
    description: 'A radical new approach to building user interfaces with compile-time optimizations.',
  },
  {
    id: '5',
    title: 'Next.js Framework',
    description: 'The React framework for production with hybrid static & server rendering.',
  },
  {
    id: '6',
    title: 'Nuxt.js Framework',
    description: 'The intuitive Vue framework for building universal applications.',
  }
]

function App() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(selectedIds)
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DefaultLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Compare Frameworks
            </h1>
            <p className="text-lg text-muted-foreground">
              Select items to compare their features and capabilities.
            </p>
          </div>

          <CardList 
            items={sampleItems}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
            showSelectionCount={true}
            emptyMessage="No frameworks available"
            gridCols={{
              default: 1,
              sm: 2,
              lg: 3,
              xl: 4
            }}
          />

          {selectedItems.length > 1 && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground mb-2">
                Ready to Compare
              </h3>
              <p className="text-sm text-muted-foreground">
                You have selected {selectedItems.length} items. Comparison functionality will be added in future updates.
              </p>
            </div>
          )}
        </div>
      </DefaultLayout>
    </ThemeProvider>
  )
}

export default App
