import { KubeClusterItem } from '@/components/ui'
import type { KubeCluster } from '@/types/kube'
import { useState, useEffect } from 'react'

interface KubeClusterListProps {
  clusters: KubeCluster[]
  selectedClusters?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  emptyMessage?: string
  gridCols?: {
    default: number
    sm?: number
    lg?: number
    xl?: number
  }
}

export default function KubeClusterList({
  clusters,
  selectedClusters = [],
  onSelectionChange,
  emptyMessage = "No clusters available",
}: KubeClusterListProps) {
  const [internalSelection, setInternalSelection] = useState<string[]>(selectedClusters)

  useEffect(() => {
    setInternalSelection(selectedClusters)
  }, [selectedClusters])

  const handleClusterSelect = (id: string, selected: boolean) => {
    const newSelection = selected
      ? [...internalSelection, id]
      : internalSelection.filter(clusterId => clusterId !== id)

    setInternalSelection(newSelection)
    onSelectionChange?.(newSelection)
  }

  if (clusters.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clusters.map((cluster) => (
          <KubeClusterItem
            key={cluster.id}
            cluster={cluster}
            isSelected={internalSelection.includes(cluster.id)}
            onSelect={handleClusterSelect}
          />
        ))}
      </div>
    </div>
  )
}
