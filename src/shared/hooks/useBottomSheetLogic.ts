import { useRef } from 'react'
import { Animated, Dimensions } from 'react-native'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler'

type BottomSheetSize = 'small' | 'medium' | 'large' | 'full'

interface UseBottomSheetLogicProps {
  visible: boolean
  onClose: () => void
  size: BottomSheetSize
  enableGesture: boolean
}

const { height: screenHeight } = Dimensions.get('window')

export const useBottomSheetLogic = ({
  visible,
  onClose,
  size,
  enableGesture,
}: UseBottomSheetLogicProps) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const lastGestureY = useRef(0)

  const getSheetHeight = () => {
    const heights = {
      small: screenHeight * 0.3,
      medium: screenHeight * 0.5,
      large: screenHeight * 0.8,
      full: screenHeight * 0.95,
    }
    return heights[size]
  }

  const showBottomSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const hideBottomSheet = () => {
    const sheetHeight = getSheetHeight()

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const panGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: false,
      listener: (event: PanGestureHandlerGestureEvent) => {
        const { translationY } = event.nativeEvent
        lastGestureY.current = translationY
      },
    }
  )

  const panGestureStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (!enableGesture) return

    const { state, translationY, velocityY } = event.nativeEvent
    const sheetHeight = getSheetHeight()

    if (state === State.END) {
      const shouldClose = translationY > sheetHeight * 0.3 || velocityY > 1000

      if (shouldClose) {
        onClose()
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  return {
    translateY,
    backdropOpacity,
    panGestureEvent,
    panGestureStateChange,
    showBottomSheet,
    hideBottomSheet,
    getSheetHeight,
  }
}
