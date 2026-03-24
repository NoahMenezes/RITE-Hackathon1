"use client"

import React, {
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"

export const AnimatedList = React.memo(({ children, className, delay = 1000 }: { children: ReactNode; className?: string; delay?: number }) => {
    const [index, setIndex] = useState(0)
    const childrenArray = React.Children.toArray(children)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % (childrenArray.length + 1))
        }, delay)

        return () => clearInterval(interval)
    }, [childrenArray.length, delay])

    const itemsToShow = useMemo(
        () => childrenArray.slice(0, index + 1).reverse(),
        [index, childrenArray],
    )

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <AnimatePresence>
                {itemsToShow.map((item) => (
                    <motion.div
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, originY: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 40 }}
                        key={(item as ReactElement).key}
                    >
                        {item}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
})

AnimatedList.displayName = "AnimatedList"
