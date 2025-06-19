import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "group relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* Track: stays white (or your current bg) always */}
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/30">
      {/* Range: white normally, green on hover of whole slider */}
      <SliderPrimitive.Range className="absolute h-full bg-white group-hover:bg-green-500 transition-colors" />
    </SliderPrimitive.Track>

    {/* Thumb: hidden normally, green & visible on hover */}
    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
