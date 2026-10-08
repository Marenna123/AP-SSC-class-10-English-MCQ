import React from 'react';
import { BookOpen, Search, Bookmark, Sparkles, ShieldCheck, Smartphone } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenAdmin: () => void;
  onOpenInstall?: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenBookmarks,
  onOpenAdmin,
  onOpenInstall,
  bookmarkCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate font-['Outfit',sans-serif]">
                AP SSC Class 10 English
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200/80">
                2026–27
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate">
              MCQ Learning & Board Exam Practice
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Search Questions & Lessons"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            id="header-bookmarks-btn"
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            title="Bookmarked Questions"
            aria-label="Bookmarks"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarkCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {bookmarkCount > 99 ? '99+' : bookmarkCount}
              </span>
            )}
          </button>

          {onOpenInstall && (
            <button
              id="header-install-btn"
              onClick={onOpenInstall}
              className="px-2.5 py-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer"
              title="Install App on Android Phone"
            >
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors text-xs font-semibold flex items-center gap-1"
            title="Admin & Question Bank Manager"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
