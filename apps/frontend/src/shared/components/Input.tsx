import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Label } from '@radix-ui/react-label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <Label
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error ? 'text-destructive' : '',
            )}
          >
            {label}
          </Label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error ? 'border-destructive focus-visible:ring-destructive' : '',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-[0.8rem] font-medium text-destructive">{error}</span>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
