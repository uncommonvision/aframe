import { CardItem } from '@/components/ui'
import type { KubeCluster } from '@/types/kube'
import { Server, Box, Package, Layers } from 'lucide-react'

interface KubeClusterItemProps {
  cluster: KubeCluster
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export default function KubeClusterItem({ 
  cluster, 
  isSelected = false, 
  onSelect 
}: KubeClusterItemProps) {
  const totalPods = cluster.nodes.flatMap(n => n.pods).length
  const totalNodes = cluster.nodes.length
  const totalNamespaces = cluster.namespaces.length
  const totalDeployments = cluster.namespaces.flatMap(ns => ns.deployments).length
  const healthyDeployments = cluster.namespaces
    .flatMap(ns => ns.deployments)
    .filter(d => d.replicas > 0)
    .length

  const title = (
    <div className="flex items-center gap-2">
      <span className="font-semibold">{cluster.name}</span>
    </div>
  )

  const description = (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Box className="h-4 w-4" />
        <span>Pods: <span className="font-medium text-foreground">{totalPods}</span></span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Server className="h-4 w-4" />
        <span>Nodes: <span className="font-medium text-foreground">{totalNodes}</span></span>
        <span className="mx-1">|</span>
        <Layers className="h-4 w-4" />
        <span>Namespaces: <span className="font-medium text-foreground">{totalNamespaces}</span></span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Package className="h-4 w-4" />
        <span>Deployments: <span className="font-medium text-foreground">{totalDeployments}</span></span>
        <span className={`ml-2 ${healthyDeployments === totalDeployments ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
          ({healthyDeployments} healthy)
        </span>
      </div>
    </div>
  )

  return (
    <CardItem
      id={cluster.id}
      title={title}
      description={description}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  )
}
