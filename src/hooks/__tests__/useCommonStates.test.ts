import { renderHook, act } from '@testing-library/react-native'
import {
  useBooleanState,
  useModalState,
  usePasswordVisibility,
  useFocusState,
  useFieldState,
  useMultipleBooleanStates,
  useCounter,
  useArrayState,
} from '../useCommonStates'

describe('useCommonStates', () => {
  describe('useBooleanState', () => {
    it('should initialize with default value false', () => {
      const { result } = renderHook(() => useBooleanState())

      expect(result.current.value).toBe(false)
    })

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => useBooleanState(true))

      expect(result.current.value).toBe(true)
    })

    it('should toggle value', () => {
      const { result } = renderHook(() => useBooleanState(false))

      act(() => {
        result.current.toggle()
      })

      expect(result.current.value).toBe(true)

      act(() => {
        result.current.toggle()
      })

      expect(result.current.value).toBe(false)
    })

    it('should set value to true', () => {
      const { result } = renderHook(() => useBooleanState(false))

      act(() => {
        result.current.setTrue()
      })

      expect(result.current.value).toBe(true)
    })

    it('should set value to false', () => {
      const { result } = renderHook(() => useBooleanState(true))

      act(() => {
        result.current.setFalse()
      })

      expect(result.current.value).toBe(false)
    })

    it('should set custom value', () => {
      const { result } = renderHook(() => useBooleanState(false))

      act(() => {
        result.current.setValue(true)
      })

      expect(result.current.value).toBe(true)

      act(() => {
        result.current.setValue(false)
      })

      expect(result.current.value).toBe(false)
    })
  })

  describe('useModalState', () => {
    it('should initialize with default value false', () => {
      const { result } = renderHook(() => useModalState())

      expect(result.current.isVisible).toBe(false)
    })

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => useModalState(true))

      expect(result.current.isVisible).toBe(true)
    })

    it('should show modal', () => {
      const { result } = renderHook(() => useModalState(false))

      act(() => {
        result.current.show()
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should hide modal', () => {
      const { result } = renderHook(() => useModalState(true))

      act(() => {
        result.current.hide()
      })

      expect(result.current.isVisible).toBe(false)
    })

    it('should toggle modal visibility', () => {
      const { result } = renderHook(() => useModalState(false))

      act(() => {
        result.current.toggle()
      })

      expect(result.current.isVisible).toBe(true)

      act(() => {
        result.current.toggle()
      })

      expect(result.current.isVisible).toBe(false)
    })
  })

  describe('usePasswordVisibility', () => {
    it('should initialize with default value false', () => {
      const { result } = renderHook(() => usePasswordVisibility())

      expect(result.current.isPasswordVisible).toBe(false)
    })

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => usePasswordVisibility(true))

      expect(result.current.isPasswordVisible).toBe(true)
    })

    it('should toggle password visibility', () => {
      const { result } = renderHook(() => usePasswordVisibility(false))

      act(() => {
        result.current.togglePasswordVisibility()
      })

      expect(result.current.isPasswordVisible).toBe(true)

      act(() => {
        result.current.togglePasswordVisibility()
      })

      expect(result.current.isPasswordVisible).toBe(false)
    })
  })

  describe('useFocusState', () => {
    it('should initialize with default value false', () => {
      const { result } = renderHook(() => useFocusState())

      expect(result.current.isFocused).toBe(false)
    })

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => useFocusState(true))

      expect(result.current.isFocused).toBe(true)
    })

    it('should handle focus event', () => {
      const { result } = renderHook(() => useFocusState(false))

      act(() => {
        result.current.onFocus()
      })

      expect(result.current.isFocused).toBe(true)
    })

    it('should handle blur event', () => {
      const { result } = renderHook(() => useFocusState(true))

      act(() => {
        result.current.onBlur()
      })

      expect(result.current.isFocused).toBe(false)
    })
  })

  describe('useFieldState', () => {
    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => useFieldState('initial'))

      expect(result.current.value).toBe('initial')
      expect(result.current.isDirty).toBe(false)
    })

    it('should update value and mark as dirty', () => {
      const { result } = renderHook(() => useFieldState('initial'))

      act(() => {
        result.current.onChange('updated')
      })

      expect(result.current.value).toBe('updated')
      expect(result.current.isDirty).toBe(true)
    })

    it('should not mark as dirty again if already dirty', () => {
      const { result } = renderHook(() => useFieldState('initial'))

      act(() => {
        result.current.onChange('updated1')
      })

      expect(result.current.isDirty).toBe(true)

      act(() => {
        result.current.onChange('updated2')
      })

      expect(result.current.value).toBe('updated2')
      expect(result.current.isDirty).toBe(true)
    })

    it('should set value directly', () => {
      const { result } = renderHook(() => useFieldState('initial'))

      act(() => {
        result.current.setValue('direct')
      })

      expect(result.current.value).toBe('direct')
      expect(result.current.isDirty).toBe(false) // setValue doesn't mark as dirty
    })

    it('should reset to initial value and clear dirty flag', () => {
      const { result } = renderHook(() => useFieldState('initial'))

      act(() => {
        result.current.onChange('updated')
      })

      expect(result.current.value).toBe('updated')
      expect(result.current.isDirty).toBe(true)

      act(() => {
        result.current.reset()
      })

      expect(result.current.value).toBe('initial')
      expect(result.current.isDirty).toBe(false)
    })
  })

  describe('useMultipleBooleanStates', () => {
    const initialStates = {
      modal1: false,
      modal2: true,
      loading: false,
    }

    it('should initialize with provided initial states', () => {
      const { result } = renderHook(() => useMultipleBooleanStates(initialStates))

      expect(result.current.states).toEqual(initialStates)
    })

    it('should toggle specific state', () => {
      const { result } = renderHook(() => useMultipleBooleanStates(initialStates))

      act(() => {
        result.current.toggle('modal1')
      })

      expect(result.current.states.modal1).toBe(true)
      expect(result.current.states.modal2).toBe(true) // unchanged
      expect(result.current.states.loading).toBe(false) // unchanged
    })

    it('should set specific state to true', () => {
      const { result } = renderHook(() => useMultipleBooleanStates(initialStates))

      act(() => {
        result.current.setTrue('loading')
      })

      expect(result.current.states.loading).toBe(true)
      expect(result.current.states.modal1).toBe(false) // unchanged
      expect(result.current.states.modal2).toBe(true) // unchanged
    })

    it('should set specific state to false', () => {
      const { result } = renderHook(() => useMultipleBooleanStates(initialStates))

      act(() => {
        result.current.setFalse('modal2')
      })

      expect(result.current.states.modal2).toBe(false)
      expect(result.current.states.modal1).toBe(false) // unchanged
      expect(result.current.states.loading).toBe(false) // unchanged
    })

    it('should reset all states to initial values', () => {
      const { result } = renderHook(() => useMultipleBooleanStates(initialStates))

      act(() => {
        result.current.toggle('modal1')
        result.current.setTrue('loading')
        result.current.setFalse('modal2')
      })

      // Verify states changed
      expect(result.current.states).toEqual({
        modal1: true,
        modal2: false,
        loading: true,
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.states).toEqual(initialStates)
    })
  })

  describe('useCounter', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCounter())

      expect(result.current.count).toBe(0)
    })

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => useCounter(10))

      expect(result.current.count).toBe(10)
    })

    it('should increment by default step', () => {
      const { result } = renderHook(() => useCounter(5))

      act(() => {
        result.current.increment()
      })

      expect(result.current.count).toBe(6)
    })

    it('should increment by custom step', () => {
      const { result } = renderHook(() => useCounter(5, 3))

      act(() => {
        result.current.increment()
      })

      expect(result.current.count).toBe(8)
    })

    it('should decrement by default step', () => {
      const { result } = renderHook(() => useCounter(5))

      act(() => {
        result.current.decrement()
      })

      expect(result.current.count).toBe(4)
    })

    it('should decrement by custom step', () => {
      const { result } = renderHook(() => useCounter(10, 3))

      act(() => {
        result.current.decrement()
      })

      expect(result.current.count).toBe(7)
    })

    it('should set specific value', () => {
      const { result } = renderHook(() => useCounter(5))

      act(() => {
        result.current.set(20)
      })

      expect(result.current.count).toBe(20)
    })

    it('should reset to initial value', () => {
      const { result } = renderHook(() => useCounter(5))

      act(() => {
        result.current.increment()
        result.current.increment()
      })

      expect(result.current.count).toBe(7)

      act(() => {
        result.current.reset()
      })

      expect(result.current.count).toBe(5)
    })
  })

  describe('useArrayState', () => {
    const initialArray = ['item1', 'item2', 'item3']

    it('should initialize with empty array by default', () => {
      const { result } = renderHook(() => useArrayState())

      expect(result.current.array).toEqual([])
      expect(result.current.length).toBe(0)
      expect(result.current.isEmpty).toBe(true)
    })

    it('should initialize with provided initial array', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      expect(result.current.array).toEqual(initialArray)
      expect(result.current.length).toBe(3)
      expect(result.current.isEmpty).toBe(false)
    })

    it('should push new item', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      act(() => {
        result.current.push('item4')
      })

      expect(result.current.array).toEqual(['item1', 'item2', 'item3', 'item4'])
      expect(result.current.length).toBe(4)
    })

    it('should remove item by index', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      act(() => {
        result.current.remove(1) // Remove 'item2'
      })

      expect(result.current.array).toEqual(['item1', 'item3'])
      expect(result.current.length).toBe(2)
    })

    it('should remove item by value', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      act(() => {
        result.current.removeByValue('item2')
      })

      expect(result.current.array).toEqual(['item1', 'item3'])
      expect(result.current.length).toBe(2)
    })

    it('should update item at specific index', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      act(() => {
        result.current.update(1, 'updated-item2')
      })

      expect(result.current.array).toEqual(['item1', 'updated-item2', 'item3'])
      expect(result.current.length).toBe(3)
    })

    it('should clear all items', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      act(() => {
        result.current.clear()
      })

      expect(result.current.array).toEqual([])
      expect(result.current.length).toBe(0)
      expect(result.current.isEmpty).toBe(true)
    })

    it('should reset to initial array', () => {
      const { result } = renderHook(() => useArrayState(initialArray))

      act(() => {
        result.current.push('item4')
        result.current.remove(0)
      })

      expect(result.current.array).toEqual(['item2', 'item3', 'item4'])

      act(() => {
        result.current.reset()
      })

      expect(result.current.array).toEqual(initialArray)
      expect(result.current.length).toBe(3)
    })

    it('should set array directly', () => {
      const { result } = renderHook(() => useArrayState(initialArray))
      const newArray = ['new1', 'new2']

      act(() => {
        result.current.setArray(newArray)
      })

      expect(result.current.array).toEqual(newArray)
      expect(result.current.length).toBe(2)
    })
  })
})