"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    onValueChange?: (value: string) => void
  }
>(({ className, onValueChange, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={className}
    onValueChange={onValueChange}
    {...props}
  />
))
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`
      inline-flex h-10 items-center justify-center rounded-md bg-gray-800/20 p-1 
      ${className}
    `}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={`
      inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm 
      font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none 
      disabled:opacity-50 data-[state=active]:bg-gray-800 data-[state=active]:text-white
      data-[state=active]:shadow-sm hover:bg-gray-800/50
      ${className}
    `}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={`
      mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-gray-500 focus-visible:ring-offset-2
      ${className}
    `}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
