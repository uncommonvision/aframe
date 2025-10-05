import { CardItem } from '@/components/ui'
import { useState, useEffect } from 'react'

export interface CardData {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  imageUrl?: string
}

interface CardListProps {
  items: CardData[]
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  showSelectionCount?: boolean
  emptyMessage?: string
  gridCols?: {
    default: number
    sm?: number
    lg?: number
    xl?: number
  }
}

export default function CardList({
  items,
  selectedItems = [],
  onSelectionChange,
  emptyMessage = "No items available",
}: CardListProps) {
  const [internalSelection, setInternalSelection] = useState<string[]>(selectedItems)

  // Sync with external selectedItems prop
  useEffect(() => {
    setInternalSelection(selectedItems)
  }, [selectedItems])

  const handleItemSelect = (id: string, selected: boolean) => {
    const newSelection = selected
      ? [...internalSelection, id]
      : internalSelection.filter(itemId => itemId !== id)

    setInternalSelection(newSelection)
    onSelectionChange?.(newSelection)
  }

  const getGridClasses = () => {
    return 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={getGridClasses()}>
        {items.map((item) => (
          <CardItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            isSelected={internalSelection.includes(item.id)}
            onSelect={handleItemSelect}
          />
        ))}
      </div>
    </div>
  )
}
