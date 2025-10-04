import { ComparisonAction } from '@/components/ui'

interface ComparisonBannerProps {
  selectedItems: string[]
}

export default function ComparisonBanner({ selectedItems }: ComparisonBannerProps) {
  if (selectedItems.length <= 1) {
    return null
  }

  return (
    <div className="rounded-lg border bg-muted/50 p-4 flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-foreground mb-2">
          Ready to Compare
        </h3>
        <p className="text-sm text-muted-foreground">
          You have selected {selectedItems.length} items. Comparison functionality will be added in future updates.
        </p>
      </div>
      <ComparisonAction />
    </div>
  )
}
