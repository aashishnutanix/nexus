'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

//
interface TabProps {
  title: string;
  value: string; // Used to control which tab is active
}

const Tab: React.FC<
  React.ComponentPropsWithoutRef<'button'> & TabProps
> = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'> & TabProps>(({ title, className, value, ...props }, ref) => (
  <button
    ref={ref}
    data-value={value}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  >
    {title}
  </button>
));
Tab.displayName = 'Tab';

interface TabListProps {
  children: React.ReactNode;
}

const TabList: React.FC<
  React.ComponentPropsWithoutRef<'div'> & TabListProps
> = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'> & TabListProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
TabList.displayName = 'TabList';

interface TabPanelProps {
  children: React.ReactNode;
  value: string; // Corresponds to the tab value
  isActive: boolean; // Used to display the active tab content
}

const TabPanel: React.FC<
  React.ComponentPropsWithoutRef<'div'> & TabPanelProps
> = ({ children, value, isActive, className, ...props }) => (
  <div
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
      { hidden: !isActive }
    )}
    data-value={value}
    {...props}
  >
    {isActive && children}
  </div>
);
TabPanel.displayName = 'TabPanel';

export { Tabs, TabsList, TabsTrigger, TabsContent, Tab, TabList, TabPanel };
