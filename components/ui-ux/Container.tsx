import { cn } from "@/components/ui/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const containerVariants = cva("flex", {
    variants: {
        variant: {
            default:
                "w-full h-full flex justify-center items-center border border-gray-700",
            secondary: "border border-gray-200",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof containerVariants> {}

const Container: React.FC<ContainerProps> = ({
    className,
    variant = "default",
    ...props
}) => {
    return (
        <div
            className={cn(containerVariants({ variant, className }))}
            {...props}
        />
    );
};
Container.displayName = "Container";

export { Container, containerVariants };
