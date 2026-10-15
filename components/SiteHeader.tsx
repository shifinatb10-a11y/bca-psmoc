"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { Crest } from "./Crest";
import { Container } from "./ui";
import { MAIN_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-brand-950 text-brand-100 md:block">
        <Container className="flex h-9 items-center justify-between text-[11.5px] tracking-wide">
          <span>Affiliated to the University of Calicut · NAAC Accredited</span>
          <span className="flex items-center gap-4">
            <span>PSMO College (Autonomous), Tirurangadi</span>
          </span>
        </Container>
      </div>

      <div className="border-b border-ink-100 bg-white/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Crest className="h-10 w-10 shrink-0" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-semibold text-ink-900 sm:text-base">
                PSMO College (Autonomous)
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                Department of Computer Applications
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-lg border border-ink-100 px-3.5 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 sm:inline-flex"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </div>

      {/* Three-line menu drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink-900/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <Crest className="h-8 w-8" />
              <span className="text-sm font-semibold text-ink-900">Menu</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 text-ink-500 hover:text-ink-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "mb-1 flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                    active ? "bg-brand-50" : "hover:bg-ink-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      active
                        ? "bg-brand-600 text-white"
                        : "bg-ink-100 text-ink-700",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        active ? "text-brand-700" : "text-ink-900",
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-ink-500">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-ink-100 p-4">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Login
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
