'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

export const FadeInOnScroll = ({
  children,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const directionClasses = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
  }

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-opacity duration-1000 ease-out transform',
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  )
}
