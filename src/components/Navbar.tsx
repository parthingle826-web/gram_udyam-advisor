"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardCheck,
  LayoutDashboard,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const navigation = [
    {
      name: t("home") || "Home",
      href: "/",
      icon: Home,
    },
    {
      name: t("assessment") || "Assessment",
      href: "/assessment",
      icon: ClipboardCheck,
    },
    {
      name: t("dashboard") || "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("viewReport") || "Report",
      href: "/report",
      icon: FileText,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo-navbar.png"
            alt="Gram Udyam Advisor logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain"
            priority
          />

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Gram Udyam
            </div>

            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Advisor
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white dark:bg-indigo-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    active
                      ? "bg-slate-900 text-white dark:bg-indigo-600"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}