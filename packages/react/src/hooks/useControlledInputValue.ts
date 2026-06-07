import { useState, useRef, useEffect, useLayoutEffect, type ChangeEventHandler, type ChangeEvent, type RefObject } from 'react'

type InputValue = string | number | null | undefined

/** Render any incoming value as the string the input element displays. */
const toDisplayString = (value: InputValue): string => (value == null ? '' : String(value))

/**
 * Parse the raw string typed into a numeric input into a real JSON number.
 * Works for every numeric form an `<input type="number">` can hold (integers,
 * decimals, negatives, exponential, leading `+`). Returns `null` for empty or
 * incomplete input so the store never holds `NaN`.
 */
const parseNumber = (raw: string): number | null => {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

/** Read selection bounds, tolerating input types that don't support it. */
const readSelection = (el: HTMLInputElement): { start: number; end: number } | null => {
  try {
    return { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 }
  } catch {
    return null
  }
}

/** Write selection bounds, tolerating input types that don't support it. */
const writeSelection = (el: HTMLInputElement, start: number, end: number): void => {
  try {
    el.selectionStart = start
    el.selectionEnd = end
  } catch {
    // Input types like 'number'/'email'/'date' throw on selection access.
  }
}

/**
 * Hook for controlled inputs that preserves cursor position when the value is
 * updated from outside (e.g. store sync, form reset) or transformed (e.g.
 * JSONata on get), so the cursor doesn't jump to the end while typing.
 *
 * The value is always handled as a **string** internally — this is what makes
 * mid-string editing work. When `type === 'number'`, the value emitted to
 * `onChange` (and therefore written to the store) is coerced to a JSON
 * `number` (or `null` when empty), while the displayed/local value stays the
 * raw string so partial input like `"1."` or `"42.50"` renders as typed.
 *
 * @param value - Current value from props/store (string or number)
 * @param onChange - Handler to call when the user types (e.g. writes to store)
 * @param inputType - The input's `type` attribute (e.g. 'text', 'number')
 * @returns { value, onChange, ref } — pass value and onChange to the input,
 *   and ref to the actual <input> DOM element so the hook can restore selection.
 */
export const useControlledInputValue = (
  value: InputValue,
  onChange?: ChangeEventHandler<HTMLInputElement>,
  inputType?: string
): {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  ref: RefObject<HTMLInputElement | null>
} => {
  const isNumber = inputType === 'number'
  // Keep the raw incoming value for change-detection, but display a string.
  const propValue = value
  const [localValue, setLocalValue] = useState<string>(toDisplayString(propValue))
  // The exact value we last emitted (a number for numeric inputs). Comparing
  // against the raw prop lets us detect store round-trips and skip needless
  // resyncs, which is what keeps "42.50" / "1." intact while typing.
  const lastValueWeSent = useRef<InputValue>(undefined)
  const lastPropValue = useRef<InputValue>(propValue)
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
          selectionToRestore.current = readSelection(inputRef.current)
        }
        setLocalValue(toDisplayString(propValue))
      }
    }
  }, [propValue])

  useLayoutEffect(() => {
    if (selectionToRestore.current && inputRef.current) {
      const { start, end } = selectionToRestore.current
      selectionToRestore.current = null
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const len = inputRef.current?.value?.length ?? 0
      writeSelection(inputRef.current, Math.min(start, len), Math.min(end, len))
    }
  })

  const wrappedOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const rawVal = e.target.value
    // Always keep the raw string locally so the cursor and partial numeric
    // input behave naturally.
    setLocalValue(rawVal)

    if (isNumber) {
      const numericVal = parseNumber(rawVal)
      lastValueWeSent.current = numericVal
      // The store binding only reads `e.target.value`, so a synthetic event
      // carrying the numeric value persists a real JSON number.
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: numericVal },
        currentTarget: e.currentTarget,
      } as unknown as ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
      return
    }

    lastValueWeSent.current = rawVal
    onChange?.(e)
  }

  return { value: localValue, onChange: wrappedOnChange, ref: inputRef }
}
