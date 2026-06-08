import type { ChangeEvent, ChangeEventHandler } from 'react'

export type InputValue = string | number | null | undefined

/** Render any incoming value as the string the input element displays. */
export const toDisplayString = (value: InputValue): string => (value == null ? '' : String(value))

/**
 * Parse the raw string typed into a numeric input into a real JSON number.
 * Returns `null` for empty/incomplete input so the store never holds `NaN`.
 */
export const parseNumber = (raw: string): number | null => {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

/**
 * Hookless helper for store-bound text/number inputs. Returns props for an
 * uncontrolled input so the DOM owns the text (caret stays put, slow stores
 * can't clobber keystrokes); the store value is pushed back into the field only
 * while it is not focused. Numeric inputs emit a JSON number (or null when empty).
 *
 * Attach `ref` to the real `<input>` element — for MUI's TextField pass it as `inputRef`.
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
    if (typeof document !== 'undefined' && document.activeElement === el) return
    if (el.value !== display) el.value = display
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (type === 'number') {
      const numeric = parseNumber(e.target.value)
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
