import React, { createContext, useContext, ReactNode } from 'react'
import { useNetworkState, NetworkState } from '../hooks/useNetworkState'

interface NetworkContextType extends NetworkState {
  isOnline: boolean | null
  isOffline: boolean
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

interface NetworkProviderProps {
  children: ReactNode
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const networkState = useNetworkState()

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}

export default NetworkProvider
