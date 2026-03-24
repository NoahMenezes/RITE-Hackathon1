"use client";

import { cn } from "@/lib/utils";

interface ShineBorderProps {
    borderRadius?: number;
    borderWidth?: number;
    duration?: number;
    color?: string | string[];
    className?: string;
    children?: React.ReactNode;
}

/**
 * @name Shine Border
 * @description Shine Border is an animated background border effect.
 * @version 0.0.1
 */
export default function ShineBorder({
    borderRadius = 0,
    borderWidth = 1,
    duration = 14,
    color = "#fff",
    className,
    children,
}: ShineBorderProps) {
    return (
        <div
            style={
                {
                    "--border-radius": `${borderRadius}px`,
                    "--border-width": `${borderWidth}px`,
                    "--duration": `${duration}s`,
                    "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color
                        },transparent,transparent)`,
                } as React.CSSProperties
            }
            className={cn(
                "relative min-h-[60px] w-fit min-w-[300px] border border-transparent bg-clip-border text-white",
                className,
            )}
        >
            <div
                className={cn(
                    "pointer-events-none before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine",
                )}
            ></div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
