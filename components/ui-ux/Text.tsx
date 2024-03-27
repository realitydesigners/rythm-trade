import { cn } from "@/components/ui/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const textVariants = cva("inline-block", {
    variants: {
        variant: {
            default: "text-gray-200 font-medium",
            p: "text-gray-400 font-medium",
            secondary: "text-sm font-bold text-gray-900",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface TextProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof textVariants> {}

const Text: React.FC<TextProps> = ({
    className,
    variant = "default",
    children,
    ...props
}) => {
    return (
        <div className={cn(textVariants({ variant, className }))} {...props}>
            {children}
        </div>
    );
};
Text.displayName = "Text";

export { Text, textVariants };
