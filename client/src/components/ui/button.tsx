import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, forwardRef, type JSX } from 'react'

import { cn } from '@/lib/utils'

import { type ButtonVariants,buttonVariants } from './button-variants'

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref): JSX.Element => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button }
