export interface KubeContainer {
  name: string
  image: string
}

export interface KubeVolume {
  name: string
  type: string
}

export interface KubePod {
  containers: KubeContainer[]
  volumes: KubeVolume[]
  role: string
  ip: string
  labels: Record<string, string>
}

export interface KubeNode {
  kubelet: string
  runtime: string
  role: string
  pods: KubePod[]
}

export interface KubeDeployment {
  replicas: number
  selector: string
  template: string
  strategy: string
  role: string
}

export interface KubeService {
  pods: KubePod[]
  clusterIP: string
  nodePort: number
  selector: string
  ports: Record<number, KubePod>
  role: string
}

export interface KubeControlPlane {
  nodes: KubeNode[]
}

export interface KubeNamespace {
  deployments: KubeDeployment[]
  services: KubeService[]
}

export interface KubeCluster {
  id: string
  name: string
  controlPlane: KubeControlPlane
  nodes: KubeNode[]
  namespaces: KubeNamespace[]
}
