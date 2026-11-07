import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Logo />
      <p className="hidden text-sm font-medium text-neutral-500 sm:block">
        Overheard, on repeat.
      </p>
    </header>
  );
}
