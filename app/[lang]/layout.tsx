import type { Metadata } from "next";
import { Nav } from "../components/Nav";
import type { Lang } from "../../data/data";

export const metadata: Metadata = {
  title: "Leonardo Vasconcellos — Full-Stack Engineer",
  description:
    "Senior full-stack engineer with ~20 years and ~70 shipped projects. From Doctors Without Borders to smart cities — mission-critical systems built to last.",
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export const dynamicParams = false;

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div className="lv-app">
      <Nav lang={lang as Lang} />
      <main className="lv-scroll">{children}</main>
    </div>
  );
}
