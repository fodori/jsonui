import type { ChangeEvent, ChangeEventHandler } from 'react'

export type InputValue = string | number | null | undefined

/** Render any incoming value as the string the input element displays. */
export const toDisplayString = (value: InputValue): string => (value == null ? '' : String(value))

/**
 * Parse the raw string typed into a numeric input into a real JSON number.
 * Works for every numeric form an `<input type="number">` can hold (integers,
 * decimals, negatives, exponential, leading `+`). Returns `null` for empty or
 * incomplete input so the store never holds `NaN`.
 */
export const parseNumber = (raw: string): number | null => {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

/**
 * Hookless helper for store-bound text/number inputs.
 *
 * Instead of a controlled `value` (which jumps the caret and gets clobbered by
 * slow/async stores), it returns props for an **uncontrolled** input:
 *
 * - `defaultValue` seeds the initial text; afterwards the DOM owns it, so the
 *   browser keeps the caret exactly where the user put it and a slow store can
 *   never overwrite in-flight keystrokes.
 * - `ref` is a fresh callback every render, so React re-invokes it on each
 *   commit; it pushes the latest store value into the field **only while the
 *   field is not focused** (external resets, transform-on-get, other-field
 *   updates, and normalisation like `"42.50"` → `42.5` after editing ends).
 * - `onChange` coerces numeric inputs to a JSON `number` (or `null` when empty)
 *   before calling the supplied handler.
 *
 * Spread `defaultValue` + `onChange` onto the input and attach `ref` to the
 * real `<input>` element. For MUI's `TextField`, pass `ref` as `inputRef`.
 *
 * Note: no `useState`/`useEffect`/`useRef` — works in any component, hook-free.
 */
export const uncontrolledInputProps = (
  value: InputValue,
  onChange?: ChangeEventHandler<HTMLInputElement>,
  type?: string
): {
  defaultValue: string
  onChange: ChangeEventHandler<HTMLInputElement>
  ref: (el: HTMLInputElement | null) => void
} => {
  const display = toDisplayString(value)

  const ref = (el: HTMLInputElement | null): void => {
    if (el == null) return
    // Don't disturb the user while they're editing — this is what keeps the
    // caret stable and prevents a slow store from clobbering keystrokes.
    if (typeof document !== 'undefined' && document.activeElement === el) return
    if (el.value !== display) el.value = display
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (type === 'number') {
      const numeric = parseNumber(e.target.value)
      // The store binding only reads `e.target.value`, so a synthetic event
      // carrying the numeric value persists a real JSON number.
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: numeric },
        currentTarget: e.currentTarget,
      } as unknown as ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
      return
    }
    onChange?.(e)
  }

  return { defaultValue: display, onChange: handleChange, ref }
}
