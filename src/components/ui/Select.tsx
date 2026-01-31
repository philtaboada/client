import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Select component for dropdown inputs
 */

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, id, options, ...props }, ref) => {
        const selectId = id || `select-${React.useId()}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block mb-2 text-sm font-semibold text-gray-700"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        'w-full px-4 py-3 border-2 rounded-md text-base transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        'bg-white cursor-pointer',
                        error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };
