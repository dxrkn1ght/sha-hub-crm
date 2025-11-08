"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CommandGroup, CommandItem } from "@/components/ui/command"

interface MultiSelectorContextValue {
  values: string[]
  onValuesChange: (values: string[]) => void
  inputValue: string
  setInputValue: (value: string) => void
  open: boolean
  setOpen: (value: boolean) => void
}

const MultiSelectorContext = React.createContext<MultiSelectorContextValue | undefined>(undefined)

const useMultiSelector = () => {
  const context = React.useContext(MultiSelectorContext)
  if (!context) {
    throw new Error("useMultiSelector must be used within MultiSelector")
  }
  return context
}

const MultiSelector = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    values: string[]
    onValuesChange: (value: string[]) => void
    loop?: boolean
  }
>(({ values = [], onValuesChange, loop = false, className, children, ...props }, ref) => {
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)

  return (
    <MultiSelectorContext.Provider
      value={{
        values,
        onValuesChange,
        inputValue,
        setInputValue,
        open,
        setOpen,
      }}
    >
      <CommandPrimitive
        ref={ref}
        className={cn("overflow-visible", className)}
        loop={loop}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !inputValue) {
            onValuesChange(values.slice(0, -1))
          }
          if (loop) {
            return
          }
          if (e.key === "Enter") {
            e.preventDefault()
          }
        }}
        {...props}
      >
        {children}
      </CommandPrimitive>
    </MultiSelectorContext.Provider>
  )
})

MultiSelector.displayName = "MultiSelector"

const MultiSelectorTrigger = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { values, onValuesChange } = useMultiSelector()

    const handleRemove = (value: string) => {
      onValuesChange(values.filter((v: string) => v !== value))
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className,
        )}
        {...props}
      >
        {values.map((value: string) => (
          <Badge key={value} className="flex items-center gap-1">
            {value}
            <button
              type="button"
              onClick={() => handleRemove(value)}
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    )
  },
)

MultiSelectorTrigger.displayName = "MultiSelectorTrigger"

const MultiSelectorInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const { setOpen } = useMultiSelector()

  return (
    <CommandPrimitive.Input
      ref={ref}
      className={cn("flex-1 bg-transparent p-0 outline-none placeholder:text-muted-foreground", className)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    />
  )
})

MultiSelectorInput.displayName = "MultiSelectorInput"

const MultiSelectorContent = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const { open } = useMultiSelector()

  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn(
        "z-50 mt-2 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        open ? "block" : "hidden",
        className,
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.List>
  )
})

MultiSelectorContent.displayName = "MultiSelectorContent"

const MultiSelectorList = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup>
>(({ className, children, ...props }, ref) => {
  const { values, onValuesChange } = useMultiSelector()

  return (
    <CommandGroup ref={ref} className={cn("p-1", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as {
            value?: string
            children?: React.ReactNode
          }
          return React.cloneElement(child, {
            onSelect: () => {
              if (childProps.value) {
                onValuesChange(
                  values.includes(childProps.value)
                    ? values.filter((v: string) => v !== childProps.value)
                    : [...values, childProps.value],
                )
              }
            },
            children: (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={childProps.value ? values.includes(childProps.value) : false}
                  readOnly
                />
                {childProps.children}
              </div>
            ),
          } as React.HTMLProps<HTMLDivElement>)
        }
        return child
      })}
    </CommandGroup>
  )
})

MultiSelectorList.displayName = "MultiSelectorList"

const MultiSelectorItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem>
>(({ className, ...props }, ref) => {
  return <CommandItem ref={ref} className={cn("cursor-pointer", className)} {...props} />
})

MultiSelectorItem.displayName = "MultiSelectorItem"

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
}
