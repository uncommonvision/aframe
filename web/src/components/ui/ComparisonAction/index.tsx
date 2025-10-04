interface ComparisonActionProps {
  onClick?: () => void
  disabled?: boolean
}

export default function ComparisonAction({ onClick, disabled = false }: ComparisonActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 cursor-pointer"
    >
      Compare
    </button>
  )
}
