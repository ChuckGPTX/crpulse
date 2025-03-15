import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center">
          <Logo />
          <span className="ml-2 text-xl font-medium">chuck</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/use-cases" className="text-sm hover:text-accent">
            Use cases
          </Link>
          <Link href="/spaces" className="text-sm hover:text-accent">
            Spaces
          </Link>
          <Link href="/benchmarks" className="text-sm hover:text-accent">
            Benchmarks
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/get-started">Get Started</Link>
        </Button>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 5.25C9.17 5.25 5.25 9.17 5.25 14C5.25 18.83 9.17 22.75 14 22.75C16.0733 22.75 17.99 22.05 19.5132 20.8767C20.3967 20.1633 19.8533 18.83 18.76 18.83H14.9333C12.6933 18.83 10.8733 17.01 10.8733 14.77V11.9C10.8733 10.5 12.3667 9.66333 13.58 10.3767C14.0967 10.68 14.7167 10.8067 15.3367 10.7533C16.7367 10.6467 17.92 9.77333 18.4633 8.54C18.83 7.7 19.7133 7.14 20.65 7.28C21.9567 7.49 23.0967 8.18667 23.9567 9.17C22.7033 6.83667 19.67 5.25 16.3333 5.25H14Z"
        fill="hsl(var(--chuck-accent-1))"
      />
      <path
        d="M18.76 18.83C19.8533 18.83 20.3967 20.1633 19.5133 20.8767C17.5 22.4233 14.8867 23.2133 12.2033 22.89C8.47 22.4467 5.46333 19.5767 4.88333 15.8667C4.69667 14.5367 4.78333 13.2533 5.11 12.0633C5.46333 10.7567 6.78333 9.94333 8.09 10.2967C9.68333 10.7333 10.7067 12.3033 10.5667 13.9667L10.5433 14.35C10.4267 15.9433 11.6867 17.2967 13.2567 17.2967H18.76V18.83Z"
        fill="hsl(var(--chuck-accent-2))"
      />
    </svg>
  );
}
