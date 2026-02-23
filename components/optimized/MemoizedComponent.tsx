import React, { memo, ReactNode } from 'react'

interface MemoizedComponentProps {
  children: ReactNode
  className?: string
}

// Higher-order component for memoization
export const MemoizedComponent = memo<MemoizedComponentProps>(
  ({ children, className }) => {
    return <div className={className}>{children}</div>
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return prevProps.className === nextProps.className
  }
)

MemoizedComponent.displayName = 'MemoizedComponent'

// Hook for expensive calculations
export function useMemoizedValue<T>(factory: () => T, deps: React.DependencyList): T {
  return React.useMemo(factory, deps)
}

// Hook for expensive callbacks
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return React.useCallback(callback, deps)
}


