import { useState } from 'react'
import { CardList } from "@/containers"
import { ComparisonBanner } from "@/components/ui"
import type { CardData } from "@/containers"
import { DefaultLayout } from "@/components/layout"

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

export default function HomePage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(selectedIds)
  }

  return (
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

        <ComparisonBanner selectedItems={selectedItems} />

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
      </div>
    </DefaultLayout>
  )
}
