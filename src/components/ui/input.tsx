// src/components/ui/input.tsx
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Custom props can be added here
  variant?: "default" | "outline" | "filled";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm 
          placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 
          focus:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
