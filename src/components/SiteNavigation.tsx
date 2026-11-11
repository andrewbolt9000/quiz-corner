import Link from "next/link";

export default function SiteNavigation() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="rounded font-bold tracking-tight text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400"
        >
          Quiz Corner
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-2 text-sm font-medium sm:gap-4"
        >
          <Link
            href="/"
            className="rounded px-2 py-1.5 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-indigo-400"
          >
            All Quizzes
          </Link>
          <Link
            href="/font-identification/"
            className="rounded px-2 py-1.5 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-indigo-400"
          >
            Font Identification
          </Link>
          <Link
            href="/quizzes/font-knowledge/"
            className="rounded px-2 py-1.5 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-indigo-400"
          >
            Font Knowledge
          </Link>
          <Link
            href="/font-library/"
            className="rounded px-2 py-1.5 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-indigo-400"
          >
            Font Library
          </Link>
          {process.env.NODE_ENV !== "production" && (
            <Link
              href="/font-archive/"
              className="rounded px-2 py-1.5 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-indigo-400"
            >
              Local Font Archive
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
