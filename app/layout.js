import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { Github, Linkedin, MessageCircle } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AXION AI - Your AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo1.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="border-t bg-muted/50">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-300 md:flex-row">
                <p className="text-center md:text-left">
                  © {new Date().getFullYear()} AXION AI . All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="https://www.linkedin.com/in/pankaj-saini1132/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="transition-colors hover:text-white"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://github.com/pankaj1132"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="transition-colors hover:text-white"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://wa.me/918851821053"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="transition-colors hover:text-white"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
