import { useState, useEffect } from 'react'
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'

export interface NetworkState {
  isConnected: boolean | null
  isInternetReachable: boolean | null
  type: string | null
  isWifiEnabled?: boolean
}

export const useNetworkState = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
    isWifiEnabled: undefined,
  })

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isWifiEnabled: state.isWifiEnabled,
      })
    })

    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isWifiEnabled: state.isWifiEnabled,
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    ...networkState,
    isOnline: networkState.isConnected && networkState.isInternetReachable,
    isOffline: !networkState.isConnected || !networkState.isInternetReachable,
  }
}
