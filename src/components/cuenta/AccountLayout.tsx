// src/components/cuenta/AccountLayout.tsx
// Sidebar + shell compartido para /cuenta/* y /admin/* (con prop variant).
// HU-3, HU-8, HU-10 (cuenta); HU-5, HU-6, HU-17 (admin).

import type { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

interface Props {
  variant: 'cuenta' | 'admin';
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  children: ReactNode;
}

export default function AccountLayout({ variant, title, subtitle, navItems, children }: Props) {
  return (
    <div class="min-h-screen pt-20 pb-16">
      <div class="max-w-6xl mx-auto px-6 md:px-12">
        <div class="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          <aside class="lg:sticky lg:top-24 self-start">
            <div class="mb-6">
              <h1 class="font-serif text-3xl font-bold text-charcoal tracking-[-0.02em]">{title}</h1>
              {subtitle && <p class="text-sm text-charcoal/50 mt-1">{subtitle}</p>}
            </div>
            <nav class="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  class={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                    item.active
                      ? 'bg-navy/5 text-navy font-medium'
                      : 'text-charcoal/60 hover:text-charcoal hover:bg-sand/20'
                  }`}
                >
                  <span class="w-4 h-4 shrink-0">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            {variant === 'admin' && (
              <div class="mt-8 p-4 rounded-xl bg-coffee/5 border border-coffee/10">
                <p class="text-[0.625rem] tracking-[0.2em] uppercase text-coffee/70 font-medium">Admin</p>
                <p class="text-xs text-charcoal/60 mt-1.5">Acceso restringido a administradores del sistema.</p>
              </div>
            )}
          </aside>

          <main class="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
