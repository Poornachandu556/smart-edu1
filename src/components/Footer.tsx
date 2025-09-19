import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/15">
      <div className="container-px mx-auto py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">SE</div>
            <p className="text-sm text-foreground/70">AI-Powered Smart Education for the digital age.</p>
          </div>
          <div>
            <p className="mb-3 font-semibold">Company</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold">Legal</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold">Follow</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/50 dark:hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80"><path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.9-2.6 1.1A4 4 0 0 0 12 8.4c0 .3 0 .6.1.9-3.3-.2-6.3-1.8-8.2-4.3-.3.6-.4 1.2-.4 1.9a4 4 0 0 0 1.8 3.3c-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.6 2 2.8 3.8 2.8A8.1 8.1 0 0 1 2 19.5c1.8 1.2 3.9 1.9 6.2 1.9 7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.5 1.4-1.2 1.9-1.9z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/50 dark:hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80"><path d="M6.94 6.5A2.19 2.19 0 1 1 4.75 4.3 2.18 2.18 0 0 1 6.94 6.5zM7 8.91H3.88V20H7zM20.12 20h-3.15v-5.48c0-1.31 0-3-1.82-3s-2.1 1.42-2.1 2.9V20H9.9V8.91h3v1.5h.04a3.3 3.3 0 0 1 3-1.65c3.21 0 3.8 2.11 3.8 4.85z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-foreground/60">© {new Date().getFullYear()} SmartEdu. All rights reserved.</div>
      </div>
    </footer>
  );
}


