import { Check } from 'lucide-react'
import { useState } from 'react'

interface CardItemProps {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  imageUrl?: string
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export default function CardItem({ 
  id, 
  title, 
  description, 
  imageUrl, 
  isSelected = false, 
  onSelect 
}: CardItemProps) {
  const [selected, setSelected] = useState(isSelected)

  const handleClick = () => {
    const newSelected = !selected
    setSelected(newSelected)
    onSelect?.(id, newSelected)
  }

  return (
    <div
      onClick={handleClick}
      className={`relative group cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Selection indicator */}
      <div className={`absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
      }`}>
        {selected && <Check className="h-3 w-3" />}
      </div>

      {/* Image placeholder */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={typeof title === 'string' ? title : 'Card image'}
          className="mb-3 h-32 w-full rounded-md object-cover"
        />
      ) : (
        <div className="mb-3 h-32 w-full rounded-md bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground leading-tight">
          {title}
        </h3>
         {description && (
           <div className="text-sm text-muted-foreground">
             {description}
           </div>
         )}
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 rounded-lg ring-2 ring-primary transition-opacity ${
        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
      }`} />
    </div>
  )
}