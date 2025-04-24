// /src/components/ui/tabs.jsx
import React from 'react';

export function Tabs({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function TabsList({ children, className, ...props }) {
  return (
    <div className={`flex space-x-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}


