import { useState, useCallback } from 'react'

/**
 * Hook untuk mengelola boolean state dengan toggle functionality
 */
export const useBooleanState = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return {
    value,
    setValue,
    toggle,
    setTrue,
    setFalse,
  }
}

/**
 * Hook untuk mengelola modal visibility state
 */
export const useModalState = (initialVisible: boolean = false) => {
  const { value: isVisible, setTrue: show, setFalse: hide, toggle } = useBooleanState(initialVisible)

  return {
    isVisible,
    show,
    hide,
    toggle,
  }
}

/**
 * Hook untuk mengelola password visibility state
 */
export const usePasswordVisibility = (initialVisible: boolean = false) => {
  const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useBooleanState(initialVisible)

  return {
    isPasswordVisible,
    togglePasswordVisibility,
  }
}

/**
 * Hook untuk mengelola focus state
 */
export const useFocusState = (initialFocused: boolean = false) => {
  const { value: isFocused, setTrue: onFocus, setFalse: onBlur } = useBooleanState(initialFocused)

  return {
    isFocused,
    onFocus,
    onBlur,
  }
}

/**
 * Hook untuk mengelola form field state
 */
export const useFieldState = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue)
  const [isDirty, setIsDirty] = useState(false)

  const onChange = useCallback((newValue: T) => {
    setValue(newValue)
    if (!isDirty) {
      setIsDirty(true)
    }
  }, [isDirty])

  const reset = useCallback(() => {
    setValue(initialValue)
    setIsDirty(false)
  }, [initialValue])

  return {
    value,
    setValue,
    onChange,
    isDirty,
    reset,
  }
}

/**
 * Hook untuk mengelola multiple boolean states
 */
export const useMultipleBooleanStates = <T extends Record<string, boolean>>(initialStates: T) => {
  const [states, setStates] = useState<T>(initialStates)

  const toggle = useCallback((key: keyof T) => {
    setStates(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

  const setTrue = useCallback((key: keyof T) => {
    setStates(prev => ({
      ...prev,
      [key]: true,
    }))
  }, [])

  const setFalse = useCallback((key: keyof T) => {
    setStates(prev => ({
      ...prev,
      [key]: false,
    }))
  }, [])

  const reset = useCallback(() => {
    setStates(initialStates)
  }, [initialStates])

  return {
    states,
    toggle,
    setTrue,
    setFalse,
    reset,
  }
}

/**
 * Hook untuk mengelola counter state
 */
export const useCounter = (initialValue: number = 0, step: number = 1) => {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount(prev => prev + step)
  }, [step])

  const decrement = useCallback(() => {
    setCount(prev => prev - step)
  }, [step])

  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  const set = useCallback((value: number) => {
    setCount(value)
  }, [])

  return {
    count,
    increment,
    decrement,
    reset,
    set,
  }
}

/**
 * Hook untuk mengelola array state
 */
export const useArrayState = <T>(initialArray: T[] = []) => {
  const [array, setArray] = useState<T[]>(initialArray)

  const push = useCallback((item: T) => {
    setArray(prev => [...prev, item])
  }, [])

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index))
  }, [])

  const removeByValue = useCallback((value: T) => {
    setArray(prev => prev.filter(item => item !== value))
  }, [])

  const update = useCallback((index: number, newValue: T) => {
    setArray(prev => prev.map((item, i) => i === index ? newValue : item))
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  const reset = useCallback(() => {
    setArray(initialArray)
  }, [initialArray])

  return {
    array,
    setArray,
    push,
    remove,
    removeByValue,
    update,
    clear,
    reset,
    length: array.length,
    isEmpty: array.length === 0,
  }
}