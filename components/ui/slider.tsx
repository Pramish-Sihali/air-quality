"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-accent relative h-1.5 w-full grow overflow-hidden rounded-full"
      >
        <SliderPrimitive.Range data-slot="slider-range" className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      {props.defaultValue?.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="border-primary dark:bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring block size-4 rounded-full border bg-background shadow transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
      {props.value?.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="border-primary dark:bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring block size-4 rounded-full border bg-background shadow transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }