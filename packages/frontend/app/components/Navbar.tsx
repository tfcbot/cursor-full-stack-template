'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-bg-secondary border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold text-fg-primary">
            Content Generator
          </Link>
        </div>
        
        <div className="flex space-x-6">
          <NavLink href="/" active={pathname === '/'}>
            Generate
          </NavLink>
          <NavLink href="/content" active={pathname === '/content'}>
            View Content
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium ${
        active 
          ? 'text-accent-tertiary border-b-2 border-accent-tertiary pb-1' 
          : 'text-fg-secondary hover:text-fg-primary'
      }`}
    >
      {children}
    </Link>
  );
} 