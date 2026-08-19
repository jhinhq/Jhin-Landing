import Image from "next/image";
import { GITHUB_URL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-14 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/mark.svg"
            alt="Jhin logo"
            width={22}
            height={36}
            className="h-9 w-auto"
          />
          <div>
            <p className="font-display font-bold leading-tight">Jhin</p>
            <p className="text-xs text-muted">
              Your AI organization, self-hosted.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="#org" className="transition-colors hover:text-ink">
            Organization
          </a>
          <a href="#features" className="transition-colors hover:text-ink">
            Features
          </a>
          <a href="#install" className="transition-colors hover:text-ink">
            Install
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        MIT licensed · built in the open · jhin.ai
      </div>
    </footer>
  );
}
