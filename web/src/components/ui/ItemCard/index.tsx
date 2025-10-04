import { Check } from 'lucide-react'
import { useState } from 'react'

interface ItemCardProps {
  id: string
  title: string
  description?: string
  imageUrl?: string
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export default function ItemCard({ 
  id, 
  title, 
  description, 
  imageUrl, 
  isSelected = false, 
  onSelect 
}: ItemCardProps) {
  const [selected, setSelected] = useState(isSelected)

  const handleClick = () => {
    const newSelected = !selected
    setSelected(newSelected)
    onSelect?.(id, newSelected)
  }

  return (
    <div
      onClick={handleClick}
      className={`tw-relative tw-group tw-cursor-pointer tw-rounded-lg tw-border tw-p-4 tw-transition-all tw-duration-200 hover:tw-shadow-md ${
        selected
          ? 'tw-border-primary tw-bg-primary/5 tw-shadow-sm'
          : 'tw-border-border hover:tw-border-primary/50'
      }`}
    >
      {/* Selection indicator */}
      <div className={`tw-absolute tw-top-3 tw-right-3 tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-transition-all ${
        selected
          ? 'tw-border-primary tw-bg-primary tw-text-primary-foreground'
          : 'tw-border-muted-foreground/30 tw-bg-background group-hover:tw-border-primary/50'
      }`}>
        {selected && <Check className="tw-h-3 tw-w-3" />}
      </div>

      {/* Image placeholder */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="tw-mb-3 tw-h-32 tw-w-full tw-rounded-md tw-object-cover"
        />
      ) : (
        <div className="tw-mb-3 tw-h-32 tw-w-full tw-rounded-md tw-bg-muted tw-flex tw-items-center tw-justify-center">
          <span className="tw-text-muted-foreground tw-text-sm">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="tw-space-y-2">
        <h3 className="tw-font-semibold tw-text-foreground tw-leading-tight">
          {title}
        </h3>
        {description && (
          <p className="tw-text-sm tw-text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Hover overlay */}
      <div className={`tw-absolute tw-inset-0 tw-rounded-lg tw-ring-2 tw-ring-primary tw-transition-opacity ${
        selected ? 'tw-opacity-100' : 'tw-opacity-0 group-hover:tw-opacity-50'
      }`} />
    </div>
  )
}