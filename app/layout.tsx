import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jhin — Your AI organization, self-hosted",
  description:
    "Jhin is an open-source, self-hosted platform for building hierarchical teams of autonomous AI agents — with durable workflows, scoped permissions, triggers, and human approvals built in.",
  metadataBase: new URL("https://jhin.ai"),
  openGraph: {
    title: "Jhin — Your AI organization, self-hosted",
    description:
      "Build a company of AI agents. Open source, self-hosted, one command to install.",
    url: "https://jhin.ai",
    siteName: "Jhin",
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem("jhin-theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
