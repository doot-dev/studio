import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border/40">
        © {new Date().getFullYear()} DootRec. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
