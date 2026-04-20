import { useState, useRef, useEffect, useLayoutEffect, type ChangeEventHandler, type RefObject } from 'react'

/**
 * Hook for controlled text inputs that preserves cursor position when the
 * value is updated from outside (e.g. store sync, form reset) or when the
 * value is transformed (e.g. JSONata on get). Use this so the cursor doesn't
 * jump to the end on every keystroke or when the displayed value is modified
 * by a modifier.
 *
 * @param value - Current value from props/store
 * @param onChange - Handler to call when the user types (e.g. writes to store)
 * @returns { value, onChange, ref } — pass value and onChange to the input,
 *   and ref to the actual <input> DOM element so the hook can restore selection.
 */
export function useControlledInputValue(
  value: string,
  onChange?: ChangeEventHandler<HTMLInputElement>
): {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  ref: RefObject<HTMLInputElement | null>
} {
  const propValue = value ?? ''
  const [localValue, setLocalValue] = useState(propValue)
  const lastValueWeSent = useRef<string | null>(null)
  const lastPropValue = useRef<string>(propValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectionToRestore = useRef<{ start: number; end: number } | null>(null)

  useEffect(() => {
    // If the external value changed for a different reason than the last
    // keystroke we emitted (e.g. validation, defaultValues, modifiers),
    // sync local state to it while preserving cursor where possible.
    if (propValue !== lastPropValue.current) {
      lastPropValue.current = propValue
      if (propValue !== lastValueWeSent.current) {
        if (inputRef.current) {
          selectionToRestore.current = {
            start: inputRef.current.selectionStart ?? 0,
            end: inputRef.current.selectionEnd ?? 0,
          }
        }
        setLocalValue(propValue)
      }
    }
  }, [propValue])

  useLayoutEffect(() => {
    if (selectionToRestore.current && inputRef.current) {
      const { start, end } = selectionToRestore.current
      selectionToRestore.current = null
      const len = (inputRef.current.value ?? '').length
      inputRef.current.selectionStart = Math.min(start, len)
      inputRef.current.selectionEnd = Math.min(end, len)
    }
  })

  const wrappedOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newVal = e.target.value
    lastValueWeSent.current = newVal
    setLocalValue(newVal)
    onChange?.(e)
  }

  return { value: localValue, onChange: wrappedOnChange, ref: inputRef }
}
