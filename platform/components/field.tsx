import * as React from 'react'
import { cn } from '../lib/cn'

/** What a control inside a Field needs to be tied to its label, hint and error. */
export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

export interface FieldProps {
  /** The control's id. The label, hint and error are tied to it. */
  id: string
  label: string
  /** Help shown under the control. */
  hint?: string
  /** What is wrong. Shown in words, announced when it appears, and marks the control invalid. */
  error?: string
  /** The control: an Input, or a function that receives the props to spread onto any control. */
  children: React.ReactNode | ((control: FieldControlProps) => React.ReactNode)
  className?: string
}

/** A label, a control, a hint and an error, tied together for assistive technology. */
export function Field({ id, label, hint, error, children, className }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const control: FieldControlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
  }

  return (
    <div className={cn('block', className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{typeof children === 'function' ? children(control) : children}</div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/** A text field: 8px corners, a 3:1 outline, the focus ring from base.css, and a red outline when invalid. */
export function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'block h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  )
}
