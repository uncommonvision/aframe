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
  showSelectionCount = false,
  emptyMessage = "No items available",
  gridCols = {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 4
  }
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
    const baseClasses = "grid gap-6"
    const colClasses = [
      `grid-cols-${gridCols.default}`,
      gridCols.sm && `sm:grid-cols-${gridCols.sm}`,
      gridCols.lg && `lg:grid-cols-${gridCols.lg}`,
      gridCols.xl && `xl:grid-cols-${gridCols.xl}`
    ].filter(Boolean).join(' ')
    
    return `${baseClasses} ${colClasses}`
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
      {showSelectionCount && internalSelection.length > 0 && (
        <p className="text-sm text-primary">
          {internalSelection.length} item{internalSelection.length !== 1 ? 's' : ''} selected
        </p>
      )}
      
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