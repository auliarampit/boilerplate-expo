import React, { createContext, useContext, useState, ReactNode } from 'react'
import BottomSheet from './BottomSheet'

type BottomSheetSize = 'small' | 'medium' | 'large' | 'full'

interface BottomSheetConfig {
  title?: string
  content: ReactNode
  size?: BottomSheetSize
  showHandle?: boolean
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  enableGesture?: boolean
  onClose?: () => void
}

interface BottomSheetContextType {
  showBottomSheet: (config: BottomSheetConfig) => void
  hideBottomSheet: () => void
  isVisible: boolean
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
)

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext)
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider')
  }
  return context
}

interface BottomSheetProviderProps {
  children: ReactNode
}

const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [config, setConfig] = useState<BottomSheetConfig | null>(null)

  const showBottomSheet = (bottomSheetConfig: BottomSheetConfig) => {
    setConfig(bottomSheetConfig)
    setIsVisible(true)
  }

  const hideBottomSheet = () => {
    setIsVisible(false)
    setTimeout(() => {
      setConfig(null)
    }, 300)
  }

  const handleClose = () => {
    if (config?.onClose) {
      config.onClose()
    }
    hideBottomSheet()
  }

  const contextValue: BottomSheetContextType = {
    showBottomSheet,
    hideBottomSheet,
    isVisible,
  }

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
      {config && (
        <BottomSheet
          visible={isVisible}
          onClose={handleClose}
          title={config.title}
          size={config.size}
          showHandle={config.showHandle}
          showCloseButton={config.showCloseButton}
          closeOnBackdrop={config.closeOnBackdrop}
          enableGesture={config.enableGesture}>
          {config.content}
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  )
}

export default BottomSheetProvider
