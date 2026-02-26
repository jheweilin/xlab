"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryWithChildren } from "@/types";
import { Logo } from "./Logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories?activeOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data.filter((c: CategoryWithChildren) => !c.parentId));
        }
      });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-xlab-darker/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              首頁
            </Link>

            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                >
                  {category.name}
                  {category.children && category.children.length > 0 && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>

                {category.children && category.children.length > 0 && (
                  <div
                    className={cn(
                      "absolute top-full left-0 pt-2 transition-all duration-200",
                      activeCategory === category.id
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    )}
                  >
                    <div className="bg-xlab-dark rounded-lg border border-white/10 shadow-xl py-2 min-w-[200px]">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/products"
              className="text-white/80 hover:text-white transition-colors"
            >
              所有商品
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="py-4 space-y-4">
            <Link
              href="/"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              首頁
            </Link>

            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="block text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="pl-4 mt-2 space-y-2">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="block text-white/60 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/products"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              所有商品
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
