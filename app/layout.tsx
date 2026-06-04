import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";
import { Nav } from "./components/Nav";

export const metadata: Metadata = {
  title: "Leonardo Vasconcellos — Full-Stack Engineer",
  description:
    "Senior full-stack engineer with ~20 years and ~70 shipped projects. From Doctors Without Borders to smart cities — mission-critical systems built to last.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <LanguageProvider>
          <div className="lv-app">
            <Nav />
            <main className="lv-scroll">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
